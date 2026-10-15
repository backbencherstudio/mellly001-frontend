# Cleen-N-Connect — Technical Handoff (Admin Dashboard)

**Release:** v1.3.0  
**Scope:** Frontend / Admin Dashboard Web Application  
**Status:** Completed & Production Verified  

---

## 1. Overview

This document contains the official technical handoff documentation prepared for the **Cleen-N-Connect Admin Dashboard**.

The purpose of this documentation is to provide all necessary instructions to set up, run, test, maintain, and deploy the admin dashboard frontend application. It also details the project's architecture, route structure, real-time Socket.IO integration, and API synchronization with the backend service.

---

## 2. Technology Stack & Architecture

The admin dashboard is engineered with modern web technologies emphasizing type safety, performance, and real-time responsiveness:

| Technology | Version / Tool | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Core React framework with server-side rendering & dynamic routing |
| **UI Library** | React 19 | Component hierarchy & state management |
| **Language** | TypeScript | 100% type safety and structured interfaces |
| **Styling** | Tailwind CSS & Radix UI | Modern, responsive dashboard design system |
| **State & API** | Redux Toolkit (RTK Query) | Client-side caching, tag invalidation, and automated data re-fetching |
| **Real-Time** | Socket.IO Client (`v4`) | Real-time dual-gateway connection (Live chat & instant notifications) |
| **Icons** | Lucide React | High-resolution SVG iconography |
| **Notifications** | Sonner | Clean, unobtrusive toast notifications |
| **Date Parsing** | Day.js | Date and timestamp formatting |
| **Cookie Storage** | js-cookie | Secure client-side authentication token and session management |

---

## 3. Prerequisites & System Requirements

Before running the application, ensure your environment meets the following specifications:

- **Node.js:** `v18.18.0` or higher (Recommended: `v20.x` or `v24.x` LTS)
- **Package Manager:** `npm` (`v9.x` or higher) / `yarn` / `pnpm`
- **Operating System:** macOS, Linux, or Windows (WSL2 recommended)
- **Browser Compatibility:** Chrome, Safari, Edge, Firefox (Modern ECMAScript 2022+ enabled)

---

## 4. Installation & Environment Configuration

### 4.1 Clone & Install Dependencies

Clone the frontend repository and install dependencies:

```bash
# Navigate to the project root directory
cd mellly001-frontend

# Install dependencies
npm install
```

### 4.2 Environment Variables Configuration

Create a `.env.local` file in the root of the project (if not already present):

```bash
touch .env.local
```

Populate the `.env.local` file with the following environment variables:

```env
# Backend Base REST API URL (with trailing slash)
NEXT_PUBLIC_API_URL=https://backend.cleennconnect.com/api/

# Real-Time Socket.IO URL (Root Origin without /api)
NEXT_PUBLIC_SOCKET_URL=https://backend.cleennconnect.com

# Image & Media Asset Host
NEXT_PUBLIC_API_IMG_URL=https://backend.cleennconnect.com
```

> **Note on URL Structure:**  
> - **REST API Calls:** Point to `https://backend.cleennconnect.com/api/`.
> - **Socket.IO Real-Time Gateway:** Handshake connects to `https://backend.cleennconnect.com` directly at the root origin.
> - **Next.js Image Optimization:** Both `backend.cleennconnect.com` and `cleennconnect.anikstudio.com` are whitelisted in `next.config.ts` under `images.remotePatterns`.

---

## 5. Running the Application

### 5.1 Development Mode

Start the Next.js local development server with Turbopack:

```bash
npm run dev
```

- Local URL: **`http://localhost:3000`**
- The development server automatically reloads upon source code changes.

### 5.2 Building for Production

Compile an optimized production build:

```bash
npm run build
```

This compiles all routes, validates TypeScript types (`tsc`), bundles CSS, and prerenders static routes.

### 5.3 Running the Production Server

To preview or launch the production build locally:

```bash
npm run start
```

Runs the production server on **`http://localhost:3000`**.

### 5.4 Code Quality & Linting

Run ESLint to check for code standards and lint errors:

```bash
npm run lint
```

### 5.5 Generating API Documentation (`.docx`)

To convert the complete API documentation into a formatted Microsoft Word document:

```bash
npm run generate:docx
```

Generates: `api-document.docx` in the project root directory.

---

## 6. Documentation & References

Comprehensive API specifications and technical schematics are available in the repository:

- **[REST & Socket.IO API Documentation (Markdown)](./api-document.md):**  
  Detailed documentation covering all 29 endpoints, parameters, JSON response samples, and real-time event definitions.
- **[REST & Socket.IO API Documentation (Word Table Format)](./api-document.docx):**  
  Formatted corporate handoff document containing all endpoints and socket lifecycles in structured tables.
- **[Backend Technical Handoff Document](../Backend/Backend.md):**  
  Corresponding backend handoff documentation.

---

## 7. Scope and Dashboard Route Map

The Admin Dashboard provides full operational oversight for the Cleen-N-Connect platform across the following dedicated views:

| Route Path | Module Name | Primary Responsibilities |
| :--- | :--- | :--- |
| **`/login`** | Authentication | Admin credentials login, JWT token issue, and `userType === "ADMIN"` verification. |
| **`/dashboard`** | Overview & Metrics | High-level KPI cards (Homeowners, Cleaners, Active Bookings, Revenue, Completed Jobs) and live activity feed. |
| **`/dashboard/homeowners`** | Homeowners | Manage registered homeowner accounts, view profile details, spending, and update account status (`ACTIVE` / `SUSPENDED`). |
| **`/dashboard/cleaners`** | Cleaners | Manage cleaner personnel, review ratings, completed jobs, earnings, and account status (`ACTIVE` / `SUSPENDED` / `INACTIVE`). |
| **`/dashboard/cleaner-request`** | Applications | Review cleaner onboarding submissions, inspect government IDs & resume documents, and execute `VERIFIED` or `REJECTED` decisions. |
| **`/dashboard/booking`** | Bookings | Monitor all customer service bookings, view scheduled times, assign cleaners, and update booking lifecycle status. |
| **`/dashboard/jobAppruve`** | Job Approvals | Inspect completed cleaning jobs with uploaded before/after photographic evidence and approve payout release. |
| **`/dashboard/danger-request`** | Emergency SOS | High-priority tracking for panic/emergency alerts triggered on job sites, complete with caller info and GPS coordinates. |
| **`/dashboard/support`** | Live Support Chat | Real-time messaging with homeowners and cleaners, supporting image/document attachments and online indicators. |
| **`/dashboard/notification`** | Notification Center | Complete notification hub with unread filters, instant detail preview modal, mark-as-read, and deletion controls. |

---

## 8. Real-Time Integration Architecture

The frontend integrates with the backend's dual-gateway Socket.IO infrastructure:

1. **Connection Singleton (`src/lib/Socket.ts`):**
   - Automatically initializes in the browser upon user authentication.
   - Extracts `token` from `Cookies.get("token")` for Chat Gateway authentication (`auth: { token }`).
   - Extracts `userId` from `Cookies.get("userId")` for Notification Gateway subscription (`query: { userId, token }`).
   - Auto-recovers `userId` by decoding the JWT payload if the cookie is temporarily missing.

2. **Real-Time Event Reactions:**
   - **`message`:** Appends new chat messages to the active room immediately and refreshes the conversation list preview.
   - **`receiveNotification`:** Triggers automatic RTK Query cache invalidation for the `Notification` tag, updates live bell badge counters, and displays audio/toast cues.
   - **`userStatusChange`:** Live green status dot toggles when support contacts go online or offline.
   - **`messageStatusUpdated`:** Synchronizes checkmark delivery receipts.

3. **Logout & Session Tear Down:**
   - Invoking `disconnectSocket()` upon admin logout unregisters all socket listeners, closes the websocket connection, and clears authentication cookies.

---

## 9. Access, Security, and Governance

- **Authentication Guard:** Non-admin users are strictly blocked from dashboard access. If `userType !== "ADMIN"`, the session is rejected.
- **Token Protection:** Authentication tokens are stored in browser cookies with `SameSite=strict` and transmitted exclusively over HTTPS.
- **Sensitive Credentials:** Never commit `.env.local` or private deployment credentials to public Git repositories.
- **Asset CORS & Domain Security:** All image URLs uploaded to backend storage are served through authenticated or whitelisted domains defined in `next.config.ts`.

---

## 10. Handoff Completion & Verification Checklist

To verify that the frontend handoff is complete and operational, the receiving team should perform the following checks:

- [x] Node.js dependencies installed successfully with `npm install`.
- [x] Environment variables verified in `.env.local`.
- [x] TypeScript compiler passes without errors (`npx tsc --noEmit`).
- [x] ESLint runs clean with zero errors on modified modules (`npm run lint`).
- [x] Production build passes completely (`npm run build`).
- [x] Admin login flow connects to `https://backend.cleennconnect.com/api/auth/login` and sets `token`, `userId`, and `userType` cookies.
- [x] Dashboard routes render data and handle pagination/filtering properly.
- [x] Real-time socket connects cleanly to `https://backend.cleennconnect.com` without `/api` trailing errors.
- [x] Notification detail modal opens, auto-marks as read, and reflects accurate live counts.
- [x] Documentation files ([api-document.md](./api-document.md) and [api-document.docx](./api-document.docx)) are accessible and up to date.

---

*Handoff documentation maintained by the Frontend Engineering Team.*
