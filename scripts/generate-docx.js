const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
  AlignmentType,
  ShadingType,
} = require("docx");

// --- COLOR PALETTE & STYLES ---
const PRIMARY_GREEN = "168044"; // #168044
const DARK_GREEN = "173323";    // #173323
const LIGHT_BG = "F2F7F3";      // #F2F7F3
const ALT_BG = "FBFDFC";        // #FBFDFC
const WHITE = "FFFFFF";
const BORDER_COLOR = "D1D5DB";  // Gray-300
const TEXT_MUTED = "59675E";
const TEXT_DARK = "111827";

const METHOD_COLORS = {
  GET: "2563EB",     // Blue
  POST: "168044",    // Green
  PATCH: "D97706",   // Amber / Orange
  DELETE: "DC2626",  // Red
};

// Border helper
const defaultBorder = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: BORDER_COLOR,
};

const cellBorders = {
  top: defaultBorder,
  bottom: defaultBorder,
  left: defaultBorder,
  right: defaultBorder,
};

const tableMargins = {
  top: 120,    // in twips (8pt)
  bottom: 120,
  left: 140,   // ~10pt
  right: 140,
};

// Helper: Table Header Cell
function createHeaderCell(text, widthPercent = 25, bgColor = PRIMARY_GREEN) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: cellBorders,
    margins: tableMargins,
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: true,
            color: WHITE,
            size: 20, // 10pt
            font: "Segoe UI",
          }),
        ],
      }),
    ],
  });
}

// Helper: Table Data Cell
function createDataCell(text, widthPercent = 25, options = {}) {
  const {
    bold = false,
    color = TEXT_DARK,
    bgColor = WHITE,
    align = AlignmentType.LEFT,
    mono = false,
  } = options;

  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: cellBorders,
    margins: tableMargins,
    shading: bgColor !== WHITE ? { fill: bgColor, type: ShadingType.CLEAR } : undefined,
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text: String(text ?? "-"),
            bold,
            color,
            size: mono ? 18 : 20, // 9pt for code / 10pt standard
            font: mono ? "Consolas" : "Segoe UI",
          }),
        ],
      }),
    ],
  });
}

// Helper: Multi-line Code Data Cell
function createCodeCell(codeText, widthPercent = 100) {
  const lines = codeText.split("\n");
  const paragraphs = lines.map(
    (line) =>
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({
            text: line,
            font: "Consolas",
            size: 17, // ~8.5pt
            color: "1E293B",
          }),
        ],
      })
  );

  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: cellBorders,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
    children: paragraphs,
  });
}

// Helper: Section Heading
function createSectionHeader(title, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: level === HeadingLevel.HEADING_1 ? 32 : 26, // 16pt / 13pt
        color: DARK_GREEN,
        font: "Segoe UI",
      }),
    ],
  });
}

function createSubHeader(title) {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 22, // 11pt
        color: PRIMARY_GREEN,
        font: "Segoe UI",
      }),
    ],
  });
}

// Generate the complete document
function buildDocument() {
  const children = [];

  // --- COVER & METADATA TABLE ---
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 140 },
      children: [
        new TextRun({
          text: "CLEENNCONNECT ADMIN DASHBOARD",
          bold: true,
          size: 38,
          color: PRIMARY_GREEN,
          font: "Segoe UI",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240 },
      children: [
        new TextRun({
          text: "Comprehensive REST API & Real-Time Socket.IO Documentation",
          size: 24,
          color: TEXT_MUTED,
          font: "Segoe UI",
        }),
      ],
    })
  );

  // Document Info Table
  const docInfoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Document Property", 30, DARK_GREEN),
          createHeaderCell("Configuration & Environment Details", 70, DARK_GREEN),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Document Version", 30, { bold: true, bgColor: LIGHT_BG }),
          createDataCell("1.0.0 (Production Verified)", 70),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Target Environment", 30, { bold: true, bgColor: LIGHT_BG }),
          createDataCell("Production / Live Staging Backend", 70),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Base REST API URL", 30, { bold: true, bgColor: LIGHT_BG }),
          createDataCell("https://backend.cleennconnect.com/api/", 70, { mono: true, color: "0369A1" }),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Real-Time Socket.IO URL", 30, { bold: true, bgColor: LIGHT_BG }),
          createDataCell("https://backend.cleennconnect.com (Root Domain without /api)", 70, { mono: true, color: "0369A1" }),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Authentication Protocol", 30, { bold: true, bgColor: LIGHT_BG }),
          createDataCell("HTTP Authorization Bearer Token (JWT)", 70),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Generated Date", 30, { bold: true, bgColor: LIGHT_BG }),
          createDataCell(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), 70),
        ],
      }),
    ],
  });
  children.push(docInfoTable);

  // --- SECTION 1: ARCHITECTURE & GLOBAL SETTINGS ---
  children.push(createSectionHeader("1. Architecture & Global Configuration"));

  const globalConfigTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Parameter", 25),
          createHeaderCell("Type / Header Key", 25),
          createHeaderCell("Description & Rules", 50),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Auth Header", 25, { bold: true }),
          createDataCell("Authorization", 25, { mono: true }),
          createDataCell("Format: Bearer <ACCESS_TOKEN>. Injected automatically via RTK baseQuery for all protected endpoints.", 50),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Content Type", 25, { bold: true }),
          createDataCell("Content-Type", 25, { mono: true }),
          createDataCell("application/json (or multipart/form-data when uploading file attachments).", 50),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Cookie: token", 25, { bold: true }),
          createDataCell("token", 25, { mono: true }),
          createDataCell("Stores signed-in Admin JWT token with SameSite: strict.", 50),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Cookie: userId", 25, { bold: true }),
          createDataCell("userId", 25, { mono: true }),
          createDataCell("Stores current Admin user ID. Used in Socket query to join notification room.", 50),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Cookie: userType", 25, { bold: true }),
          createDataCell("userType", 25, { mono: true }),
          createDataCell("Role guard. Value must strictly equal 'ADMIN' to access the dashboard.", 50),
        ],
      }),
    ],
  });
  children.push(globalConfigTable);

  children.push(createSubHeader("RTK Query Cache Tags & Real-Time Sync Strategy"));

  const tagsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Tag Type", 25),
          createHeaderCell("Target Endpoints Provided", 40),
          createHeaderCell("Invalidated By (Mutations)", 35),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("CleanerRequest", 25, { bold: true, mono: true }),
          createDataCell("getCleanerRequest, getClearnerRequestById", 40, { mono: true }),
          createDataCell("updateCleanerRequest (Approve/Reject)", 35),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("JobApproval", 25, { bold: true, mono: true }),
          createDataCell("getJobApproval", 40, { mono: true }),
          createDataCell("getJobApprovalUpdate (Complete/Reject)", 35),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("DangerRequest", 25, { bold: true, mono: true }),
          createDataCell("getDangerRequest", 40, { mono: true }),
          createDataCell("updateDangerRequest (Resolve/Close)", 35),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Homeowners", 25, { bold: true, mono: true }),
          createDataCell("getHomeowners", 40, { mono: true }),
          createDataCell("updateHomeowners (Status action)", 35),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Cleaners", 25, { bold: true, mono: true }),
          createDataCell("getCleaners", 40, { mono: true }),
          createDataCell("updateCleaners (Status action)", 35),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Bookings", 25, { bold: true, mono: true }),
          createDataCell("getBookingDetaials, getBookingById", 40, { mono: true }),
          createDataCell("updateBookingStatus, assignBookingCleaner, updateBooking", 35),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Conversation", 25, { bold: true, mono: true }),
          createDataCell("AllConversationUser, AllConversationId", 40, { mono: true }),
          createDataCell("SendConversationMessage, Realtime socket event", 35),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Notification", 25, { bold: true, mono: true }),
          createDataCell("GetAllNotification, GetUnreadNotificationCount, GetSingleNotification", 40, { mono: true }),
          createDataCell("MarkAllAsRead, MarkAsRead, DeleteNotification, DeleteAll, Socket event", 35),
        ],
      }),
    ],
  });
  children.push(tagsTable);

  // --- SECTION 2: MASTER API MATRIX TABLE ---
  children.push(createSectionHeader("2. Master API Quick Reference Table"));

  const masterList = [
    { method: "POST", url: "auth/login", module: "Authentication", tag: "-", page: "/login" },
    { method: "GET", url: "dashboard/overview", module: "Overview", tag: "-", page: "/dashboard" },
    { method: "GET", url: "dashboard/activities", module: "Overview", tag: "-", page: "/dashboard" },
    { method: "GET", url: "users", module: "Overview", tag: "-", page: "/dashboard" },
    { method: "GET", url: "dashboard/homeowners/details", module: "Homeowners", tag: "Homeowners", page: "/dashboard/homeowners" },
    { method: "PATCH", url: "dashboard/homeowners/actions", module: "Homeowners", tag: "Homeowners", page: "/dashboard/homeowners" },
    { method: "GET", url: "dashboard/cleaners/details", module: "Cleaners", tag: "Cleaners", page: "/dashboard/cleaners" },
    { method: "PATCH", url: "dashboard/cleaners/actions", module: "Cleaners", tag: "Cleaners", page: "/dashboard/cleaners" },
    { method: "GET", url: "dashboard/cleaners/request", module: "Applications", tag: "CleanerRequest", page: "/dashboard/cleaner-request" },
    { method: "GET", url: "dashboard/cleaners/request/:id", module: "Applications", tag: "CleanerRequest", page: "CleanerDetails Modal" },
    { method: "PATCH", url: "dashboard/cleaners/request/:id", module: "Applications", tag: "CleanerRequest", page: "CleanerDetails Modal" },
    { method: "POST", url: "cleaner-request/:id/cancel", module: "Applications", tag: "-", page: "/dashboard/cleaner-request" },
    { method: "GET", url: "dashboard/bookings", module: "Bookings", tag: "Bookings", page: "/dashboard/booking" },
    { method: "GET", url: "dashboard/bookings/:id", module: "Bookings", tag: "Bookings", page: "BookingDetails Modal" },
    { method: "PATCH", url: "dashboard/bookings/:id/status", module: "Bookings", tag: "Bookings", page: "BookingDetails Modal" },
    { method: "PATCH", url: "dashboard/bookings/:id/cleaner", module: "Bookings", tag: "Bookings", page: "BookingDetails Modal" },
    { method: "PATCH", url: "dashboard/bookings/:id", module: "Bookings", tag: "Bookings", page: "BookingDetails Modal" },
    { method: "GET", url: "dashboard/job-approvals", module: "Job Approvals", tag: "JobApproval", page: "/dashboard/jobAppruve" },
    { method: "PATCH", url: "dashboard/job-approvals/:id", module: "Job Approvals", tag: "JobApproval", page: "/dashboard/jobAppruve" },
    { method: "GET", url: "dashboard/danger/request", module: "Danger SOS", tag: "DangerRequest", page: "/dashboard/danger-request" },
    { method: "PATCH", url: "dashboard/danger/request/:id", module: "Danger SOS", tag: "DangerRequest", page: "DangerDetails Modal" },
    { method: "GET", url: "chat/conversation/conversation-list", module: "Support Chat", tag: "Conversation", page: "/dashboard/support" },
    { method: "GET", url: "chat/message/all-message/:id", module: "Support Chat", tag: "Conversation", page: "/dashboard/support" },
    { method: "POST", url: "chat/message/send-message", module: "Support Chat", tag: "Conversation", page: "/dashboard/support" },
    { method: "POST", url: "chat/message/open-or-create-conversation", module: "Support Chat", tag: "-", page: "/dashboard/support" },
    { method: "GET", url: "notification", module: "Notifications", tag: "Notification", page: "Header & /dashboard/notification" },
    { method: "GET", url: "notification/unread-count", module: "Notifications", tag: "Notification", page: "Header Bell & /dashboard/notification" },
    { method: "GET", url: "notification/:id", module: "Notifications", tag: "Notification", page: "NotificationDetailModal" },
    { method: "PATCH", url: "notification/read-all", module: "Notifications", tag: "Notification", page: "Header & /dashboard/notification" },
    { method: "PATCH", url: "notification/:id/read", module: "Notifications", tag: "Notification", page: "NotificationDetailModal & List" },
    { method: "DELETE", url: "notification/:id", module: "Notifications", tag: "Notification", page: "NotificationDetailModal & List" },
    { method: "DELETE", url: "notification", module: "Notifications", tag: "Notification", page: "/dashboard/notification" },
  ];

  const masterTableRows = [
    new TableRow({
      children: [
        createHeaderCell("#", 6),
        createHeaderCell("Method", 12),
        createHeaderCell("Endpoint Path", 34),
        createHeaderCell("Module", 16),
        createHeaderCell("RTK Tag", 16),
        createHeaderCell("Used in Page", 16),
      ],
    }),
  ];

  masterList.forEach((item, index) => {
    masterTableRows.push(
      new TableRow({
        children: [
          createDataCell(index + 1, 6, { align: AlignmentType.CENTER, bold: true }),
          createDataCell(item.method, 12, { bold: true, color: METHOD_COLORS[item.method] || TEXT_DARK }),
          createDataCell(`/api/${item.url}`, 34, { mono: true }),
          createDataCell(item.module, 16),
          createDataCell(item.tag, 16, { mono: true }),
          createDataCell(item.page, 16),
        ],
      })
    );
  });

  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: masterTableRows }));

  // --- HELPER TO RENDER AN ENDPOINT DETAIL IN TABLE FORMAT ---
  function renderEndpointSection(endpoint) {
    const {
      num,
      title,
      method,
      path,
      module,
      usage,
      tag,
      auth = "Bearer JWT Token",
      description,
      queryParams = [],
      urlParams = [],
      bodyParams = [],
      sampleBody = null,
      sampleResponse,
      status = "200 OK",
    } = endpoint;

    children.push(createSectionHeader(`${num}. ${method} ${path}`, HeadingLevel.HEADING_2));

    // Summary Table
    const metaRows = [
      new TableRow({
        children: [
          createHeaderCell("Field", 25, DARK_GREEN),
          createHeaderCell("Specification", 75, DARK_GREEN),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("HTTP Method", 25, { bold: true, bgColor: LIGHT_BG }),
          createDataCell(method, 75, { bold: true, color: METHOD_COLORS[method] || TEXT_DARK }),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Endpoint Path", 25, { bold: true, bgColor: LIGHT_BG }),
          createDataCell(path, 75, { mono: true }),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Module", 25, { bold: true, bgColor: LIGHT_BG }),
          createDataCell(module, 75),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Frontend Hook / Page", 25, { bold: true, bgColor: LIGHT_BG }),
          createDataCell(usage, 75),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Cache Tag", 25, { bold: true, bgColor: LIGHT_BG }),
          createDataCell(tag, 75, { mono: true }),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Authorization", 25, { bold: true, bgColor: LIGHT_BG }),
          createDataCell(auth, 75),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("Description", 25, { bold: true, bgColor: LIGHT_BG }),
          createDataCell(description, 75),
        ],
      }),
    ];

    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: metaRows }));

    // URL / Path Params Table (if any)
    if (urlParams.length > 0) {
      children.push(createSubHeader("URL / Path Parameters"));
      const pRows = [
        new TableRow({
          children: [
            createHeaderCell("Parameter", 25),
            createHeaderCell("Type", 15),
            createHeaderCell("Required", 15),
            createHeaderCell("Description", 45),
          ],
        }),
      ];
      urlParams.forEach((p) => {
        pRows.push(
          new TableRow({
            children: [
              createDataCell(p.name, 25, { mono: true, bold: true }),
              createDataCell(p.type, 15),
              createDataCell(p.required ? "Yes" : "No", 15, { bold: p.required }),
              createDataCell(p.desc, 45),
            ],
          })
        );
      });
      children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: pRows }));
    }

    // Query Params Table (if any)
    if (queryParams.length > 0) {
      children.push(createSubHeader("Query Parameters"));
      const qRows = [
        new TableRow({
          children: [
            createHeaderCell("Parameter", 25),
            createHeaderCell("Type", 15),
            createHeaderCell("Required", 15),
            createHeaderCell("Description", 45),
          ],
        }),
      ];
      queryParams.forEach((q) => {
        qRows.push(
          new TableRow({
            children: [
              createDataCell(q.name, 25, { mono: true, bold: true }),
              createDataCell(q.type, 15),
              createDataCell(q.required ? "Yes" : "No", 15, { bold: q.required }),
              createDataCell(q.desc, 45),
            ],
          })
        );
      });
      children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: qRows }));
    }

    // Request Body Table (if any)
    if (bodyParams.length > 0) {
      children.push(createSubHeader("Request Body Fields"));
      const bRows = [
        new TableRow({
          children: [
            createHeaderCell("Field Name", 25),
            createHeaderCell("Data Type", 15),
            createHeaderCell("Required", 15),
            createHeaderCell("Description", 45),
          ],
        }),
      ];
      bodyParams.forEach((b) => {
        bRows.push(
          new TableRow({
            children: [
              createDataCell(b.name, 25, { mono: true, bold: true }),
              createDataCell(b.type, 15),
              createDataCell(b.required ? "Yes" : "No", 15, { bold: b.required }),
              createDataCell(b.desc, 45),
            ],
          })
        );
      });
      children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: bRows }));
    }

    // Sample Request Body (if provided)
    if (sampleBody) {
      children.push(createSubHeader("Sample Request Payload (JSON)"));
      const sampleBodyTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [createCodeCell(sampleBody, 100)],
          }),
        ],
      });
      children.push(sampleBodyTable);
    }

    // Response Table
    children.push(createSubHeader(`Response Structure (${status})`));
    const respTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createHeaderCell("HTTP Status", 25, DARK_GREEN),
            createHeaderCell("Sample Response Body (JSON)", 75, DARK_GREEN),
          ],
        }),
        new TableRow({
          children: [
            createDataCell(status, 25, { bold: true, color: PRIMARY_GREEN, bgColor: LIGHT_BG }),
            createCodeCell(sampleResponse, 75),
          ],
        }),
      ],
    });
    children.push(respTable);
  }

  // --- DETAILED ENDPOINTS DEFINITION ---
  const endpoints = [
    // 3.1 Login
    {
      num: "3.1",
      title: "Admin Login",
      method: "POST",
      path: "/api/auth/login",
      module: "Authentication",
      usage: "useLoginMutation -> src/app/(auth)/login/page.tsx",
      tag: "None",
      auth: "Public (No Token Required)",
      description: "Authenticates admin email and password. Verifies user has 'ADMIN' type. Returns Bearer access token.",
      bodyParams: [
        { name: "email", type: "string", required: true, desc: "Registered admin email address" },
        { name: "password", type: "string", required: true, desc: "Account password" },
      ],
      sampleBody: JSON.stringify({ email: "admin@cleennconnect.com", password: "Password123!" }, null, 2),
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          message: "Login successful",
          type: "ADMIN",
          authorization: {
            access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            token_type: "Bearer",
          },
          user: {
            id: "67a89bc10d3e5f2a1b9c4d5e",
            name: "Super Admin",
            email: "admin@cleennconnect.com",
            role: "ADMIN",
          },
        },
        null,
        2
      ),
    },

    // 4.1 Dashboard Overview
    {
      num: "4.1",
      title: "Dashboard Overview Statistics",
      method: "GET",
      path: "/api/dashboard/overview",
      module: "Dashboard Overview",
      usage: "useGetDashboardOverviewQuery -> src/app/(admin-dashboard)/page.tsx",
      tag: "None",
      description: "Returns aggregate metric counts for top overview metric cards: homeowners, cleaners, active bookings, revenue, completed jobs.",
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          data: {
            total_homeowners: 142,
            total_cleaners: 58,
            active_bookings: 24,
            total_revenue: 18450.0,
            completed_bookings: 312,
            pending_bookings: 9,
          },
        },
        null,
        2
      ),
    },

    // 4.2 Dashboard Activities
    {
      num: "4.2",
      title: "Recent Dashboard Activities",
      method: "GET",
      path: "/api/dashboard/activities",
      module: "Dashboard Overview",
      usage: "useGetActivitiesQuery -> src/app/(admin-dashboard)/page.tsx",
      tag: "None",
      description: "Retrieves chronological log of system actions (bookings created, cleaners approved, emergency requests).",
      queryParams: [
        { name: "page", type: "number", required: false, desc: "Current page (default: 1)" },
        { name: "perPage", type: "number", required: false, desc: "Number of rows (default: 10)" },
      ],
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          data: {
            data: [
              {
                id: "act_101",
                action: "BOOKING_CREATED",
                title: "New Booking Scheduled",
                description: "Homeowner John Doe booked a deep cleaning service.",
                created_at: "2026-10-15T08:30:00.000Z",
              },
            ],
          },
        },
        null,
        2
      ),
    },

    // 5.1 Homeowners Details
    {
      num: "5.1",
      title: "Get Homeowners List",
      method: "GET",
      path: "/api/dashboard/homeowners/details",
      module: "Homeowners Management",
      usage: "useGetHomeownersQuery -> src/app/(admin-dashboard)/dashboard/homeowners/page.tsx",
      tag: "providesTags: ['Homeowners']",
      description: "Fetches list of registered homeowners with profile details, contact information, booking counts, and spending total.",
      queryParams: [
        { name: "search", type: "string", required: false, desc: "Search filter by name, email, or phone number" },
        { name: "page", type: "number", required: false, desc: "Current page" },
        { name: "perPage", type: "number", required: false, desc: "Items per page (e.g. 10)" },
      ],
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          data: {
            data: [
              {
                id: "usr_6711aa",
                userId: "usr_6711aa",
                name: "Sarah Connor",
                email: "sarah@example.com",
                phone_number: "+1 555-0199",
                avatar: "/uploads/avatars/sarah.jpg",
                location: "Dallas, TX",
                bookings: 8,
                total_spent: 1240.5,
                status: "ACTIVE",
                joined_at: "2026-03-12T10:00:00.000Z",
              },
            ],
            pagination: { total: 142, page: 1, perPage: 10 },
          },
        },
        null,
        2
      ),
    },

    // 5.2 Homeowners Actions
    {
      num: "5.2",
      title: "Update Homeowner Status",
      method: "PATCH",
      path: "/api/dashboard/homeowners/actions",
      module: "Homeowners Management",
      usage: "useUpdateHomeownersMutation -> src/app/(admin-dashboard)/dashboard/homeowners/page.tsx",
      tag: "invalidatesTags: ['Homeowners']",
      description: "Updates homeowner status (ACTIVE, SUSPENDED, INACTIVE). Invalidates Homeowners cache tag.",
      queryParams: [
        { name: "userId", type: "string", required: true, desc: "Homeowner User ID" },
        { name: "status", type: "string", required: true, desc: "New status: ACTIVE, SUSPENDED, or INACTIVE" },
      ],
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, message: "Homeowner status updated successfully" }, null, 2),
    },

    // 6.1 Cleaners Details
    {
      num: "6.1",
      title: "Get Cleaners List",
      method: "GET",
      path: "/api/dashboard/cleaners/details",
      module: "Cleaners Management",
      usage: "useGetCleanersQuery -> src/app/(admin-dashboard)/dashboard/cleaners/page.tsx",
      tag: "providesTags: ['Cleaners']",
      description: "Retrieves active cleaners, job completion statistics, customer ratings, earnings, and account status.",
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          data: {
            data: [
              {
                id: "cln_9981",
                userId: "usr_cln_9981",
                name: "Elena Rodriguez",
                email: "elena@example.com",
                phone_number: "+1 555-0245",
                avatar: "/uploads/avatars/elena.jpg",
                rating: 4.9,
                completed_jobs: 47,
                earnings: 4250.0,
                status: "ACTIVE",
                joined_at: "2026-01-15T12:00:00.000Z",
              },
            ],
          },
        },
        null,
        2
      ),
    },

    // 6.2 Cleaners Actions
    {
      num: "6.2",
      title: "Update Cleaner Status",
      method: "PATCH",
      path: "/api/dashboard/cleaners/actions",
      module: "Cleaners Management",
      usage: "useUpdateCleanersMutation -> src/app/(admin-dashboard)/dashboard/cleaners/page.tsx",
      tag: "invalidatesTags: ['Cleaners']",
      description: "Updates cleaner account status (ACTIVE, SUSPENDED, INACTIVE). Invalidates Cleaners cache tag.",
      queryParams: [
        { name: "userId", type: "string", required: true, desc: "Cleaner User ID" },
        { name: "status", type: "string", required: true, desc: "New status: ACTIVE, SUSPENDED, or INACTIVE" },
      ],
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, message: "Cleaner status updated successfully" }, null, 2),
    },

    // 7.1 Cleaner Requests
    {
      num: "7.1",
      title: "Get Cleaner Onboarding Applications",
      method: "GET",
      path: "/api/dashboard/cleaners/request",
      module: "Cleaner Verification",
      usage: "useGetCleanerRequestQuery -> src/app/(admin-dashboard)/dashboard/cleaner-request/page.tsx",
      tag: "providesTags: ['CleanerRequest']",
      description: "Lists all pending or submitted cleaner onboarding requests awaiting review.",
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          data: [
            {
              id: "req_8812",
              name: "Carlos Gomez",
              email: "carlos@example.com",
              phone_number: "+1 555-0371",
              location: "Houston, TX",
              avatar: "/uploads/avatars/carlos.jpg",
              status: "PENDING",
              applied_date: "2026-10-10T14:20:00.000Z",
            },
          ],
        },
        null,
        2
      ),
    },

    // 7.2 Cleaner Request by ID
    {
      num: "7.2",
      title: "Get Cleaner Application Details by ID",
      method: "GET",
      path: "/api/dashboard/cleaners/request/:id",
      module: "Cleaner Verification",
      usage: "useGetClearnerRequestByIdQuery -> CleanerRequest.tsx Modal",
      tag: "providesTags: ['CleanerRequest']",
      description: "Retrieves complete verification dossier for applicant, including government ID cards, resume document, and address.",
      urlParams: [{ name: "id", type: "string", required: true, desc: "Cleaner Application ID" }],
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          data: {
            id: "req_8812",
            name: "Carlos Gomez",
            email: "carlos@example.com",
            phone_number: "+1 555-0371",
            location: "Houston, TX",
            resume_url: "/uploads/docs/resume.pdf",
            id_card_front_url: "/uploads/docs/id_front.jpg",
            id_card_back_url: "/uploads/docs/id_back.jpg",
            status: "PENDING",
          },
        },
        null,
        2
      ),
    },

    // 7.3 Update Cleaner Request
    {
      num: "7.3",
      title: "Approve or Reject Cleaner Application",
      method: "PATCH",
      path: "/api/dashboard/cleaners/request/:id",
      module: "Cleaner Verification",
      usage: "useUpdateCleanerRequestMutation -> CleanerRequest.tsx Modal",
      tag: "invalidatesTags: ['CleanerRequest']",
      description: "Approves (status: VERIFIED) or Rejects (status: REJECTED with rejected_reason).",
      urlParams: [{ name: "id", type: "string", required: true, desc: "Cleaner Application ID" }],
      bodyParams: [
        { name: "status", type: "string", required: true, desc: "Target status: VERIFIED or REJECTED" },
        { name: "rejected_reason", type: "string", required: false, desc: "Explanation required when rejecting" },
      ],
      sampleBody: JSON.stringify({ status: "REJECTED", rejected_reason: "Document photo is unreadable." }, null, 2),
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, message: "Cleaner application status updated successfully" }, null, 2),
    },

    // 8.1 Bookings List
    {
      num: "8.1",
      title: "Get Bookings List",
      method: "GET",
      path: "/api/dashboard/bookings",
      module: "Bookings Management",
      usage: "useGetBookingDetaialsQuery -> src/app/(admin-dashboard)/dashboard/booking/page.tsx",
      tag: "providesTags: ['Bookings']",
      description: "Retrieves cleaning bookings with service details, assigned cleaner, client, and payment status.",
      queryParams: [
        { name: "search", type: "string", required: false, desc: "Search term for customer or cleaner" },
        { name: "bookingorderby", type: "string", required: false, desc: "Sort column (e.g. maid_id)" },
      ],
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          data: [
            {
              id: "bk_5021",
              homeowner_name: "David Miller",
              cleaner_name: "Elena Rodriguez",
              service_name: "Deep House Cleaning",
              location: "Austin, TX",
              booking_date: "2026-10-18T09:00:00.000Z",
              status: "CONFIRMED",
              total_price: 180.0,
              payment_status: "PAID",
            },
          ],
        },
        null,
        2
      ),
    },

    // 8.2 Booking Details by ID
    {
      num: "8.2",
      title: "Get Booking Details by ID",
      method: "GET",
      path: "/api/dashboard/bookings/:id",
      module: "Bookings Management",
      usage: "useGetBookingByIdQuery -> BookingDetails.tsx",
      tag: "providesTags: ['Bookings']",
      description: "Returns deep record of a booking including user details, assigned cleaner contact, and transaction log.",
      urlParams: [{ name: "id", type: "string", required: true, desc: "Booking ID" }],
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          data: {
            id: "bk_5021",
            status: "CONFIRMED",
            booking_date: "2026-10-18T09:00:00.000Z",
            total_price: 180.0,
            user: { name: "David Miller", email: "david@example.com", phone_number: "+1 555-0812" },
            maid: { id: "cln_9981", name: "Elena Rodriguez", phone_number: "+1 555-0245" },
            payment: { status: "PAID" },
          },
        },
        null,
        2
      ),
    },

    // 8.3 Update Booking Status
    {
      num: "8.3",
      title: "Update Booking Status",
      method: "PATCH",
      path: "/api/dashboard/bookings/:id/status",
      module: "Bookings Management",
      usage: "useUpdateBookingStatusMutation -> BookingDetails.tsx",
      tag: "invalidatesTags: ['Bookings']",
      description: "Transitions booking status: PENDING, CONFIRMED, IN-PROGRESS, COMPLETED, or CANCELLED.",
      urlParams: [{ name: "id", type: "string", required: true, desc: "Booking ID" }],
      bodyParams: [{ name: "status", type: "string", required: true, desc: "New uppercase booking status" }],
      sampleBody: JSON.stringify({ status: "COMPLETED" }, null, 2),
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, message: "Booking status updated successfully" }, null, 2),
    },

    // 8.4 Assign Booking Cleaner
    {
      num: "8.4",
      title: "Assign Cleaner to Booking",
      method: "PATCH",
      path: "/api/dashboard/bookings/:id/cleaner",
      module: "Bookings Management",
      usage: "useAssignBookingCleanerMutation -> BookingDetails.tsx",
      tag: "invalidatesTags: ['Bookings']",
      description: "Assigns or dispatches an approved cleaner to the scheduled booking.",
      urlParams: [{ name: "id", type: "string", required: true, desc: "Booking ID" }],
      bodyParams: [{ name: "cleaner_id", type: "string", required: true, desc: "Target Cleaner ID" }],
      sampleBody: JSON.stringify({ cleaner_id: "cln_9981" }, null, 2),
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, message: "Cleaner assigned successfully" }, null, 2),
    },

    // 9.1 Job Approvals List
    {
      num: "9.1",
      title: "Get Completed Job Approvals",
      method: "GET",
      path: "/api/dashboard/job-approvals",
      module: "Job Approvals",
      usage: "useGetJobApprovalQuery -> src/app/(admin-dashboard)/dashboard/jobAppruve/page.tsx",
      tag: "providesTags: ['JobApproval']",
      description: "Fetches completed cleaner jobs with before and after photo evidence and cleaner notes awaiting admin sign-off.",
      queryParams: [
        { name: "page", type: "number", required: false, desc: "Page number" },
        { name: "perPage", type: "number", required: false, desc: "Items per page" },
        { name: "search", type: "string", required: false, desc: "Search by booking number or cleaner" },
      ],
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          data: [
            {
              id: "job_301",
              bookingNo: "BK-2026-904",
              status: "PENDING_APPROVAL",
              amount: 220.0,
              maid: { name: "Maria Garcia" },
              before_photos: ["/uploads/jobs/b1.jpg"],
              after_photos: ["/uploads/jobs/a1.jpg"],
            },
          ],
        },
        null,
        2
      ),
    },

    // 9.2 Update Job Approval
    {
      num: "9.2",
      title: "Approve or Reject Completed Job",
      method: "PATCH",
      path: "/api/dashboard/job-approvals/:id",
      module: "Job Approvals",
      usage: "useGetJobApprovalUpdateMutation -> jobAppruve/page.tsx",
      tag: "invalidatesTags: ['JobApproval']",
      description: "Approves (COMPLETED) or rejects (REJECTED) a completed job submission.",
      urlParams: [{ name: "id", type: "string", required: true, desc: "Job Approval Record ID" }],
      bodyParams: [{ name: "status", type: "string", required: true, desc: "COMPLETED or REJECTED" }],
      sampleBody: JSON.stringify({ status: "COMPLETED" }, null, 2),
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, message: "Job completed successfully" }, null, 2),
    },

    // 10.1 Danger Requests List
    {
      num: "10.1",
      title: "Get Emergency SOS / Danger Requests",
      method: "GET",
      path: "/api/dashboard/danger/request",
      module: "Emergency SOS Alerts",
      usage: "useGetDangerRequestQuery -> src/app/(admin-dashboard)/dashboard/danger-request/page.tsx",
      tag: "providesTags: ['DangerRequest']",
      description: "Retrieves critical emergency panic alerts triggered on job sites, including reporter phone, name, and GPS coordinates.",
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          data: [
            {
              id: "dng_110",
              name: "Maria Garcia",
              phone_number: "+1 555-0992",
              latitude: 29.4241,
              longitude: -98.4936,
              location: "San Antonio, TX",
              status: "OPEN",
            },
          ],
        },
        null,
        2
      ),
    },

    // 10.2 Update Danger Request
    {
      num: "10.2",
      title: "Resolve Emergency SOS Request",
      method: "PATCH",
      path: "/api/dashboard/danger/request/:id",
      module: "Emergency SOS Alerts",
      usage: "useUpdateDangerRequestMutation -> DangerDetails.tsx",
      tag: "invalidatesTags: ['DangerRequest']",
      description: "Marks emergency alert status as RESOLVED or CLOSED.",
      urlParams: [{ name: "id", type: "string", required: true, desc: "Danger Request ID" }],
      bodyParams: [{ name: "status", type: "string", required: true, desc: "Status: RESOLVED or CLOSED" }],
      sampleBody: JSON.stringify({ status: "RESOLVED" }, null, 2),
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, message: "Emergency request marked as resolved successfully" }, null, 2),
    },

    // 11.1 Chat Conversations List
    {
      num: "11.1",
      title: "Get Support Chat Conversations",
      method: "GET",
      path: "/api/chat/conversation/conversation-list",
      module: "Support & Chat Gateway",
      usage: "useAllConversationUserQuery -> src/app/(admin-dashboard)/dashboard/support/page.tsx",
      tag: "providesTags: ['Conversation']",
      description: "Returns all customer support conversation threads with opponent user profile, online indicator, and unread counts.",
      queryParams: [
        { name: "page", type: "number", required: false, desc: "Page number" },
        { name: "perPage", type: "number", required: false, desc: "Page limit" },
      ],
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          conversations: [
            {
              conversation_id: "conv_room_88",
              opponent: { userId: "usr_9021", name: "Jessica Alba", isOnline: true },
              lastMessage: { text: "Can I reschedule?", createdAt: "2026-10-15T09:05:00.000Z" },
              unreadCount: 2,
            },
          ],
        },
        null,
        2
      ),
    },

    // 11.2 Chat Messages by Room
    {
      num: "11.2",
      title: "Get Messages by Conversation Room",
      method: "GET",
      path: "/api/chat/message/all-message/:conversationId",
      module: "Support & Chat Gateway",
      usage: "useAllConversationIdQuery -> src/app/(admin-dashboard)/dashboard/support/page.tsx",
      tag: "providesTags: ['Conversation']",
      description: "Retrieves complete chronological message log for an active conversation room.",
      urlParams: [{ name: "conversationId", type: "string", required: true, desc: "Conversation room ID" }],
      queryParams: [
        { name: "page", type: "number", required: false, desc: "Page number" },
        { name: "perPage", type: "number", required: false, desc: "Page limit" },
      ],
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          data: {
            messages: [
              {
                id: "msg_001",
                text: "Can I reschedule my appointment?",
                createdAt: "2026-10-15T08:50:00.000Z",
                sender: { id: "usr_9021", name: "Jessica Alba" },
              },
            ],
          },
        },
        null,
        2
      ),
    },

    // 11.3 Send Message
    {
      num: "11.3",
      title: "Send Chat Message (Text / Attachments)",
      method: "POST",
      path: "/api/chat/message/send-message",
      module: "Support & Chat Gateway",
      usage: "useSendConversationMessageMutation -> src/app/(admin-dashboard)/dashboard/support/page.tsx",
      tag: "invalidatesTags: ['Conversation']",
      description: "Sends a new message to a room. Accepts JSON for text or multipart/form-data for file attachments. Backend automatically emits the message socket event to other room participants.",
      bodyParams: [
        { name: "conversationId", type: "string", required: true, desc: "Active conversation room ID" },
        { name: "text", type: "string", required: false, desc: "Text message body" },
        { name: "attachments", type: "File[]", required: false, desc: "Image/document binary files (multipart)" },
      ],
      sampleBody: JSON.stringify({ conversationId: "conv_room_88", text: "Hello! We are checking your booking now." }, null, 2),
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          message: "Message sent successfully",
          data: { id: "msg_002", text: "Hello! We are checking your booking now.", createdAt: "2026-10-15T09:12:00.000Z" },
        },
        null,
        2
      ),
    },

    // 12.1 Notifications List
    {
      num: "12.1",
      title: "Get All Notifications (Paginated)",
      method: "GET",
      path: "/api/notification",
      module: "Notifications Module",
      usage: "useGetAllNotificationQuery -> Header Dropdown & /dashboard/notification",
      tag: "providesTags: ['Notification']",
      description: "Retrieves paginated notifications for current admin user with unread count and filters (is_read, type).",
      queryParams: [
        { name: "page", type: "number", required: false, desc: "Current page (default: 1)" },
        { name: "perPage", type: "number", required: false, desc: "Items per page (default: 10)" },
        { name: "is_read", type: "boolean", required: false, desc: "Filter by read status (true or false)" },
        { name: "type", type: "string", required: false, desc: "Filter by notification category type" },
      ],
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          message: "Notifications fetched successfully",
          unread_count: 3,
          data: [
            {
              id: "notif_1001",
              text: "New booking received for Deep Cleaning",
              type: "booking_created",
              isRead: false,
              is_read: false,
              bookingId: "bk_5021",
              created_at: "2026-10-15T09:10:00.000Z",
            },
          ],
          pagination: { total: 45, page: 1, perPage: 10, totalPages: 5 },
        },
        null,
        2
      ),
    },

    // 12.2 Unread Count
    {
      num: "12.2",
      title: "Get Unread Notification Count",
      method: "GET",
      path: "/api/notification/unread-count",
      module: "Notifications Module",
      usage: "useGetUnreadNotificationCountQuery -> Header Bell Badge & Notification Page",
      tag: "providesTags: ['Notification']",
      description: "Returns total unread count integer used to render the top navbar notification badge in real time.",
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, count: 3 }, null, 2),
    },

    // 12.3 Single Notification
    {
      num: "12.3",
      title: "Get Single Notification Details by ID",
      method: "GET",
      path: "/api/notification/:id",
      module: "Notifications Module",
      usage: "useGetSingleNotificationQuery -> NotificationDetailModal.tsx",
      tag: "providesTags: ['Notification']",
      description: "Fetches complete record of a specific notification for display in the preview modal.",
      urlParams: [{ name: "id", type: "string", required: true, desc: "Notification ID" }],
      status: "200 OK",
      sampleResponse: JSON.stringify(
        {
          success: true,
          message: "Notification details retrieved",
          data: {
            id: "notif_1001",
            text: "New cleaner registration: Carlos Gomez has submitted verification docs.",
            type: "cleaner_registration",
            isRead: true,
            is_read: true,
            applicationId: "req_8812",
            created_at: "2026-10-15T08:15:00.000Z",
          },
        },
        null,
        2
      ),
    },

    // 12.4 Mark All as Read
    {
      num: "12.4",
      title: "Mark All Notifications as Read",
      method: "PATCH",
      path: "/api/notification/read-all",
      module: "Notifications Module",
      usage: "useMarkAllNotificationsAsReadMutation -> Header Dropdown & Notification Page",
      tag: "invalidatesTags: ['Notification']",
      description: "Marks all notifications as read for current user. Resets unread counter to 0.",
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, message: "All notifications marked as read" }, null, 2),
    },

    // 12.5 Mark Single as Read
    {
      num: "12.5",
      title: "Mark Single Notification as Read",
      method: "PATCH",
      path: "/api/notification/:id/read",
      module: "Notifications Module",
      usage: "useMarkNotificationAsReadMutation -> NotificationDetailModal.tsx & List Row",
      tag: "invalidatesTags: ['Notification']",
      description: "Marks one notification as read. Automatically triggered when user opens the detail modal.",
      urlParams: [{ name: "id", type: "string", required: true, desc: "Notification ID" }],
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, message: "Notification marked as read" }, null, 2),
    },

    // 12.6 Delete Single Notification
    {
      num: "12.6",
      title: "Delete Single Notification",
      method: "DELETE",
      path: "/api/notification/:id",
      module: "Notifications Module",
      usage: "useDeleteNotificationMutation -> NotificationDetailModal.tsx & List Row",
      tag: "invalidatesTags: ['Notification']",
      description: "Permanently removes a notification from the user's feed.",
      urlParams: [{ name: "id", type: "string", required: true, desc: "Notification ID" }],
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, message: "Notification deleted successfully" }, null, 2),
    },

    // 12.7 Delete All Notifications
    {
      num: "12.7",
      title: "Delete All Notifications",
      method: "DELETE",
      path: "/api/notification",
      module: "Notifications Module",
      usage: "useDeleteAllNotificationsMutation -> Notification Page Header Button",
      tag: "invalidatesTags: ['Notification']",
      description: "Clears all notifications for the current user.",
      status: "200 OK",
      sampleResponse: JSON.stringify({ success: true, message: "All notifications deleted successfully" }, null, 2),
    },
  ];

  // Render each endpoint section
  endpoints.forEach((ep) => renderEndpointSection(ep));

  // --- SECTION 13: REALTIME SOCKET.IO GATEWAY TABLES ---
  children.push(createSectionHeader("13. Socket.IO Real-Time Gateway Specifications"));

  children.push(createSubHeader("13.1 Connection & Handshake Parameters"));
  const socketHandshakeTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Parameter", 25),
          createHeaderCell("Handshake Location", 25),
          createHeaderCell("Purpose & Gateway Target", 50),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("token", 25, { mono: true, bold: true }),
          createDataCell("socket.auth.token", 25, { mono: true }),
          createDataCell("Used by Chat Gateway to authenticate user identity and permissions via JWT.", 50),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("userId", 25, { mono: true, bold: true }),
          createDataCell("socket.query.userId", 25, { mono: true }),
          createDataCell("Used by Notification Gateway to bind client socket to user private notification room.", 50),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("transports", 25, { mono: true, bold: true }),
          createDataCell("socket options", 25, { mono: true }),
          createDataCell("['websocket', 'polling'] with auto-upgrade and automatic exponential backoff reconnection.", 50),
        ],
      }),
    ],
  });
  children.push(socketHandshakeTable);

  children.push(createSubHeader("13.2 Client to Server Socket Events"));
  const clientEventsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Event Name", 25),
          createHeaderCell("Payload Type / Shape", 35),
          createHeaderCell("Description & Action", 40),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("joinroom", 25, { mono: true, bold: true }),
          createDataCell("{ room_id: string }", 35, { mono: true }),
          createDataCell("Joins active chat conversation room to listen for live incoming messages.", 40),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("updateMessageStatus", 25, { mono: true, bold: true }),
          createDataCell("{ message_id: string, status: 'READ' }", 35, { mono: true }),
          createDataCell("Emits read receipt update to other conversation participants.", 40),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("sendNotification", 25, { mono: true, bold: true }),
          createDataCell("{ userId: string, title?: string, ... }", 35, { mono: true }),
          createDataCell("Legacy broadcast event (non-confidential relay).", 40),
        ],
      }),
    ],
  });
  children.push(clientEventsTable);

  children.push(createSubHeader("13.3 Server to Client Socket Events"));
  const serverEventsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Event Name", 25),
          createHeaderCell("Payload Shape", 35),
          createHeaderCell("Frontend Reaction & State Update", 40),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("message", 25, { mono: true, bold: true }),
          createDataCell("{ from: string, data: ChatMessage }", 35, { mono: true }),
          createDataCell("Injects new incoming chat message directly into chat thread and updates conversation list preview.", 40),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("receiveNotification", 25, { mono: true, bold: true }),
          createDataCell("{ userId: string, text: string, type: string }", 35, { mono: true }),
          createDataCell("Invalidates 'Notification' RTK tag, plays notification chime, increments live unread badge count.", 40),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("joinedRoom", 25, { mono: true, bold: true }),
          createDataCell("{ room_id: string }", 35, { mono: true }),
          createDataCell("Confirms server has placed client in the requested conversation room.", 40),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("userStatusChange", 25, { mono: true, bold: true }),
          createDataCell("{ user_id: string, status: string }", 35, { mono: true }),
          createDataCell("Updates green online presence indicator dot in support contact list.", 40),
        ],
      }),
      new TableRow({
        children: [
          createDataCell("messageStatusUpdated", 25, { mono: true, bold: true }),
          createDataCell("{ message_id: string, status: string }", 35, { mono: true }),
          createDataCell("Updates checkmark delivery indicator on sent message bubbles.", 40),
        ],
      }),
    ],
  });
  children.push(serverEventsTable);

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1000,
              right: 1000,
            },
          },
        },
        children,
      },
    ],
  });
}

// Write to file
async function main() {
  console.log("Generating api-document.docx...");
  const doc = buildDocument();
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, "../api-document.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log("Successfully created:", outputPath);
  console.log("File size:", (buffer.length / 1024).toFixed(2), "KB");
}

main().catch((err) => {
  console.error("Error creating docx:", err);
  process.exit(1);
});
