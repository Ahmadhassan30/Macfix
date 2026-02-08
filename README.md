<div align="center">

# MACFIX PRO

### Premium MacBook Repair Service Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

<br />

**A next-generation, award-winning repair booking and tracking system built with cutting-edge web technologies.**

[Live Demo](#demo) | [Documentation](#documentation) | [Architecture](#architecture) | [API Reference](#api-reference)

<br />

<img src="public/icon.png" alt="MacFix Logo" width="80" />

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [API Reference](#api-reference)
- [Component Library](#component-library)
- [Design System](#design-system)
- [Animation System](#animation-system)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**MacFix Pro** is a full-stack, production-grade web application designed for professional MacBook repair services. The platform provides an end-to-end solution for:

- **Customers**: Book repairs, track repair progress in real-time, purchase genuine accessories
- **Administrators**: Manage bookings, update repair statuses, maintain product catalog, send notifications

The application emphasizes **premium user experience**, featuring cinematic scroll animations, micro-interactions, and a sophisticated dark-mode design language inspired by Apple's design philosophy.

### Core Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Precision** | Type-safe codebase with TypeScript + Zod validation |
| **Performance** | Optimized image sequences, lazy loading, edge-ready deployment |
| **Aesthetics** | Award-winning UI with Framer Motion animations |
| **Scalability** | Modular architecture with Prisma ORM + PostgreSQL |

---

## Features

### Repair Booking System
- Multi-step service request form with real-time validation
- Automatic tracking code generation (NanoID)
- Email confirmation with branded templates
- MacBook model selection with comprehensive device list

### Real-Time Tracking
- Unique tracking code per booking
- 7-stage status workflow (Received → Diagnosing → Repairing → Testing → Ready → Completed)
- Visual timeline with animated status updates
- Deep-link support for instant status checks

### E-Commerce Module
- Product catalog with category filtering
- Shopping cart with localStorage persistence
- Order checkout flow with validation
- Inventory management (in-stock status)

### Admin Dashboard
- Comprehensive statistics overview
- Booking management with status updates
- Product CRUD operations
- Customer notification system (email)

### Cinematic Animations
- Image sequence scroll animation (192 frames)
- GSAP + Framer Motion hybrid system
- Loading screen with progress indicator
- Smooth Lenis scroll integration

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15 | React Framework (App Router) |
| **React** | 19 | UI Library |
| **TypeScript** | 5 | Type Safety |
| **Tailwind CSS** | 3.4 | Utility-First Styling |
| **Framer Motion** | 12 | Animations & Gestures |
| **GSAP** | 3.14 | Advanced Scroll Animations |
| **Lenis** | 1.3 | Smooth Scrolling |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Hono** | 4.11 | Lightweight API Framework |
| **Prisma** | 7.3 | ORM & Database Toolkit |
| **PostgreSQL** | - | Primary Database |
| **Zod** | 4.3 | Runtime Schema Validation |
| **Nodemailer** | 8.0 | Email Delivery |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **UploadThing** | File Upload Service (Product Images) |
| **pnpm** | Fast Package Manager |
| **ESLint** | Code Quality |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐    │
│   │   Landing   │   │    Book     │   │    Track    │   │   Products  │    │
│   │    Page     │   │   Repair    │   │   Status    │   │    Store    │    │
│   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘    │
│          │                 │                 │                 │           │
│   ┌──────┴─────────────────┴─────────────────┴─────────────────┴──────┐    │
│   │                      SHARED COMPONENTS                            │    │
│   │  DockHeader │ ChipScroll │ MacBookScroll │ SmoothScroll │ Cart  │    │
│   └──────────────────────────────┬────────────────────────────────────┘    │
│                                  │                                          │
├──────────────────────────────────┼──────────────────────────────────────────┤
│                          CONTEXT LAYER                                      │
│                                  │                                          │
│   ┌──────────────────────────────┴──────────────────────────────────┐      │
│   │                       CartContext                                │      │
│   │         (React Context + localStorage persistence)               │      │
│   └──────────────────────────────┬──────────────────────────────────┘      │
│                                  │                                          │
├──────────────────────────────────┼──────────────────────────────────────────┤
│                              API LAYER                                      │
│                                  │                                          │
│   ┌──────────────────────────────┴──────────────────────────────────┐      │
│   │                    Hono API Router                               │      │
│   │              /api/[[...routes]]/route.ts                         │      │
│   ├──────────────────────────────────────────────────────────────────┤      │
│   │  POST /bookings        │  GET /bookings/track/:code              │      │
│   │  POST /bookings/:id/updates                                      │      │
│   │  GET  /products        │  POST /products                         │      │
│   │  POST /orders          │  GET  /health                           │      │
│   └──────────────────────────────┬──────────────────────────────────┘      │
│                                  │                                          │
├──────────────────────────────────┼──────────────────────────────────────────┤
│                             DATA LAYER                                      │
│                                  │                                          │
│   ┌──────────────────────────────┴──────────────────────────────────┐      │
│   │                      Prisma ORM                                  │      │
│   │               @prisma/adapter-pg (Driver)                        │      │
│   └──────────────────────────────┬──────────────────────────────────┘      │
│                                  │                                          │
│   ┌──────────────────────────────┴──────────────────────────────────┐      │
│   │                     PostgreSQL                                   │      │
│   │            (Bookings, Products, Orders, Admins)                  │      │
│   └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Request Flow

```
User Action → React Component → Fetch API → Hono Router → Zod Validation → Prisma Query → PostgreSQL
                     ↑                                                              │
                     └────────────────── JSON Response ─────────────────────────────┘
```

---

## Project Structure

```
macfix/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.ts                # Development data seeding
│
├── public/
│   ├── sequences/             # MacBook scroll animation frames (192 WebP images)
│   └── icon.png               # Application logo
│
├── scripts/
│   └── [utility scripts]      # Build & deployment helpers
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/             # Admin dashboard routes
│   │   │   ├── bookings/      # Booking management
│   │   │   └── products/      # Product management
│   │   ├── api/               # API routes
│   │   │   ├── [[...routes]]/ # Hono catch-all router
│   │   │   └── uploadthing/   # File upload handlers
│   │   ├── book/              # Repair booking page
│   │   ├── checkout/          # Shopping cart checkout
│   │   ├── products/          # Product catalog
│   │   ├── track/             # Repair status tracking
│   │   ├── globals.css        # Global styles + Tailwind
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Landing page
│   │
│   ├── components/            # Reusable UI components
│   │   ├── BookingStatusManager.tsx  # Admin status controls
│   │   ├── ChipScroll.tsx     # Image sequence animation
│   │   ├── DockHeader.tsx     # Floating navigation dock
│   │   ├── MacBookScroll.tsx  # Secondary scroll animation
│   │   ├── ProductActions.tsx # Add-to-cart buttons
│   │   └── SmoothScroll.tsx   # Lenis scroll wrapper
│   │
│   ├── context/               # React Context providers
│   │   └── CartContext.tsx    # Shopping cart state management
│   │
│   ├── lib/                   # Shared utilities
│   │   ├── email.ts           # Nodemailer configuration
│   │   └── prisma.ts          # Prisma client singleton
│   │
│   └── utils/                 # Helper functions
│       └── [utilities]
│
├── .env                       # Environment variables (git-ignored)
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies & scripts
├── prisma.config.ts           # Prisma configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

---

## Database Design

### Entity Relationship Diagram

```
┌──────────────────────┐         ┌──────────────────────┐
│       Booking        │         │    TrackingUpdate    │
├──────────────────────┤         ├──────────────────────┤
│ id            (PK)   │────────<│ id            (PK)   │
│ customerName         │         │ bookingId     (FK)   │
│ email                │         │ status              │
│ phone                │         │ message             │
│ device               │         │ createdAt           │
│ issue                │         └──────────────────────┘
│ status               │
│ trackingCode  (UQ)   │
│ createdAt            │
│ updatedAt            │
└──────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│       Product        │         │      OrderItem       │
├──────────────────────┤         ├──────────────────────┤
│ id            (PK)   │────────<│ id            (PK)   │
│ name                 │         │ orderId       (FK)   │
│ description          │         │ productId     (FK)   │
│ price                │         │ quantity            │
│ imageUrl             │         │ price               │
│ category             │         └──────────────────────┘
│ inStock              │                     │
│ createdAt            │                     │
│ updatedAt            │                     ▼
└──────────────────────┘         ┌──────────────────────┐
                                 │        Order         │
┌──────────────────────┐         ├──────────────────────┤
│        Admin         │         │ id            (PK)   │
├──────────────────────┤         │ customerName         │
│ id            (PK)   │         │ email                │
│ email         (UQ)   │         │ phone                │
│ name                 │         │ address              │
│ password (hashed)    │         │ city / zip / country │
│ createdAt            │         │ total                │
└──────────────────────┘         │ status               │
                                 │ createdAt / updatedAt│
                                 └──────────────────────┘
```

### Enumerations

#### BookingStatus
```typescript
enum BookingStatus {
  RECEIVED    // Initial status - booking created
  DIAGNOSING  // Technician diagnosing issue
  REPAIRING   // Active repair in progress
  TESTING     // Quality assurance testing
  READY       // Ready for pickup/delivery
  COMPLETED   // Service completed
  CANCELLED   // Booking cancelled
}
```

#### ProductCategory
```typescript
enum ProductCategory {
  CHARGER | BATTERY | SCREEN | KEYBOARD |
  TRACKPAD | CABLE | ADAPTER | CASE | OTHER
}
```

#### OrderStatus
```typescript
enum OrderStatus {
  PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
}
```

---

## API Reference

### Base URL
```
/api
```

### Endpoints

#### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/bookings` | Create new repair booking |
| `GET` | `/bookings/track/:code` | Track booking by code |
| `POST` | `/bookings/:id/updates` | Add status update |

##### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "device": "MacBook Pro 14-inch M3 (2023)",
  "issue": "Screen flickering when using external display"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "trackingCode": "MK29X8WZ1Q",
  "message": "Booking created successfully",
  "booking": {
    "id": "clx123...",
    "customerName": "John Doe",
    "device": "MacBook Pro 14-inch M3 (2023)",
    "status": "RECEIVED",
    "createdAt": "2025-02-08T12:00:00.000Z"
  }
}
```

##### Track Booking
```http
GET /api/bookings/track/MK29X8WZ1Q
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "clx123...",
    "customerName": "John Doe",
    "device": "MacBook Pro 14-inch M3 (2023)",
    "status": "REPAIRING",
    "createdAt": "2025-02-08T12:00:00.000Z",
    "updatedAt": "2025-02-08T14:30:00.000Z"
  },
  "updates": [
    {
      "id": "upd123...",
      "status": "REPAIRING",
      "message": "Display connector identified as faulty. Replacement in progress.",
      "createdAt": "2025-02-08T14:30:00.000Z"
    }
  ]
}
```

#### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | List all products |
| `POST` | `/products` | Create new product |

##### List Products
```http
GET /api/products?category=CHARGER&inStock=true
```

#### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orders` | Create new order |

#### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | API health status |

### Validation (Zod Schemas)

All request bodies are validated using Zod schemas:

```typescript
// Booking Schema
const createBookingSchema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  device: z.string().min(3),
  issue: z.string().min(10),
});

// Status Update Schema
const updateBookingSchema = z.object({
  status: z.enum(['RECEIVED', 'DIAGNOSING', 'REPAIRING', ...]),
  message: z.string().min(2),
  notify: z.boolean().default(true),
});
```

---

## Component Library

### Core Components

#### DockHeader
Floating navigation dock with glassmorphism effect.

```tsx
<DockHeader />

// Features:
// - Animated entrance (Framer Motion)
// - Hover-triggered dropdown menus
// - Responsive mobile adaptation
// - Pill-shaped floating design
```

#### ChipScroll
192-frame image sequence animation tied to scroll progress.

```tsx
<HeroAnimation />

// Configuration:
const TOTAL_FRAMES = 192;
const SCROLL_DISTANCE = 3000; // pixels
const FRAME_PATH = '/sequences/frame_';

// Features:
// - Progressive loading with progress indicator
// - Canvas rendering with DPR optimization
// - requestAnimationFrame for smooth playback
// - Automatic resize handling
```

#### SmoothScroll
Lenis smooth scrolling wrapper for the entire application.

```tsx
<SmoothScrolling />

// Provides:
// - Smooth momentum scrolling
// - Consistent cross-browser behavior
// - Works with scroll-linked animations
```

#### CartContext
Global shopping cart state management.

```tsx
const { items, addItem, removeItem, cartTotal, cartCount } = useCart();

// Features:
// - localStorage persistence
// - Quantity increment/decrement
// - Automatic total calculation
// - SSR-safe hydration
```

---

## Design System

### Typography

| Element | Font | Weight | Tracking |
|---------|------|--------|----------|
| Headings | Inter | 700-900 | -0.05em (tighter) |
| Body | Inter | 300-400 | Normal |
| Monospace | System Mono | 400 | 0.1em (widest) |

### Color Palette

```css
/* Primary */
--background: #000000;
--foreground: #ffffff;

/* Neutrals */
--neutral-50:  #fafafa;
--neutral-400: #a3a3a3;
--neutral-500: #737373;
--neutral-800: #262626;
--neutral-900: #171717;

/* Accents */
--blue-600: #2563eb;
--amber-600: #d97706;
--emerald-600: #059669;
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `px-6` | 24px | Container padding |
| `py-20` | 80px | Section vertical padding |
| `gap-2` | 8px | Tight component spacing |
| `gap-8` | 32px | Grid gaps |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-full` | 9999px | Buttons, pills |
| `rounded-3xl` | 24px | Cards, containers |
| `rounded-2xl` | 16px | Inputs, modals |

---

## Animation System

### Framer Motion Patterns

#### Entrance Animations
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

#### Scroll-Triggered
```tsx
<motion.div
  initial={{ opacity: 0, scaleY: 0 }}
  whileInView={{ opacity: 1, scaleY: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
```

#### Interactive States
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

### Scroll-Linked Animation (ChipScroll)

The hero section features a cinematic MacBook assembly animation:

1. **192 WebP frames** - Pre-rendered 3D animation
2. **Progressive loading** - First frame loads immediately, rest in batches
3. **Scroll mapping** - `scrollY / 3000px → frame (0-191)`
4. **Canvas rendering** - High-DPI with object-fit contain
5. **Layer composition** - Text overlays fade in/out at specific frames

```tsx
// Frame calculation
const progress = scrollY / SCROLL_DISTANCE;
const frame = Math.min(
  Math.floor(progress * TOTAL_FRAMES),
  TOTAL_FRAMES - 1
);
```

---

## Installation & Setup

### Prerequisites

- **Node.js** 18.x or later
- **pnpm** 9.x
- **PostgreSQL** 14.x or later

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/macfix.git
cd macfix

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database URL and SMTP credentials

# 4. Push database schema
pnpm prisma db push

# 5. Seed development data (optional)
pnpm prisma db seed

# 6. Start development server
pnpm dev
```

### Database Setup

```bash
# Generate Prisma Client
pnpm prisma generate

# Push schema to database
pnpm prisma db push

# Open Prisma Studio (GUI)
pnpm prisma studio
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/macfix"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="MacFix Support <support@macfix.com>"

# UploadThing (File Uploads)
UPLOADTHING_TOKEN="your-uploadthing-token"
```

---

## Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
pnpm i -g vercel

# 2. Deploy
vercel --prod
```

**Configuration:**
- Set `NEXT_PUBLIC_APP_URL` to your production domain
- Connect PostgreSQL (Neon, Supabase, or Railway recommended)
- Add UploadThing token

### Docker

```dockerfile
FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use **TypeScript** for all new files
- Follow **ESLint** configuration
- Write **meaningful commit messages**
- Add **JSDoc comments** for complex functions

---

## License

This project is proprietary software. All rights reserved.

---

<div align="center">

### Built with precision in Lahore, Pakistan

**Design & Code by [Ahmad Hassan](https://ahmadhassan.engineer/)**

Est. 2025

</div>
