"use client";

import {
  Shield,
  Lock,
  Eye,
  Share2,
  Cookie,
  Clock,
  Mail,
  ChevronRight,
} from "lucide-react";

const LAST_UPDATED = "July 18, 2026";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    icon: Shield,
    content: (
      <>
        <p>
          Welcome to our Maid Service Management System. We are committed to
          protecting your privacy and ensuring the security of your personal
          information. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use our platform as
          a homeowner, cleaner, or administrator.
        </p>
        <p className="mt-3">
          By accessing or using our services, you agree to the collection and
          use of information in accordance with this policy. If you do not agree
          with our policies and practices, please do not use our services.
        </p>
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
          We do not sell your personal information. We may share your
          information only in the following circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#4A5565]">
          <li>
            <span className="font-medium text-[#101828]">Service Providers:</span>{" "}
            With trusted third parties who assist in payment processing, hosting,
            analytics, and customer support
          </li>
          <li>
            <span className="font-medium text-[#101828]">Between Users:</span>{" "}
            Homeowners and cleaners may see limited profile information necessary
            to complete a booking
          </li>
          <li>
            <span className="font-medium text-[#101828]">Legal Requirements:</span>{" "}
            When required by law, court order, or government request
          </li>
          <li>
            <span className="font-medium text-[#101828]">Business Transfers:</span>{" "}
            In connection with a merger, acquisition, or sale of company assets
          </li>
          <li>
            <span className="font-medium text-[#101828]">With Your Consent:</span>{" "}
            When you have given us explicit permission to share your data
          </li>
        </ul>
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
          We implement appropriate technical and organizational security measures
          to protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. These measures include
          encrypted data transmission, secure server infrastructure, access
          controls, and regular security assessments.
        </p>
        <p className="mt-3">
          However, no method of transmission over the Internet or electronic
          storage is 100% secure. While we strive to protect your personal
          information, we cannot guarantee its absolute security.
        </p>
      </>
    ),
  },

  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    icon: Lock,
    content: (
      <>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#4A5565]">
          <li>Provide, operate, and maintain our maid service platform</li>
          <li>Process bookings, payments, and service transactions</li>
          <li>Verify cleaner identities and approve service requests</li>
          <li>Send notifications about bookings, payments, and account activity</li>
          <li>Improve our services, user experience, and platform security</li>
          <li>Respond to customer support inquiries and resolve disputes</li>
          <li>Comply with legal obligations and enforce our terms of service</li>
          <li>Detect, prevent, and address fraud or unauthorized access</li>
        </ul>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "6. Your Rights & Choices",
    icon: Shield,
    content: (
      <>
        <p className="mb-4">
          Depending on your location, you may have the following rights
          regarding your personal data:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#4A5565]">
          <li>Access and receive a copy of your personal information</li>
          <li>Correct inaccurate or incomplete data</li>
          <li>Request deletion of your personal information</li>
          <li>Object to or restrict certain processing of your data</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Opt out of marketing communications at any time</li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, please contact us using the details
          provided at the bottom of this page. We will respond to your request
          within a reasonable timeframe.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "7. Cookies & Tracking Technologies",
    icon: Cookie,
    content: (
      <>
        <p>
          We use cookies and similar tracking technologies to enhance your
          experience, analyze platform usage, and remember your preferences.
          Cookies are small data files stored on your device that help us
          recognize you and improve our services.
        </p>
        <p className="mt-3 mb-4">Types of cookies we use:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#4A5565]">
          <li>
            <span className="font-medium text-[#101828]">Essential Cookies:</span>{" "}
            Required for platform functionality and authentication
          </li>
          <li>
            <span className="font-medium text-[#101828]">Analytics Cookies:</span>{" "}
            Help us understand how users interact with our platform
          </li>
          <li>
            <span className="font-medium text-[#101828]">Preference Cookies:</span>{" "}
            Remember your settings and personalization choices
          </li>
        </ul>
        <p className="mt-4">
          You can control cookies through your browser settings. Disabling
          certain cookies may affect the functionality of our platform.
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
          We retain your personal information for as long as necessary to
          fulfill the purposes outlined in this Privacy Policy, unless a
          longer retention period is required or permitted by law. When your
          account is closed or you request deletion, we will remove or
          anonymize your data within a reasonable period, except where we are
          required to retain it for legal, regulatory, or legitimate business
          purposes.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    icon: Shield,
    content: (
      <>
        <p>
          Our services are not intended for individuals under the age of 18. We
          do not knowingly collect personal information from children. If we
          become aware that we have collected personal data from a child without
          parental consent, we will take steps to delete that information
          promptly. If you believe we have collected information from a minor,
          please contact us immediately.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    icon: Clock,
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect
          changes in our practices, technology, legal requirements, or other
          factors. We will notify you of any material changes by posting the
          updated policy on this page and updating the &quot;Last Updated&quot;
          date. We encourage you to review this Privacy Policy periodically to
          stay informed about how we protect your information.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "11. Contact Us",
    icon: Mail,
    content: (
      <>
        <p className="mb-4">
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or our data practices, please contact us:
        </p>
        <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-3">
          <div>
            <p className="text-sm text-[#6A7282]">Email</p>
            <p className="font-medium text-[#101828] text-sm">
              privacy@maidservice.com
            </p>
          </div>
          <div>
            <p className="text-sm text-[#6A7282]">Support</p>
            <p className="font-medium text-[#101828] text-sm">
              support@maidservice.com
            </p>
          </div>
          <div>
            <p className="text-sm text-[#6A7282]">Response Time</p>
            <p className="font-medium text-[#101828] text-sm">
              Within 5 business days
            </p>
          </div>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="px-10 max-w-7xl mx-auto space-y-6 py-10">
      {/* Hero Card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0px_4px_33px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#03652B]">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-[#032B15] text-[20px] font-bold leading-100%">
                Privacy Policy
              </h1>
              <p className="mt-2 text-sm font-normal text-[#4A5565] leading-140%">
                Learn how we collect, use, and protect your personal information
                on our Maid Service Management System.
              </p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Last Updated: {LAST_UPDATED}
          </span>
        </div>
      </div>

      <div className="">
        {/* Table of Contents */}
        {/* <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 h-fit lg:sticky lg:top-6">
          <p className="text-[#03652B] font-bold text-lg mb-4">
            Table of Contents
          </p>
          <nav className="space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#4A5565] transition-colors hover:bg-[#F9FAFB] hover:text-[#03652B]"
              >
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#6A7282]" />
                {section.title.replace(/^\d+\.\s/, "")}
              </a>
            ))}
          </nav>
        </div> */}

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
                  <h2 className="text-[#032B15] text-base font-bold leading-100%">
                    {section.title}
                  </h2>
                </div>
                <div className="text-sm font-normal text-[#4A5565] leading-140%">
                  {section.content}
                </div>
              </section>
            );
          })}

          {/* Footer Note */}
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 text-center">
            <p className="text-sm text-[#6A7282]">
              By continuing to use our Maid Service Management System, you
              acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
