'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type CheckoutResponse = {
  error?: string;
  authorization_url?: string;
};

export async function createCheckoutSession(
  previousState: CheckoutResponse | null,
  formData: FormData,
): Promise<CheckoutResponse> {
  const supabase = await createServerSupabaseClient();
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!paystackSecretKey) {
    return { error: 'Payment provider is not configured.' };
  }

  // 1. Get form data
  const productId = formData.get('productId') as string;
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;

  if (!productId || !fullName || !phone) {
    return { error: 'Please fill out all required fields.' };
  }

  // 2. Get the current user's email
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to purchase.' };
  }
  const userEmail = user.email!;

  // 3. Get the product details
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('name, price, sale_price')
    .eq('id', productId)
    .single();

  if (productError || !product) {
    return { error: 'Product not found.' };
  }

  const priceToCharge = product.sale_price || product.price;
  const amountInKobo = Math.round(priceToCharge * 100);

  // 4. Call the Paystack API
  try {
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        amount: amountInKobo,
        currency: 'NGN',
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/payment/success`,
        metadata: {
          product_id: productId,
          user_id: user.id,
          customer_name: fullName,
          customer_phone: phone,
          shipping_address: `${address || 'Digital'}, ${city || 'Digital'}, ${state || 'Digital'}`,
        },
      }),
    });

    const data = await paystackResponse.json();

    if (!data.status || !data.data.authorization_url) {
      return { error: `Payment gateway error: ${data.message}` };
    }

    return { authorization_url: data.data.authorization_url };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { error: 'Could not connect to payment gateway.' };
  }
}

export async function verifyPayment(reference: string) {
  const supabase = await createServerSupabaseClient();
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!paystackSecretKey) {
    throw new Error('Payment provider is not configured.');
  }

  try {
    // 1. Verify transaction with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    });

    const data = await paystackResponse.json();

    if (!data.status || data.data.status !== 'success') {
      throw new Error(`Payment verification failed: ${data.message}`);
    }
    
    const paymentData = data.data;
    const { product_id, user_id } = paymentData.metadata;
    const amountPaid = paymentData.amount / 100;

    // 2. Cross-check product and get Digital Info
    const { data: product } = await supabase
      .from('products')
      .select('name, price, sale_price, is_digital, access_url, type')
      .eq('id', product_id)
      .single();
    
    if (!product) throw new Error('Product not found.');
    
    const priceToCharge = product.sale_price || product.price;
    if (amountPaid < priceToCharge) {
      throw new Error('Amount paid does not match product price.');
    }

    // 3. Create the order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user_id,
        amount: amountPaid,
        status: 'completed',
        paystack_ref: reference,
      })
      .select('id')
      .single();

    if (orderError) throw new Error(`Order save failed: ${orderError.message}`);

    // 4. Create the order item
    await supabase.from('order_items').insert({
      order_id: newOrder.id,
      product_id: product_id,
      quantity: 1,
      price: amountPaid,
    });

    // 5. DIGITAL FULFILLMENT LOGIC
    if (product.is_digital && product.access_url) {
      // Grant Access in user_access table
      await supabase.from('user_access').insert({
        user_id: user_id,
        product_id: product_id,
      });

      // Send the access email
      const { data: userData } = await supabase.auth.admin.getUserById(user_id);
      const customerEmail = userData.user?.email;

      if (customerEmail) {
        try {
          await resend.emails.send({
            from: 'Success Driven Amaka <hello@yourdomain.com>',
            to: customerEmail,
            subject: `Access Granted: ${product.name}`,
            text: `Hi! Thank you for your purchase. You can access your ${product.type} here: ${product.access_url}\n\nTo your success,\nAmaka`,
          });
        } catch (resendErr) {
          console.error('Email delivery failed:', resendErr);
        }
      }
    }
    
    revalidatePath('/admin/analytics');
    return { success: true, orderId: newOrder.id };

  } catch (error) {
    console.error('Payment verification error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function submitReview(
  previousState: any,
  formData: FormData,
): Promise<{ error?: string; message?: string }> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in to leave a review.' };

  const productId = formData.get('productId') as string;
  const rating = parseInt(formData.get('rating') as string);
  const content = formData.get('content') as string;

  if (!productId || !rating) return { error: 'Product ID and rating are required.' };

  try {
    const { data: orderItem } = await supabase
      .from('order_items')
      .select('id, orders ( user_id, status )')
      .eq('product_id', productId)
      .eq('orders.user_id', user.id)
      .eq('orders.status', 'completed')
      .limit(1)
      .single();

    const isVerified = !!orderItem; 

    const { error: reviewError } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating: rating,
      content: content,
      is_verified_purchase: isVerified,
      status: isVerified ? 'approved' : 'pending',
    });

    if (reviewError) {
      if (reviewError.code === '23505') return { error: 'Review already submitted.' };
      throw reviewError;
    }

    revalidatePath(`/store/${formData.get('productSlug')}`);
    return { 
      message: isVerified ? 'Review published!' : 'Review awaiting moderation.' 
    };

  } catch (error) {
    console.error('Review error:', error);
    return { error: 'Failed to submit review.' };
  }
}