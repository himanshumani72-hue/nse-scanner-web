import Link from "next/link";
import { TrendingUp } from "lucide-react";

const LAST_UPDATED = "02 June 2026";
const EMAIL        = "himanshumani72@gmail.com";

export const metadata = {
  title: "Privacy Policy — NSE Scanner Pro",
  description: "How NSE Scanner Pro collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-0)", color: "var(--ink-0)", fontFamily: "inherit" }}>
      <nav style={{ borderBottom: "1px solid var(--line)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-1)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #2bd07a 0%, #5b8cff 100%)", display: "grid", placeItems: "center" }}>
            <TrendingUp size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--ink-0)" }}>NSE Scanner Pro</span>
        </Link>
        <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
          <Link href="/terms"   style={{ color: "var(--ink-2)", textDecoration: "none" }}>Terms</Link>
          <Link href="/refund"  style={{ color: "var(--ink-2)", textDecoration: "none" }}>Refund</Link>
          <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none" }}>Dashboard →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>Legal</p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "var(--ink-0)", margin: "0 0 8px" }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: "var(--ink-3)", margin: "0 0 40px" }}>Last updated: {LAST_UPDATED}</p>

        <Section title="1. Overview">
          <p>This Privacy Policy explains how NSE Scanner Pro ("we", "our", "the Platform") collects, uses, stores, and protects your personal information when you use our services.</p>
          <p>We are committed to protecting your privacy and complying with applicable Indian data protection laws including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.</p>
        </Section>

        <Section title="2. Data We Collect">
          <p><strong>Information you provide when registering:</strong></p>
          <ul>
            <li><strong>Full name</strong> — for account identification</li>
            <li><strong>Email address</strong> — for login, notifications, and verification</li>
            <li><strong>Mobile number (with +91 prefix)</strong> — for payment verification and account recovery</li>
            <li><strong>Password</strong> — stored securely (hashed, never in plain text) via Supabase Auth</li>
          </ul>
          <p><strong>Information collected automatically:</strong></p>
          <ul>
            <li>Login timestamps and session data</li>
            <li>Browser type and operating system (for security monitoring)</li>
            <li>IP address (for fraud prevention)</li>
          </ul>
          <p><strong>Payment information:</strong></p>
          <ul>
            <li>UPI Transaction Reference (UTR) — submitted by you for payment verification</li>
            <li>We do NOT store card numbers, CVV, or bank account details</li>
            <li>Payment is processed via UPI — funds go directly to our UPI account</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Data">
          <p>We use your data only for:</p>
          <ul>
            <li><strong>Service delivery</strong> — providing access to scanner alerts and dashboard</li>
            <li><strong>Account management</strong> — login, password reset, subscription tracking</li>
            <li><strong>Payment verification</strong> — matching your UTR to confirm subscription payments</li>
            <li><strong>Communications</strong> — sending verification emails, subscription confirmations, and important service updates</li>
            <li><strong>Security</strong> — detecting and preventing fraudulent access</li>
          </ul>
          <p>We do <strong>NOT</strong> use your data for:</p>
          <ul>
            <li>Selling or sharing with third-party advertisers</li>
            <li>Profiling or behavioural advertising</li>
            <li>Any purpose unrelated to providing our service</li>
          </ul>
        </Section>

        <Section title="4. Data Storage and Security">
          <p>Your data is stored on:</p>
          <ul>
            <li><strong>Supabase</strong> (supabase.com) — database and authentication, hosted on AWS in Singapore region</li>
            <li><strong>Vercel</strong> (vercel.com) — web hosting, globally distributed CDN</li>
          </ul>
          <p>Security measures we implement:</p>
          <ul>
            <li>Passwords hashed using industry-standard bcrypt algorithm</li>
            <li>All data transmission encrypted via TLS/HTTPS</li>
            <li>Row-Level Security (RLS) on all database tables — users can only access their own data</li>
            <li>Service-role API keys never exposed to browsers</li>
          </ul>
        </Section>

        <Section title="5. Data Sharing">
          <p>We share your data with:</p>
          <ul>
            <li><strong>Supabase</strong> — for database storage and authentication (data processor)</li>
            <li><strong>Vercel</strong> — for web hosting (data processor)</li>
            <li><strong>Resend</strong> (if configured) — for transactional emails only</li>
          </ul>
          <p>We do NOT sell, trade, or rent your personal information to third parties. We do not share data with any financial institutions, brokers, or advertisers.</p>
          <p>We may disclose your data if required by law or a court order from an Indian court of competent jurisdiction.</p>
        </Section>

        <Section title="6. Cookies and Local Storage">
          <p>We use:</p>
          <ul>
            <li><strong>Session cookies</strong> — to keep you logged in (essential, cannot be disabled)</li>
            <li><strong>LocalStorage</strong> — to remember your theme preference (light/dark)</li>
          </ul>
          <p>We do NOT use tracking cookies, advertising cookies, or any third-party analytics cookies.</p>
        </Section>

        <Section title="7. Data Retention">
          <ul>
            <li>Active account data: retained for the duration of your account</li>
            <li>Deleted account data: removed within 30 days of account deletion</li>
            <li>Payment records (UTR references): retained for 7 years as required by Indian financial regulations</li>
            <li>Security logs: retained for 90 days</li>
          </ul>
        </Section>

        <Section title="8. Your Rights">
          <p>Under applicable Indian law, you have the right to:</p>
          <ul>
            <li><strong>Access</strong> — request a copy of data we hold about you</li>
            <li><strong>Correction</strong> — request correction of inaccurate data</li>
            <li><strong>Deletion</strong> — request deletion of your account and personal data</li>
            <li><strong>Portability</strong> — request your data in a machine-readable format</li>
          </ul>
          <p>To exercise any of these rights, email us at: <a href={`mailto:${EMAIL}`} style={{ color: "var(--accent)" }}>{EMAIL}</a></p>
          <p>We will respond within 30 days of receiving your request.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>Our platform is not intended for persons under 18 years of age. We do not knowingly collect personal data from minors. If you believe a minor has provided us with personal data, please contact us immediately.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>We may update this Privacy Policy periodically. We will notify you of significant changes by email. The "Last updated" date at the top will reflect the latest revision. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="11. Contact Us">
          <p>For privacy-related queries or to exercise your rights:</p>
          <ul>
            <li>Email: <a href={`mailto:${EMAIL}`} style={{ color: "var(--accent)" }}>{EMAIL}</a></li>
            <li>Response time: within 30 business days</li>
          </ul>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--line)", display: "flex", gap: 24, fontSize: 13, color: "var(--ink-3)" }}>
          <Link href="/terms"  style={{ color: "var(--accent)", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/refund" style={{ color: "var(--accent)", textDecoration: "none" }}>Refund Policy</Link>
          <Link href="/"       style={{ color: "var(--ink-3)", textDecoration: "none" }}>← Home</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-0)", margin: "0 0 12px", paddingBottom: 8, borderBottom: "1px solid var(--line)" }}>{title}</h2>
      <div style={{ fontSize: 14.5, color: "var(--ink-1)", lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}
