# 🚀 ProjectPulse

**Manage Projects. Without the Chaos.**

ProjectPulse is a modern, full-stack SaaS (Software as a Service) application designed for high-performance teams to track tasks, manage sprints, and deliver results.

**[View Live Demo](https://p1-project-1-saa-s-dashboard-with-s-delta.vercel.app/)**

![ProjectPulse Screenshot](/home/divyu/.gemini/antigravity/brain/be28f95a-83ac-4706-b463-998a9c2e3299/after_clicking_view_pricing_1770118835550.png)

## 🎯 Why We Built THIS

This project serves as a **"Flagship" Portfolio Piece** designed to demonstrate mastery of the modern web development stack. It goes beyond simple tutorials to implement real-world features like:

- **Authentication** (Secure login/signup)
- **Database Integration** (Persistent data)
- **Payments** (Subscription model)
- **Production Deployment** (Live on the internet)

## 🛠️ Tech Stack

Built with the bleeding-edge "T3-style" stack:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/) Serverless)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [Auth.js](https://authjs.dev/) (NextAuth v5)
- **Payments**: [Stripe](https://stripe.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## ✨ Key Features

1.  **🔐 Secure Authentication**
    - Email/Password login
    - Protected routes (Middleware)
    - Session management

2.  **📊 Interactive Dashboard**
    - Real-time overview of projects
    - Quick actions and statistics

3.  **💳 Subscription Payments**
    - Integrated pricing page
    - Stripe Checkout processing
    - Tiered access (Free vs Pro)

4.  **🎨 Modern UI/UX**
    - Dark/Light mode support
    - Responsive design (Mobile first)
    - Beautiful glassmorphism effects

## 🚀 Getting Started Locally

1. **Clone the repo**

   ```bash
   git clone https://github.com/yourusername/projectpulse.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment**
   Copy `.env.example` to `.env` and add your keys (Neon DB, Auth Secret).

4. **Run the database**

   ```bash
   npx prisma db push
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

---

_Built by Divyanshu_
