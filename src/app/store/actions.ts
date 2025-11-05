'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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

  if (!productId || !fullName || !phone || !address || !city || !state) {
    return { error: 'Please fill out all required fields.' };
  }

  // 2. Get the current user's email
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to purchase.' };
  }
  const userEmail = user.email!;

  // 3. Get the product details from our database
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
        callback_url: `http://localhost:3000/store/payment/success`,
        metadata: {
          product_id: productId,
          user_id: user.id,
          customer_name: fullName,
          customer_phone: phone,
          shipping_address: `${address}, ${city}, ${state}`,
        },
      }),
    });

    const data = await paystackResponse.json();

    if (!data.status || !data.data.authorization_url) {
      return { error: `Payment gateway error: ${data.message}` };
    }

    // 5. Return the payment URL
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

    // 2. Get metadata to find out what was purchased
    const { product_id, user_id } = paymentData.metadata;
    const amountPaid = paymentData.amount / 100; // Convert from Kobo to Naira

    // 3. Get the product price from the DB to cross-check
    const { data: product } = await supabase
      .from('products')
      .select('price, sale_price')
      .eq('id', product_id)
      .single();
    
    if (!product) {
      throw new Error('Product not found in our database.');
    }
    
    // Cross-check price (allowing for small discrepancies if needed)
    const priceToCharge = product.sale_price || product.price;
    if (amountPaid < priceToCharge) {
      throw new Error('Amount paid does not match product price.');
    }

    // 4. Create the new order in my database
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

    if (orderError) {
      throw new Error(`Failed to save order: ${orderError.message}`);
    }

    // 5. Create the order item
    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: newOrder.id,
        product_id: product_id,
        quantity: 1, // Only support 1 item for now
        price: amountPaid,
      });

    if (itemError) {
      throw new Error(`Failed to save order item: ${itemError.message}`);
    }
    
    // 6. (Optional) Decrement stock
    // I'll add this later. For now, just record the sale.
    
    // 7. Revalidate paths and return success
    revalidatePath('/admin/analytics'); // Update analytics
    return { success: true, orderId: newOrder.id };

  } catch (error) {
    console.error('Payment verification error:', error);
    return { success: false, error: (error as Error).message };
  }
}