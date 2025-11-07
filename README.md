# Success Driven Amaka

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
- **E-Commerce Store (Success Shop):** Sell digital courses or physical products with a Paystack-powered checkout flow.
- **Newsletter:** A dedicated landing page for newsletter sign-ups and management.
- **User Account Page:** Registered users can view order history and manage their profiles.
- **Product Reviews:** Includes “Verified Purchase” logic for authentic reviews.

---

### 🔒 Admin Dashboard
- **Secure Routes:** All `/admin` pages are protected and redirect unauthorized users.
- **Content Management (Full CRUD):**
  - Blog Manager (Create, Edit, Delete)
  - Achievements Manager (Create, Edit, Delete)
  - Product Manager (Create, Edit, Delete)
- **File Manager:** Integrated Supabase Storage with image previews and modal-based file selection.
- **Comment Moderation:** Approve or delete user comments directly from the dashboard.
- **Subscriber Management:** View all newsletter subscribers and export CSVs for Substack/Beehiiv integration.
- **Site Settings:** Update home/about content, photos, bios, and social links - all instantly reflected on the live site.
- **Analytics Page:** Basic admin-only analytics overview for traffic and engagement metrics.
- *(Upcoming: Review moderation, extended analytics features)*

---

## 🖼️ Screenshots

<img width="2510" height="1416" alt="07 11 2025_01 02 59_REC" src="https://github.com/user-attachments/assets/cc39870b-6b6a-4caf-8efa-a66eaab28795" />

<img width="2522" height="1410" alt="07 11 2025_01 13 33_REC" src="https://github.com/user-attachments/assets/4afc36c0-772e-4abe-8119-05f94f1568c6" />

<img width="2514" height="1422" alt="07 11 2025_01 04 46_REC" src="https://github.com/user-attachments/assets/dad46c74-8b4d-4f4f-a4ee-2a8db3ace302" />

<img width="2520" height="1416" alt="07 11 2025_01 04 08_REC" src="https://github.com/user-attachments/assets/59067495-215c-430e-bdc1-ac34e330b10b" />

<img width="2514" height="1428" alt="07 11 2025_01 07 33_REC" src="https://github.com/user-attachments/assets/efb039a1-e4be-4cd0-85c8-0f43e3fc6d02" />

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Backend / Database** | Supabase (PostgreSQL, Auth, RLS, Storage) |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Payments** | Paystack |
| **Email / Forms** | Resend |
| **Deployment** | Vercel |

---

## ⚙️ System Overview

### 1. Content Management System (CMS)
All blog posts, products, achievements, and homepage content are fully manageable from the admin dashboard.  
Dynamic updates are reflected instantly across all pages without redeployment.

### 2. Authentication & Role-Based Access
Supabase handles authentication, with JWT-based role checks.  
Admins have full access to content dashboards, while regular users can manage profiles and purchases.

### 3. E-Commerce Flow
Paystack handles secure payments for digital and physical items.  
After checkout, the user’s purchase history updates dynamically in their account dashboard.

### 4. File & Media Handling
A custom file manager allows admins to upload and select images directly inside form modals, powered by Supabase Storage and React state management.

---

## 🔮 Future Enhancements
- Enhanced site analytics for sales and content performance.
- Review moderation panel for the admin dashboard.
- OAuth (Google, LinkedIn) for easier sign-in.
- Multi-admin support and activity logs.

---

## 📜 License
This project is proprietary and developed for **Success Driven Amaka**.  
All rights reserved © 2025 — Developed by **Lotanna Wisdom Iwuala**.

---


