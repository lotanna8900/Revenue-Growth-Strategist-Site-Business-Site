# Success Driven Amaka — Business & Strategy Platform

A full-stack personal brand and business platform built for **Amaka**, a *Revenue Growth Strategist*.  
This platform brings together her personal brand, blog, achievements, and online shop — all managed seamlessly through a custom-built admin dashboard.

Developed with a modern, type-safe Next.js stack and powered by Supabase, the site focuses on content flexibility, user engagement, and smooth scalability.

🌐 **Live Site:** [successdrivenamaka.com.ng](https://successdrivenamaka.com.ng)  
🔗 **Vercel Preview:** [revenue-growth-strategist-site-busi.vercel.app](https://revenue-growth-strategist-site-busi.vercel.app)

---

## 🚀 Key Features

### 🌍 Public-Facing Platform
- **Dynamic Homepage:** Displays featured achievements, products, and latest blog posts - all updated automatically from admin panel.
- **Authentication System:** Secure sign-up, sign-in, and forgot password flows with role-based routing.
- **About Page:** Fully editable from admin “Site Settings” - bio, photos, and social links are all dynamic.
- **Achievements (Portfolio):** Dedicated page highlighting completed projects, courses, and key milestones.
- **Blog:** Full blog system with nested comments (supports guests and registered users).
- **Success Shop (Digital & Physical):** Specialized e-commerce engine for selling digital courses, masterclasses, and physical products.
- **Automated Digital Fulfillment:** Instant digital access granting (via `user_access` logic) and automated email delivery (via Resend) immediately after Paystack payment verification.
- **Product Reviews:** Includes “Verified Purchase” logic for authentic reviews.
- **User Account Page:** Registered users can view order history and manage their profiles.

---

### 🔒 Admin Dashboard
- **Secure Routes:** All `/admin` pages are protected via Supabase RLS and Middleware.
- **Content Management (Full CRUD):**
  - **Blog Manager:** Create, Edit, Delete posts with rich content.
  - **Achievements Manager:** Showcasing success stories and milestones.
  - **Product Manager:** Manage Digital vs Physical items, inventory, and secure Access URLs.
- **File Manager:** Integrated Supabase Storage with image previews and modal-based file selection.
- **Comment Moderation:** Approve or delete user comments directly from the dashboard.
- **Subscriber Management:** View all newsletter subscribers and export CSVs for MailerLite/external CRM integration.
- **Site Settings:** Update home/about content, photos, bios, and social links instantly.
- **Analytics Page:** Admin-only analytics overview for traffic and engagement metrics.

---

## 🖼️ Screenshots

<img width="2510" height="1416" alt="Home Page" src="https://github.com/user-attachments/assets/cc39870b-6b6a-4caf-8efa-a66eaab28795" />

<img width="2522" height="1410" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/4afc36c0-772e-4abe-8119-05f94f1568c6" />

<img width="2514" height="1422" alt="Blog System" src="https://github.com/user-attachments/assets/dad46c74-8b4d-4f4f-a4ee-2a8db3ace302" />

<img width="2520" height="1416" alt="Store Front" src="https://github.com/user-attachments/assets/59067495-215c-430e-bdc1-ac34e330b10b" />

<img width="2514" height="1428" alt="Checkout Flow" src="https://github.com/user-attachments/assets/efb039a1-e4be-4cd0-85c8-0f43e3fc6d02" />

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Backend / Database** | Supabase (PostgreSQL, Auth, RLS, Storage) |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Payments** | Paystack (NGN Integration) |
| **Email / Delivery** | Resend |
| **Deployment** | Vercel |

---

## ⚙️ System Overview

### 1. Digital Product Architecture
The system utilizes a custom `user_access` table to track digital ownership. Upon successful payment verification through the Paystack API, the backend triggers an automated fulfillment sequence: granting DB permissions and dispatching a secure access link via Resend.



### 2. CMS & Mobile Management
The admin panel is optimized for mobile-first management, allowing the client to update course links, blog posts, and site metadata directly from a mobile device without code changes.

### 3. Authentication & Security
Supabase handles authentication with JWT-based role checks. Row Level Security (RLS) ensures that user purchase history and admin content remain strictly protected.

---

## 📜 License
This project is proprietary and developed for **Success Driven Amaka**.  
All rights reserved © 2026 — Developed by **Lotanna Wisdom Iwuala**.