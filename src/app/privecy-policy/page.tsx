"use client";

import {
  Shield,
  Lock,
  Eye,
  Share2,
  Cookie,
  Clock,
  Mail,
  Globe,
  UserX,
  Layers,
  Smartphone,
  FileText,
} from "lucide-react";

const LAST_UPDATED = "August 13, 2026";
const DEVELOPER_NAME = "Cleen-N-Connect";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    icon: Shield,
    content: (
      <>
        <p>
          Cleen-N-Connect is a marketplace app that connects homeowners with
          cleaning professionals. Users can create accounts, book cleaning
          services, message the other party, make payments, upload documents or
          job photos, and manage bookings.
        </p>
        <p className="mt-3">
          This policy applies to the Cleen-N-Connect app available on Google
          Play and the App Store, and to data processed through our backend at{" "}
          <span className="font-semibold text-[#101828]">
            backend.cleennconnect.com
          </span>{" "}
          and related services.
        </p>
      </>
    ),
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    icon: Eye,
    content: (
      <>
        <p className="mb-4">
          We collect information you provide and information generated when you
          use Cleen-N-Connect.
        </p>

        <div className="space-y-5">
          <div>
            <h4 className="font-semibold text-[#101828] text-sm mb-2">
              2.1 Information you provide
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-[#4A5565]">
              <li>
                <span className="font-medium text-[#101828]">
                  Account & contact details:
                </span>{" "}
                name, email address, phone number, password (stored securely),
                role (homeowner or cleaner)
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Profile information:
                </span>{" "}
                profile photo, bio/about text, location/address details you save
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Booking & service details:
                </span>{" "}
                service type, schedule, addresses, notes, booking status
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Communications:
                </span>{" "}
                in-app messages and related attachments
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Media you upload:
                </span>{" "}
                profile photos, chat images, verification documents,
                before/after job photos
              </li>
              <li>
                <span className="font-medium text-[#101828]">Reviews:</span>{" "}
                ratings and written comments
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Payment-related information:
                </span>{" "}
                wallet activity, transaction history, and payment details
                processed by our payment providers (we do not store full card
                numbers on our servers when handled by the payment processor)
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Support requests:
                </span>{" "}
                information you send to support@cleennconnect.com
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#101828] text-sm mb-2">
              2.2 Information collected automatically
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-[#4A5565]">
              <li>
                <span className="font-medium text-[#101828]">
                  Device & app data:
                </span>{" "}
                device type, OS version, app version, push notification tokens
                (FCM)
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Approximate or precise location:
                </span>{" "}
                when you grant permission, used for nearby cleaners, address
                selection on maps, and safety/danger-alert features during
                active jobs
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Usage & diagnostics:
                </span>{" "}
                basic logs needed to operate the Service, prevent fraud, and
                fix issues
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Authentication data:
                </span>{" "}
                including when you sign in with Google Sign-In / Firebase
                Authentication
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#101828] text-sm mb-2">
              2.3 Permissions (mobile)
            </h4>
            <p className="mb-2">
              Depending on your device settings, Cleen-N-Connect may request:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#4A5565]">
              <li>
                <span className="font-medium text-[#101828]">Camera</span> —
                profile photos, chat attachments, verification documents, job
                photos
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Photos / media
                </span>{" "}
                (via system picker where available) — select images to upload
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Location (when in use)
                </span>{" "}
                — nearby matching and accurate service addresses
              </li>
              <li>
                <span className="font-medium text-[#101828]">
                  Notifications
                </span>{" "}
                — booking and account updates
              </li>
            </ul>
            <p className="mt-3">
              You can deny or revoke permissions in device settings. Some
              features may not work without them.
            </p>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#03652B] font-medium text-xs sm:text-sm">
            We do not sell your personal information.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    icon: Lock,
    content: (
      <>
        <p className="mb-4">We use personal information to:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#4A5565]">
          <li>Create and manage Cleen-N-Connect accounts</li>
          <li>Authenticate users (email/password and Google Sign-In)</li>
          <li>Match homeowners with cleaners and process bookings</li>
          <li>Enable in-app messaging and notifications</li>
          <li>Process payments, wallet deposits/withdrawals, and payouts</li>
          <li>Verify cleaner identities and review uploaded documents</li>
          <li>Show maps and location-based features you request</li>
          <li>Display reviews and ratings</li>
          <li>Provide customer support and resolve disputes</li>
          <li>Detect fraud, abuse, and security incidents</li>
          <li>Comply with law and enforce our terms</li>
          <li>Improve app reliability and user experience</li>
        </ul>
      </>
    ),
  },
  {
    id: "information-sharing",
    title: "4. Information Sharing & Disclosure",
    icon: Share2,
    content: (
      <>
        <p className="mb-4">
          We may share information only as needed to operate Cleen-N-Connect:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#4A5565]">
          <li>
            <span className="font-medium text-[#101828]">Between users:</span>{" "}
            limited profile and booking details needed to complete a service
            (for example, name, profile photo, booking address/time, and contact
            details relevant to the job)
          </li>
          <li>
            <span className="font-medium text-[#101828]">Service providers:</span>{" "}
            trusted vendors for hosting, payments, authentication, push
            notifications, and related infrastructure (for example, Firebase /
            Google for auth and messaging, and payment processors)
          </li>
          <li>
            <span className="font-medium text-[#101828]">
              Legal requirements:
            </span>{" "}
            when required by law, court order, or government request
          </li>
          <li>
            <span className="font-medium text-[#101828]">
              Business transfers:
            </span>{" "}
            in connection with a merger, acquisition, or sale of assets
          </li>
          <li>
            <span className="font-medium text-[#101828]">With your consent:</span>{" "}
            when you ask us to share information
          </li>
        </ul>
        <p className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#03652B] font-medium text-xs sm:text-sm">
          We do not sell personal information to advertisers.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "5. Data Security",
    icon: Lock,
    content: (
      <>
        <p>
          We use technical and organizational measures such as encrypted
          transmission (HTTPS), access controls, and secure storage practices. No
          method of transmission or storage is 100% secure, and we cannot
          guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "6. Your Rights, Choices & Account Deletion",
    icon: UserX,
    content: (
      <>
        <p className="mb-4">
          Depending on your location, you may have rights to access, correct,
          delete, or restrict processing of your personal data, withdraw
          consent, and opt out of marketing communications.
        </p>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 mt-4 space-y-2">
          <h4 className="font-bold text-[#032B15] text-sm flex items-center gap-2">
            <UserX className="h-4 w-4 text-[#03652B]" />
            How to delete your account
          </h4>
          <p className="text-[#4A5565] text-sm leading-relaxed">
            You can deactivate/delete your Cleen-N-Connect account from the app
            profile settings (
            <span className="font-semibold text-[#101828]">
              Deactivate account
            </span>
            ), or email{" "}
            <a
              href="mailto:support@cleennconnect.com"
              className="text-[#03652B] font-semibold underline"
            >
              support@cleennconnect.com
            </a>{" "}
            with the subject “Account Deletion” and the email used for your
            account. We will process verified requests within a reasonable time
            (typically within 5–30 days), except where we must retain limited
            data for legal, fraud-prevention, accounting, or dispute-resolution
            purposes.
          </p>
        </div>

        <p className="mt-4">
          To exercise other rights, contact{" "}
          <a
            href="mailto:support@cleennconnect.com"
            className="text-[#03652B] font-semibold underline"
          >
            support@cleennconnect.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "7. Cookies & Similar Technologies",
    icon: Cookie,
    content: (
      <>
        <p>
          Our websites (if any) may use cookies or similar technologies for
          essential functionality, preferences, and analytics. The mobile app
          may use similar identifiers (such as push tokens and authentication
          session data) to operate core features. You can control browser
          cookies in your browser settings; some features may not work if
          disabled.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "8. Data Retention",
    icon: Clock,
    content: (
      <>
        <p>
          We keep personal information only as long as needed to provide
          Cleen-N-Connect, fulfill the purposes in this policy, and meet legal
          or legitimate business requirements. After account deletion or a
          valid deletion request, we remove or anonymize data within a
          reasonable period, except where retention is required by law.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "9. Children’s Privacy",
    icon: Shield,
    content: (
      <>
        <p>
          Cleen-N-Connect is not intended for anyone under 18. We do not
          knowingly collect personal information from children. If you believe a
          minor has provided data, contact us and we will take steps to delete
          it.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "10. Third-Party Services",
    icon: Layers,
    content: (
      <>
        <p className="mb-4">
          Cleen-N-Connect uses third-party services that may process data on our
          behalf, including:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#4A5565]">
          <li>Google / Firebase (authentication, cloud messaging)</li>
          <li>Payment processors for wallet and payouts</li>
          <li>
            Mapping / location providers used for address and navigation
            features
          </li>
        </ul>
        <p className="mt-4">
          Their processing is governed by their own policies in addition to this
          Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: "international-users",
    title: "11. International Users",
    icon: Globe,
    content: (
      <>
        <p>
          If you access Cleen-N-Connect from outside the country where our
          servers or providers operate, your information may be transferred to
          and processed in other countries. We take steps reasonably designed
          to protect that information.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "12. Changes to This Policy",
    icon: Clock,
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time. We will post the
          updated version on this page and revise the “Last Updated” date.
          Continued use of Cleen-N-Connect after changes means you accept the
          updated policy.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "13. Contact Us",
    icon: Mail,
    content: (
      <>
        <p className="mb-4">
          If you have questions about this Privacy Policy or our data
          practices, contact us at the email below.
        </p>
        <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#6A7282] uppercase tracking-wider font-semibold">
                App Name
              </p>
              <p className="font-medium text-[#101828] text-sm mt-0.5">
                Cleen-N-Connect
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6A7282] uppercase tracking-wider font-semibold">
                Developer / Legal Entity
              </p>
              <p className="font-medium text-[#101828] text-sm mt-0.5">
                {DEVELOPER_NAME}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6A7282] uppercase tracking-wider font-semibold">
                Email
              </p>
              <p className="font-medium text-[#03652B] text-sm mt-0.5">
                <a
                  href="mailto:support@cleennconnect.com"
                  className="hover:underline"
                >
                  support@cleennconnect.com
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6A7282] uppercase tracking-wider font-semibold">
                Response Time
              </p>
              <p className="font-medium text-[#101828] text-sm mt-0.5">
                Within 5 business days
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="px-4 sm:px-10 max-w-7xl mx-auto space-y-6 py-10">
      {/* Hero Card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-[0px_4px_33px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#03652B]">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-[#032B15] text-[24px] font-bold leading-tight">
                Privacy Policy — Cleen-N-Connect
              </h1>
              <p className="mt-2 text-sm font-normal text-[#4A5565] leading-relaxed max-w-3xl">
                This Privacy Policy explains how {DEVELOPER_NAME} (“we,” “us,” or
                “our”) collects, uses, shares, and protects personal
                information when you use the Cleen-N-Connect mobile app and
                related services (the “Service”) as a homeowner, cleaner
                (maid), or other authorized user.
              </p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center shrink-0 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-[#03652B]">
            Last Updated: {LAST_UPDATED}
          </span>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E5E7EB]">
          <div>
            <p className="text-xs font-semibold text-[#6A7282] uppercase tracking-wider">
              App Name
            </p>
            <p className="text-sm font-medium text-[#101828] mt-0.5">
              Cleen-N-Connect
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6A7282] uppercase tracking-wider">
              Developer / Legal Entity
            </p>
            <p className="text-sm font-medium text-[#101828] mt-0.5">
              {DEVELOPER_NAME}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6A7282] uppercase tracking-wider">
              Package ID
            </p>
            <p className="text-sm font-mono text-[#101828] mt-0.5">
              com.cleennconnect.app
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6A7282] uppercase tracking-wider">
              Website / Services
            </p>
            <p className="text-sm font-medium text-[#101828] mt-0.5">
              cleennconnect.com
            </p>
          </div>
        </div>

        {/* User Agreement Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs sm:text-sm text-[#4A5565]">
          By using Cleen-N-Connect, you agree to this Privacy Policy. If you do
          not agree, please do not use the Service.
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#E5E7EB]">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0FDF4]">
                  <Icon className="h-4 w-4 text-[#03652B]" />
                </div>
                <h2 className="text-[#032B15] text-base font-bold leading-tight">
                  {section.title}
                </h2>
              </div>
              <div className="text-sm font-normal text-[#4A5565] leading-relaxed">
                {section.content}
              </div>
            </section>
          );
        })}

        {/* Footer Note */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 text-center">
          <p className="text-sm text-[#6A7282]">
            By continuing to use Cleen-N-Connect, you acknowledge that you have
            read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

