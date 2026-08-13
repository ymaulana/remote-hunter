# 🚀 Project Specification: Global Remote Job Aggregator

**Project Name:** [Your Project Name, e.g., RemoteHunter / JobNexus]  
**Type:** Hybrid Job Portal (Aggregator + Direct Hiring Platform)  
**Target:** Production-Ready MVP  
**Architecture:** Next.js Fullstack Monorepo Approach

---

## 🛠 1. Tech Stack Overview

The following core technologies are selected to ensure scalability, performance, and a modern developer experience.

### **Core Framework & Language**

- [ ] **Next.js 15 (App Router):** Primary framework. Utilizing _Server Components_ for optimal data fetching performance and SEO.
- [ ] **TypeScript:** Strict mode enabled. No use of the `any` type. Guarantees _type-safety_ from the database to the frontend.

### **Backend & Database Services**

- [ ] **Supabase:**
  - **Database:** PostgreSQL (Cloud hosted).
  - **Auth:** Authentication flow (e.g., Email-Password, Google OAuth).
  - **Storage:** Bucket for storing candidate Resume files (PDF) and Company Logos.
- [ ] **Prisma ORM:** Database abstraction layer for writing safe, structured, and type-safe queries.
- [ ] **SerpApi:** 3rd party API for _seeding_ job data from Google Jobs (usage will be constrained via Cron Job).

### **Frontend & UI**

- [ ] **Tailwind CSS:** Utility-first CSS framework for rapid styling.
- [ ] **Shadcn/ui:** Collection of accessible and customizable components built on Radix UI.
- [ ] **Lucide React:** Standard industry icon set.

### **State Management & Data Fetching (The Hybrid Approach)**

- [ ] **TanStack Query (React Query):** Handles **Server State** (Caching job data, pagination, user profile). Minimizes server load.
- [ ] **Redux Toolkit:** Handles complex **Client State**, specifically for the _Global Filtering System_ (Search parameters, filter categories, salary range) that needs to persist across navigation.

### **Forms & Validation**

- [ ] **React Hook Form:** High-performance form state management (using uncontrolled components).
- [ ] **Zod:** Schema validation. Used for validating form input (client-side) AND validating API payloads (server-side).

---

## 🏗 2. Architecture & Data Flow

### **A. Database Schema Strategy (Prisma)**

- **User Role:** Uses an Enum `(SEEKER, RECRUITER, ADMIN)`.
- **Job Source:** Distinction between scraped jobs (`EXTERNAL`) and manually posted jobs (`INTERNAL`).
- **Relations:** - `User` 1-to-1 `Profile`
  - `Recruiter` 1-to-many `Jobs`
  - `User` many-to-many `Jobs` (via `Application` table)

### **B. Automation (The "Seeding" Cron Job)**

A crucial feature to keep website content fresh without constant manual input.

- **Trigger:** Vercel Cron / GitHub Actions (e.g., Daily at 00:00).
- **Process:** 1. Fetch data from SerpApi. 2. Map JSON response to the Prisma Schema format. 3. Use Prisma's `upsert` logic to prevent data duplication. 4. Auto-tag the job source as `EXTERNAL`.

### **C. Authentication & Security**

- [ ] **Middleware:** Next.js Middleware used to protect dashboard routes (`/dashboard/*`).
- [ ] **RLS (Row Level Security):** Although using Prisma (server-side), RLS concepts must be applied to API logic (User A cannot edit User B's job posting).

---

## ✅ 3. Development Checklist (MVP)

### **Phase 1: Foundation & Data Layer**

- [ ] Setup Next.js + TypeScript + ESLint + Prettier.
- [ ] Initialize Supabase Project & Connect Environment Variables.
- [ ] Setup Prisma Schema & Initial Migration.
- [ ] Implement the Cron Job Script (Fetch SerpApi -> Save to DB).
- [ ] Setup Redux Store (Filter Slice) & React Query Client.

### **Phase 2: Core UI & Public Features**

- [ ] Landing Page with Hero Section and Search Bar.
- [ ] Job Listing Page (Grid/List Layout) with Pagination.
- [ ] Integration of Filter UI (Redux) with Fetching Logic (React Query).
- [ ] Job Detail Page (Dynamic Route `[id]`) + Dynamic SEO Metadata.

### **Phase 3: Authentication & User Features**

- [ ] Login/Register Pages (Supabase Auth UI or Custom UI).
- [ ] Protected Route logic implementation.
- [ ] "Apply Now" Feature:
  - [ ] Resume upload to Supabase Storage.
  - [ ] Create entry in the `Application` table.

### **Phase 4: Recruiter Profile (Advanced Feature)**

- [ ] Profile Layout (Sidebar navigation).
- [ ] "Post a Job" Form (Rich Text Editor + Zod Validation).
- [ ] Table View: Viewing the list of applicants per job posting.

---

## 🧪 4. Quality Assurance (High Salary Requirements)

- [ ] **Type Check:** Run `tsc --noEmit` with zero errors.
- [ ] **Linting:** Zero remaining ESLint warnings.
- [ ] **Unit Test (Optional but Highly Recommended):** Test complex logic (Redux reducers, utility functions) using **Vitest**.
- [ ] **Accessibility (A11y):** Ensure all forms and buttons are keyboard-accessible (Tab navigation).
