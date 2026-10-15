# CleennConnect Admin Dashboard - API Documentation

> **Document Version:** 1.0.0  
> **Target Environment:** Production / Staging  
> **Base REST API URL:** `https://backend.cleennconnect.com/api/`  
> **Socket.IO Origin:** `https://backend.cleennconnect.com`  

---

## Table of Contents

1. [Architecture & Authentication](#1-architecture--authentication)
   - [Base URL & Protocol](#base-url--protocol)
   - [Authentication & Headers](#authentication--headers)
   - [Client-Side Cookie Storage](#client-side-cookie-storage)
   - [Cache Invalidation & RTK Query Tags](#cache-invalidation--rtk-query-tags)
2. [Authentication Module](#2-authentication-module)
   - [POST /api/auth/login](#post-apiauthlogin)
3. [Dashboard Overview & Analytics](#3-dashboard-overview--analytics)
   - [GET /api/dashboard/overview](#get-apidashboardoverview)
   - [GET /api/dashboard/activities](#get-apidashboardactivities)
   - [GET /api/users](#get-apiusers)
4. [Homeowners Management](#4-homeowners-management)
   - [GET /api/dashboard/homeowners/details](#get-apidashboardhomeownersdetails)
   - [PATCH /api/dashboard/homeowners/actions](#patch-apidashboardhomeownersactions)
5. [Cleaners Management](#5-cleaners-management)
   - [GET /api/dashboard/cleaners/details](#get-apidashboardcleanersdetails)
   - [PATCH /api/dashboard/cleaners/actions](#patch-apidashboardcleanersactions)
6. [Cleaner Applications & Verification](#6-cleaner-applications--verification)
   - [GET /api/dashboard/cleaners/request](#get-apidashboardcleanersrequest)
   - [GET /api/dashboard/cleaners/request/:id](#get-apidashboardcleanersrequestid)
   - [PATCH /api/dashboard/cleaners/request/:id](#patch-apidashboardcleanersrequestid)
   - [POST /api/cleaner-request/:id/cancel](#post-apicleaner-requestidcancel)
7. [Bookings Management](#7-bookings-management)
   - [GET /api/dashboard/bookings](#get-apidashboardbookings)
   - [GET /api/dashboard/bookings/:id](#get-apidashboardbookingsid)
   - [PATCH /api/dashboard/bookings/:id/status](#patch-apidashboardbookingsidstatus)
   - [PATCH /api/dashboard/bookings/:id/cleaner](#patch-apidashboardbookingsidcleaner)
   - [PATCH /api/dashboard/bookings/:id](#patch-apidashboardbookingsid)
8. [Job Approvals](#8-job-approvals)
   - [GET /api/dashboard/job-approvals](#get-apidashboardjob-approvals)
   - [PATCH /api/dashboard/job-approvals/:id](#patch-apidashboardjob-approvalsid)
9. [Emergency / Danger Requests](#9-emergency--danger-requests)
   - [GET /api/dashboard/danger/request](#get-apidashboarddangerrequest)
   - [PATCH /api/dashboard/danger/request/:id](#patch-apidashboarddangerrequestid)
10. [Support & Chat Module](#10-support--chat-module)
    - [GET /api/chat/conversation/conversation-list](#get-apichatconversationconversation-list)
    - [GET /api/chat/message/all-message/:conversationId](#get-apichatmessageall-messageconversationid)
    - [POST /api/chat/message/send-message](#post-apichatmessagesend-message)
    - [POST /api/chat/message/open-or-create-conversation](#post-apichatmessageopen-or-create-conversation)
11. [Notifications Module](#11-notifications-module)
    - [GET /api/notification](#get-apinotification)
    - [GET /api/notification/unread-count](#get-apinotificationunread-count)
    - [GET /api/notification/:id](#get-apinotificationid)
    - [PATCH /api/notification/read-all](#patch-apinotificationread-all)
    - [PATCH /api/notification/:id/read](#patch-apinotificationidread)
    - [DELETE /api/notification/:id](#delete-apinotificationid)
    - [DELETE /api/notification](#delete-apinotification)
12. [Socket.IO Real-Time Gateway](#12-socketio-real-time-gateway)
    - [Connection Handshake](#connection-handshake)
    - [Client to Server Events](#client-to-server-events)
    - [Server to Client Events](#server-to-client-events)
    - [Real-Time Notification & Chat Lifecycle](#real-time-notification--chat-lifecycle)

---

## 1. Architecture & Authentication

### Base URL & Protocol
- **REST Endpoints:** `https://backend.cleennconnect.com/api/`
- **Socket.IO Gateway:** `https://backend.cleennconnect.com` (Root domain without `/api`)
- All requests use standard JSON payloads unless file attachments are present (which use `multipart/form-data`).

### Authentication & Headers
All protected dashboard endpoints require a valid JWT Bearer token passed in the request header:

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### Client-Side Cookie Storage
On successful admin login, authentication tokens and identifiers are preserved in browser cookies:
- `token`: JWT access token for API authorization.
- `userId`: Admin user ID (used for socket subscription and query filtering).
- `userType`: Role guard, strictly requires `"ADMIN"`.

### Cache Invalidation & RTK Query Tags
The frontend uses Redux Toolkit (RTK) Query with the following cache tag types:
- `CleanerRequest`
- `JobApproval`
- `DangerRequest`
- `Conversation`
- `Homeowners`
- `Cleaners`
- `Bookings`
- `Notification`

Whenever a mutation (e.g. status update, assignment, or delete) completes, the respective cache tag is invalidated, triggering automatic background re-fetch and UI update without full-page reloads.

---

## 2. Authentication Module

### POST `/api/auth/login`
- **File / Hook:** `src/redux/features/auth/authApi.ts` (`useLoginMutation`)
- **Frontend Usage:** `src/app/(auth)/login/page.tsx`
- **Description:** Authenticates admin credentials, verifies `"ADMIN"` role permissions, and returns an access token.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | `string` | Yes | Admin registered email address |
| `password` | `string` | Yes | Admin account password |

```json
{
  "email": "admin@cleennconnect.com",
  "password": "SecurePassword123!"
}
```

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "type": "ADMIN",
  "authorization": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer"
  },
  "user": {
    "id": "67a89bc10d3e5f2a1b9c4d5e",
    "name": "Super Admin",
    "email": "admin@cleennconnect.com",
    "role": "ADMIN"
  }
}
```

---

## 3. Dashboard Overview & Analytics

### GET `/api/dashboard/overview`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetDashboardOverviewQuery`)
- **Frontend Usage:** `src/app/(admin-dashboard)/page.tsx`
- **Description:** Returns aggregate metric statistics for the main dashboard overview cards.

#### Request Query Parameters
*None*

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total_homeowners": 142,
    "total_cleaners": 58,
    "active_bookings": 24,
    "total_revenue": 18450.00,
    "completed_bookings": 312,
    "pending_bookings": 9
  }
}
```

---

### GET `/api/dashboard/activities`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetActivitiesQuery`)
- **Frontend Usage:** `src/app/(admin-dashboard)/page.tsx`
- **Description:** Returns recent chronological activity stream across the platform (new bookings, cleaner verifications, payments).

#### Request Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `page` | `number` | No | Page number (default: 1) |
| `perPage` | `number` | No | Items per page |

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "act_101",
        "action": "BOOKING_CREATED",
        "title": "New Booking Scheduled",
        "description": "Homeowner John Doe scheduled a deep cleaning package.",
        "created_at": "2026-10-15T08:30:00.000Z"
      }
    ]
  }
}
```

---

### GET `/api/users`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetUsersQuery`)
- **Description:** Queries general user lists with optional search or role filters.

#### Request Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `role` | `string` | No | Filter by role (`HOMEOWNER`, `CLEANER`, `ADMIN`) |
| `search` | `string` | No | Search query by name, email, or phone |

---

## 4. Homeowners Management

### GET `/api/dashboard/homeowners/details`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetHomeownersQuery`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/homeowners/page.tsx`
- **Tag:** `providesTags: ["Homeowners"]`
- **Description:** Retrieves paginated list of registered homeowners with their profile, booking count, total spent, and status.

#### Request Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `page` | `number` | No | Active page (default: 1) |
| `perPage` | `number` | No | Items per page (e.g. 10) |
| `search` | `string` | No | Search by homeowner name, email, or phone |

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "usr_6711aa",
        "userId": "usr_6711aa",
        "name": "Sarah Connor",
        "email": "sarah@example.com",
        "phone_number": "+1 555-0199",
        "avatar": "/uploads/avatars/sarah.jpg",
        "location": "Dallas, TX",
        "bookings": 8,
        "total_spent": 1240.50,
        "status": "ACTIVE",
        "joined_at": "2026-03-12T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 142,
      "page": 1,
      "perPage": 10
    }
  }
}
```

---

### PATCH `/api/dashboard/homeowners/actions`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useUpdateHomeownersMutation`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/homeowners/page.tsx`
- **Tag:** `invalidatesTags: ["Homeowners"]`
- **Description:** Updates the status of a homeowner account (e.g., Active, Suspended, Inactive).

#### Request Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | Yes | ID of the target homeowner |
| `status` | `string` | Yes | Target status (`ACTIVE`, `SUSPENDED`, `INACTIVE`) |

```http
PATCH /api/dashboard/homeowners/actions?userId=usr_6711aa&status=SUSPENDED
```

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Homeowner status updated successfully"
}
```

---

## 5. Cleaners Management

### GET `/api/dashboard/cleaners/details`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetCleanersQuery`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/cleaners/page.tsx`
- **Tag:** `providesTags: ["Cleaners"]`
- **Description:** Retrieves list of approved/registered cleaners, their contact details, ratings, completed jobs, earnings, and account status.

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "cln_9981",
        "userId": "usr_cln_9981",
        "name": "Elena Rodriguez",
        "email": "elena.cleaner@example.com",
        "phone_number": "+1 555-0245",
        "avatar": "/uploads/avatars/elena.jpg",
        "rating": 4.9,
        "completed_jobs": 47,
        "earnings": 4250.00,
        "status": "ACTIVE",
        "joined_at": "2026-01-15T12:00:00.000Z"
      }
    ]
  }
}
```

---

### PATCH `/api/dashboard/cleaners/actions`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useUpdateCleanersMutation`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/cleaners/page.tsx`
- **Tag:** `invalidatesTags: ["Cleaners"]`
- **Description:** Changes cleaner account status (e.g. `ACTIVE`, `SUSPENDED`, `INACTIVE`).

#### Request Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | Yes | ID of the target cleaner user |
| `status` | `string` | Yes | Target status (`ACTIVE`, `SUSPENDED`, `INACTIVE`) |

```http
PATCH /api/dashboard/cleaners/actions?userId=usr_cln_9981&status=ACTIVE
```

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Cleaner status updated successfully"
}
```

---

## 6. Cleaner Applications & Verification

### GET `/api/dashboard/cleaners/request`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetCleanerRequestQuery`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/cleaner-request/page.tsx`
- **Tag:** `providesTags: ["CleanerRequest"]`
- **Description:** Retrieves all cleaner onboarding applications submitted for admin verification.

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "req_8812",
      "name": "Carlos Gomez",
      "email": "carlos@example.com",
      "phone_number": "+1 555-0371",
      "location": "Houston, TX",
      "avatar": "/uploads/avatars/carlos.jpg",
      "status": "PENDING",
      "applied_date": "2026-10-10T14:20:00.000Z",
      "rejected_reason": null
    }
  ]
}
```

---

### GET `/api/dashboard/cleaners/request/:id`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetClearnerRequestByIdQuery`)
- **Frontend Usage:** `src/components/dashboard/CleanerRequest/CleanerRequest.tsx` (Application modal)
- **Tag:** `providesTags: ["CleanerRequest"]`
- **Description:** Retrieves full application details for a specific cleaner applicant, including uploaded identification cards, resume, background check info, and notes.

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Cleaner application ID |

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "req_8812",
    "name": "Carlos Gomez",
    "email": "carlos@example.com",
    "phone_number": "+1 555-0371",
    "location": "Houston, TX",
    "resume_url": "/uploads/documents/carlos_resume.pdf",
    "id_card_front_url": "/uploads/documents/id_front.jpg",
    "id_card_back_url": "/uploads/documents/id_back.jpg",
    "status": "PENDING",
    "applied_date": "2026-10-10T14:20:00.000Z"
  }
}
```

---

### PATCH `/api/dashboard/cleaners/request/:id`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useUpdateCleanerRequestMutation`)
- **Frontend Usage:** `src/components/dashboard/CleanerRequest/CleanerRequest.tsx`
- **Tag:** `invalidatesTags: ["CleanerRequest"]`
- **Description:** Approves or rejects a cleaner's verification request.

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Cleaner request ID |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `status` | `string` | Yes | `VERIFIED` or `REJECTED` |
| `rejected_reason` | `string` | Conditional | Required if status is `REJECTED` |

```json
{
  "status": "REJECTED",
  "rejected_reason": "Government ID photo is blurry and illegible."
}
```

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Cleaner application status updated successfully"
}
```

---

### POST `/api/cleaner-request/:id/cancel`
- **File / Hook:** `src/redux/features/cleanerRequest/cleanerRequestApi.ts` (`useCancelCleanerRequestMutation`)
- **Description:** Cancels an ongoing cleaner verification request with an optional cancellation reason.

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Cleaner request ID |

#### Request Body
```json
{
  "reason": "Applicant requested withdrawal."
}
```

---

## 7. Bookings Management

### GET `/api/dashboard/bookings`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetBookingDetaialsQuery`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/booking/page.tsx`
- **Tag:** `providesTags: ["Bookings"]`
- **Description:** Fetches all customer bookings with assigned cleaner, homeowner, package info, schedule date, and payment status.

#### Request Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `search` | `string` | No | Search by homeowner, cleaner, or booking ID |
| `bookingorderby` | `string` | No | Sorting parameter (e.g. `maid_id`, `date`) |

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "bk_5021",
      "homeowner_name": "David Miller",
      "cleaner_name": "Elena Rodriguez",
      "service_name": "Deep House Cleaning",
      "location": "Austin, TX",
      "booking_date": "2026-10-18T09:00:00.000Z",
      "status": "CONFIRMED",
      "total_price": 180.00,
      "payment_status": "PAID"
    }
  ]
}
```

---

### GET `/api/dashboard/bookings/:id`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetBookingByIdQuery`)
- **Frontend Usage:** `src/components/dashboard/Booking/BookingDetails.tsx`
- **Tag:** `providesTags: ["Bookings"]`
- **Description:** Retrieves comprehensive detail of a specific booking including transactions, history logs, duration, and customer contact.

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Booking ID |

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "bk_5021",
    "status": "CONFIRMED",
    "booking_date": "2026-10-18T09:00:00.000Z",
    "total_price": 180.00,
    "user": {
      "id": "usr_6711aa",
      "name": "David Miller",
      "email": "david@example.com",
      "phone_number": "+1 555-0812",
      "location": "123 Elm St, Austin, TX"
    },
    "maid": {
      "id": "cln_9981",
      "name": "Elena Rodriguez",
      "email": "elena.cleaner@example.com",
      "phone_number": "+1 555-0245"
    },
    "payment": {
      "status": "PAID",
      "transactions": [
        {
          "transaction_id": "txn_882910",
          "amount": 180.00,
          "method": "STRIPE_CARD",
          "created_at": "2026-10-14T11:22:00.000Z"
        }
      ]
    }
  }
}
```

---

### PATCH `/api/dashboard/bookings/:id/status`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useUpdateBookingStatusMutation`)
- **Frontend Usage:** `src/components/dashboard/Booking/BookingDetails.tsx`
- **Tag:** `invalidatesTags: ["Bookings"]`
- **Description:** Updates the lifecycle status of a booking.

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Booking ID |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `status` | `string` | Yes | `PENDING`, `CONFIRMED`, `IN-PROGRESS`, `COMPLETED`, `CANCELLED` |

```json
{
  "status": "COMPLETED"
}
```

---

### PATCH `/api/dashboard/bookings/:id/cleaner`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useAssignBookingCleanerMutation`)
- **Frontend Usage:** `src/components/dashboard/Booking/BookingDetails.tsx`
- **Tag:** `invalidatesTags: ["Bookings"]`
- **Description:** Assigns or reassigns an approved cleaner to the booking.

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Booking ID |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `cleaner_id` | `string` | Yes | Unique ID of the cleaner being assigned |

```json
{
  "cleaner_id": "cln_9981"
}
```

---

### PATCH `/api/dashboard/bookings/:id`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useUpdateBookingMutation`)
- **Tag:** `invalidatesTags: ["Bookings"]`
- **Description:** General partial update of booking metadata, address, or scheduling details.

---

## 8. Job Approvals

### GET `/api/dashboard/job-approvals`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetJobApprovalQuery`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/jobAppruve/page.tsx`
- **Tag:** `providesTags: ["JobApproval"]`
- **Description:** Lists cleaning jobs completed by cleaners awaiting admin sign-off, before/after evidence photos, and payout clearance.

#### Request Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `page` | `number` | No | Page number |
| `perPage` | `number` | No | Page size |
| `search` | `string` | No | Filter by booking number or cleaner name |

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "job_301",
      "bookingNo": "BK-2026-904",
      "status": "PENDING_APPROVAL",
      "booking_date": "2026-10-14",
      "amount": 220.00,
      "homeowner": { "name": "Emily Watson" },
      "maid": { "name": "Maria Garcia" },
      "homeowner_location": "San Antonio, TX",
      "maid_note": "Finished full deep clean. All appliances scrubbed.",
      "before_photos": [
        "/uploads/jobs/before_1.jpg",
        "/uploads/jobs/before_2.jpg"
      ],
      "after_photos": [
        "/uploads/jobs/after_1.jpg",
        "/uploads/jobs/after_2.jpg"
      ]
    }
  ]
}
```

---

### PATCH `/api/dashboard/job-approvals/:id`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetJobApprovalUpdateMutation`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/jobAppruve/page.tsx`
- **Tag:** `invalidatesTags: ["JobApproval"]`
- **Description:** Marks a job approval request as `COMPLETED` or `REJECTED`.

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Job approval ID |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `status` | `string` | Yes | `COMPLETED` or `REJECTED` |

```json
{
  "status": "COMPLETED"
}
```

---

## 9. Emergency / Danger Requests

### GET `/api/dashboard/danger/request`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useGetDangerRequestQuery`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/danger-request/page.tsx`
- **Tag:** `providesTags: ["DangerRequest"]`
- **Description:** Retrieves high-priority emergency SOS / danger alerts triggered by cleaners or homeowners on the job site. Includes GPS coordinates and reporter details.

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "dng_110",
      "name": "Maria Garcia",
      "phone_number": "+1 555-0992",
      "email": "maria@example.com",
      "avatar": "/uploads/avatars/maria.jpg",
      "latitude": 29.4241,
      "longitude": -98.4936,
      "location": "Downtown, San Antonio, TX",
      "applied_date": "2026-10-15T07:15:00.000Z",
      "status": "OPEN"
    }
  ]
}
```

---

### PATCH `/api/dashboard/danger/request/:id`
- **File / Hook:** `src/redux/features/dashboardOverView/dashboardOverView.ts` (`useUpdateDangerRequestMutation`)
- **Frontend Usage:** `src/components/dashboard/DangerDetails/DangerDetails.tsx`
- **Tag:** `invalidatesTags: ["DangerRequest"]`
- **Description:** Updates the status of an emergency request (e.g. `RESOLVED`, `INVESTIGATING`, `CLOSED`).

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Danger request record ID |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `status` | `string` | Yes | New status (`RESOLVED`, `CLOSED`) |

```json
{
  "status": "RESOLVED"
}
```

---

## 10. Support & Chat Module

### GET `/api/chat/conversation/conversation-list`
- **File / Hook:** `src/redux/features/chattingAndSocket/socket.ts` (`useAllConversationUserQuery`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/support/page.tsx`
- **Tag:** `providesTags: ["Conversation"]`
- **Description:** Retrieves all active chat conversations for the current admin support agent with the opponent's profile, unread count, and last message snippet.

#### Request Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `page` | `number` | No | Page number (default: 1) |
| `perPage` | `number` | No | Items per page (default: 1000000) |

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "conversations": [
    {
      "conversation_id": "conv_room_88",
      "opponent": {
        "userId": "usr_9021",
        "name": "Jessica Alba",
        "avatar_url": "/uploads/avatars/jessica.jpg",
        "isOnline": true
      },
      "lastMessage": {
        "text": "Hello, I need help changing my booking slot.",
        "createdAt": "2026-10-15T09:05:00.000Z",
        "attachments": []
      },
      "unreadCount": 2
    }
  ]
}
```

---

### GET `/api/chat/message/all-message/:conversationId`
- **File / Hook:** `src/redux/features/chattingAndSocket/socket.ts` (`useAllConversationIdQuery`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/support/page.tsx`
- **Tag:** `providesTags: ["Conversation"]`
- **Description:** Retrieves historical chat message thread for a specific conversation room.

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `conversationId` | `string` | Yes | Room identifier |

#### Request Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `page` | `number` | No | Page (default: 1) |
| `perPage` | `number` | No | Limit (default: 1000000) |

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_001",
        "text": "Can I reschedule my appointment?",
        "createdAt": "2026-10-15T08:50:00.000Z",
        "sender": {
          "id": "usr_9021",
          "name": "Jessica Alba"
        },
        "attachments": []
      }
    ]
  }
}
```

---

### POST `/api/chat/message/send-message`
- **File / Hook:** `src/redux/features/chattingAndSocket/socket.ts` (`useSendConversationMessageMutation`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/support/page.tsx`
- **Tag:** `invalidatesTags: ["Conversation"]`
- **Description:** Sends a chat message. Supports plain text JSON or file uploads via `multipart/form-data`.

> **Note on Realtime Architecture:** The sender submits the message via this REST endpoint. The server persists the message and emits the real-time `message` event over Socket.IO to the opponent in the room.

#### Request Body - Scenario A: Text Only (JSON)
```json
{
  "conversationId": "conv_room_88",
  "text": "Hello! Certainly, which date would you prefer?"
}
```

#### Request Body - Scenario B: With Attachments (`multipart/form-data`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | `string` | Conversation ID |
| `text` | `string` | Optional text message |
| `attachments` | `File[]` | Image or document binary files |

---

### POST `/api/chat/message/open-or-create-conversation`
- **File / Hook:** `src/redux/features/chattingAndSocket/socket.ts` (`useCreateConversationMutation`)
- **Description:** Opens an existing conversation between two users or creates a new conversation room.

#### Request Body
```json
{
  "receiverId": "usr_9021"
}
```

---

## 11. Notifications Module

The notification module contains 7 fully functional endpoints synced in real-time.

### GET `/api/notification`
- **File / Hook:** `src/redux/features/chattingAndSocket/socket.ts` (`useGetAllNotificationQuery`)
- **Frontend Usage:**
  - `src/app/(admin-dashboard)/dashboard/notification/page.tsx` (Table, Tabs, Pagination)
  - `src/app/(admin-dashboard)/dashboard/_components/dashboard-header.tsx` (Bell Dropdown)
- **Tag:** `providesTags: ["Notification"]`
- **Description:** Fetches paginated notification records for the current user with unread count and filtering options.

#### Request Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `page` | `number` | No | Active page (default: 1) |
| `perPage` | `number` | No | Items per page (e.g. 10) |
| `is_read` | `boolean` | No | Filter by read status (`true` / `false`) |
| `type` | `string` | No | Filter by notification type |

```http
GET /api/notification?page=1&perPage=10&is_read=false
```

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Notifications fetched successfully",
  "unread_count": 3,
  "data": [
    {
      "id": "notif_1001",
      "text": "New booking received for Deep Cleaning",
      "type": "booking_created",
      "isRead": false,
      "is_read": false,
      "bookingId": "bk_5021",
      "created_at": "2026-10-15T09:10:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "perPage": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### GET `/api/notification/unread-count`
- **File / Hook:** `src/redux/features/chattingAndSocket/socket.ts` (`useGetUnreadNotificationCountQuery`)
- **Frontend Usage:** `src/app/(admin-dashboard)/dashboard/_components/dashboard-header.tsx`, `notification/page.tsx`
- **Tag:** `providesTags: ["Notification"]`
- **Description:** Returns the total unread notification count used to render the notification bell badge.

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "count": 3
}
```

---

### GET `/api/notification/:id`
- **File / Hook:** `src/redux/features/chattingAndSocket/socket.ts` (`useGetSingleNotificationQuery`)
- **Frontend Usage:** `src/components/dashboard/Notification/NotificationDetailModal.tsx`
- **Tag:** `providesTags: ["Notification"]`
- **Description:** Retrieves the complete detail of an individual notification by ID for display in the professional notification preview dialog.

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Notification ID |

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Notification details retrieved",
  "data": {
    "id": "notif_1001",
    "text": "New cleaner registration: Carlos Gomez has submitted verification docs.",
    "type": "cleaner_registration",
    "isRead": true,
    "is_read": true,
    "applicationId": "req_8812",
    "sender": {
      "name": "Carlos Gomez"
    },
    "created_at": "2026-10-15T08:15:00.000Z"
  }
}
```

---

### PATCH `/api/notification/read-all`
- **File / Hook:** `src/redux/features/chattingAndSocket/socket.ts` (`useMarkAllNotificationsAsReadMutation`)
- **Frontend Usage:** `dashboard-header.tsx`, `notification/page.tsx`
- **Tag:** `invalidatesTags: ["Notification"]`
- **Description:** Marks every notification belonging to the signed-in user as read.

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### PATCH `/api/notification/:id/read`
- **File / Hook:** `src/redux/features/chattingAndSocket/socket.ts` (`useMarkNotificationAsReadMutation`)
- **Frontend Usage:** `NotificationDetailModal.tsx`, `notification/page.tsx`, `dashboard-header.tsx`
- **Tag:** `invalidatesTags: ["Notification"]`
- **Description:** Marks a single notification as read.

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Notification ID |

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### DELETE `/api/notification/:id`
- **File / Hook:** `src/redux/features/chattingAndSocket/socket.ts` (`useDeleteNotificationMutation`)
- **Frontend Usage:** `notification/page.tsx`, `NotificationDetailModal.tsx`
- **Tag:** `invalidatesTags: ["Notification"]`
- **Description:** Permanently deletes a single notification.

#### URL Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Notification ID |

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

### DELETE `/api/notification`
- **File / Hook:** `src/redux/features/chattingAndSocket/socket.ts` (`useDeleteAllNotificationsMutation`)
- **Frontend Usage:** `notification/page.tsx` (`Delete all` button)
- **Tag:** `invalidatesTags: ["Notification"]`
- **Description:** Deletes all notifications belonging to the signed-in user.

#### Response Structure
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "All notifications deleted successfully"
}
```

---

## 12. Socket.IO Real-Time Gateway

### Connection Handshake
- **Client Configuration:** `src/lib/Socket.ts`
- **Connection URL:** `https://backend.cleennconnect.com`
- **Transports:** `["websocket", "polling"]`

#### Authentication Handshake Payloads
- **Chat Gateway:** Authenticates via JWT token in `auth.token`.
- **Notification Gateway:** Subscribes to user room via `query.userId` and `query.token`.

```typescript
const socket = io("https://backend.cleennconnect.com", {
  auth: { token: accessToken },
  query: { token: accessToken, userId: currentUserId },
  transports: ["websocket", "polling"],
  reconnection: true,
});
```

---

### Client to Server Events

| Event Name | Payload Structure | Description |
| :--- | :--- | :--- |
| `joinroom` | `{ room_id: string }` | Client joins a specific conversation room to receive messages. |
| `sendNotification` | `{ userId: string, title?: string, body?: string, type?: string }` | Legacy client notification relay. |
| `updateMessageStatus` | `{ message_id: string, status: "SENT" \| "DELIVERED" \| "READ" }` | Emits updated message delivery status to conversation members. |

---

### Server to Client Events

| Event Name | Payload Structure | Frontend Action |
| :--- | :--- | :--- |
| `message` | `{ from: string, data: ChatMessage }` | Appends new incoming chat message directly to chat thread state and updates conversation list. |
| `joinedRoom` | `{ room_id: string }` | Confirms successful room join. |
| `receiveNotification` | `{ userId: string, type: string, text?: string, ... }` | Re-fetches unread notification count and updates notification queries. |
| `userStatusChange` | `{ user_id: string, status: string }` | Updates online/offline presence indicator for chat contacts. |
| `messageStatusUpdated` | `{ message_id: string, status: string }` | Updates double checkmark delivery status in chat bubbles. |

---

### Real-Time Notification & Chat Lifecycle

```
[ User Action / Event Triggered ]
               │
               ▼
   [ REST API POST / PATCH ]
 (e.g. send message, book service)
               │
               ▼
      [ Backend Gateway ]
               │
         ┌─────┴──────────────────┐
         ▼                        ▼
[ Persist to Database ]    [ Socket.IO Emit ]
(Postgres / MongoDB)       - `message`
                           - `receiveNotification`
                                  │
                                  ▼
                         [ Frontend Client ]
                         - RTK Query Invalidate Tags
                         - Live UI State Merge
                         - Sound / Toast Notification
```

---

## 13. Summary Quick Reference

| Feature | HTTP Method | Endpoint | RTK Tag |
| :--- | :--- | :--- | :--- |
| **Login** | `POST` | `auth/login` | - |
| **Overview Stats** | `GET` | `dashboard/overview` | - |
| **Activities** | `GET` | `dashboard/activities` | - |
| **Homeowners List** | `GET` | `dashboard/homeowners/details` | `Homeowners` |
| **Homeowner Status** | `PATCH` | `dashboard/homeowners/actions?userId=&status=` | `Homeowners` |
| **Cleaners List** | `GET` | `dashboard/cleaners/details` | `Cleaners` |
| **Cleaner Status** | `PATCH` | `dashboard/cleaners/actions?userId=&status=` | `Cleaners` |
| **Cleaner Requests** | `GET` | `dashboard/cleaners/request` | `CleanerRequest` |
| **Cleaner Request Details** | `GET` | `dashboard/cleaners/request/:id` | `CleanerRequest` |
| **Update Cleaner Request** | `PATCH` | `dashboard/cleaners/request/:id` | `CleanerRequest` |
| **Cancel Cleaner Request** | `POST` | `cleaner-request/:id/cancel` | - |
| **Bookings List** | `GET` | `dashboard/bookings` | `Bookings` |
| **Booking Details** | `GET` | `dashboard/bookings/:id` | `Bookings` |
| **Update Booking Status** | `PATCH` | `dashboard/bookings/:id/status` | `Bookings` |
| **Assign Cleaner** | `PATCH` | `dashboard/bookings/:id/cleaner` | `Bookings` |
| **Job Approvals List** | `GET` | `dashboard/job-approvals` | `JobApproval` |
| **Job Approval Status** | `PATCH` | `dashboard/job-approvals/:id` | `JobApproval` |
| **Emergency Alerts** | `GET` | `dashboard/danger/request` | `DangerRequest` |
| **Update Emergency Alert** | `PATCH` | `dashboard/danger/request/:id` | `DangerRequest` |
| **Conversations List** | `GET` | `chat/conversation/conversation-list` | `Conversation` |
| **Messages by Room** | `GET` | `chat/message/all-message/:conversationId` | `Conversation` |
| **Send Chat Message** | `POST` | `chat/message/send-message` | `Conversation` |
| **Get Notifications** | `GET` | `notification` | `Notification` |
| **Unread Count** | `GET` | `notification/unread-count` | `Notification` |
| **Single Notification** | `GET` | `notification/:id` | `Notification` |
| **Mark All as Read** | `PATCH` | `notification/read-all` | `Notification` |
| **Mark Single Read** | `PATCH` | `notification/:id/read` | `Notification` |
| **Delete Single Notification**| `DELETE` | `notification/:id` | `Notification` |
| **Delete All Notifications** | `DELETE` | `notification` | `Notification` |
