import Link from "next/link";
import { TrendingUp } from "lucide-react";

const LAST_UPDATED = "02 June 2026";
const COMPANY      = "NSE Scanner Pro";
const EMAIL        = "himanshumani72@gmail.com";
const URL          = "nse-scanner-web.vercel.app";

export const metadata = {
  title: "Terms of Service — NSE Scanner Pro",
  description: "Terms and conditions for using NSE Scanner Pro.",
};

export default function TermsPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-0)", color: "var(--ink-0)",
      fontFamily: "inherit",
    }}>
      {/* Nav */}
      <nav style={{
        borderBottom: "1px solid var(--line)",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--bg-1)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #2bd07a 0%, #5b8cff 100%)",
            display: "grid", placeItems: "center",
          }}>
            <TrendingUp size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--ink-0)" }}>NSE Scanner Pro</span>
        </Link>
        <div style={{ display: "flex", gap: 20, fontSize: 13, color: "var(--ink-2)" }}>
          <Link href="/privacy" style={{ color: "var(--ink-2)", textDecoration: "none" }}>Privacy</Link>
          <Link href="/refund"  style={{ color: "var(--ink-2)", textDecoration: "none" }}>Refund</Link>
          <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none" }}>Dashboard →</Link>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>Legal</p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "var(--ink-0)", margin: "0 0 8px" }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: "var(--ink-3)", margin: "0 0 40px" }}>Last updated: {LAST_UPDATED}</p>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using {COMPANY} ("the Platform", "we", "our"), you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
          <p>These Terms apply to all visitors, subscribers, and other users of the platform.</p>
        </Section>

        <Section title="2. Nature of Service">
          <p>{COMPANY} is a <strong>software-as-a-service (SaaS) research and data analytics tool</strong>. We scan publicly available NSE/BSE market data and surface statistical patterns, volume anomalies, and technical indicators.</p>
          <Highlight>
            {COMPANY} is <strong>NOT a registered Investment Advisor</strong> with SEBI and does <strong>NOT provide investment, financial, or trading advice</strong>. All content is for informational and research purposes only. Nothing on this platform constitutes a recommendation to buy or sell any security.
          </Highlight>
          <p>You are solely responsible for any decisions you make using information from this platform. Always consult a SEBI-registered investment advisor for personalised financial guidance.</p>
        </Section>

        <Section title="3. Eligibility">
          <p>You must be at least 18 years of age to use this platform. By using the platform, you confirm you are of legal age and capable of entering into a binding agreement.</p>
          <p>The platform is intended for use in India and complies with applicable Indian laws and regulations.</p>
        </Section>

        <Section title="4. Account Registration">
          <p>To access paid features, you must create an account by providing your full name, email address, and mobile number. You agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the confidentiality of your password</li>
            <li>Notify us immediately of any unauthorised access to your account</li>
            <li>Be responsible for all activity that occurs under your account</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
        </Section>

        <Section title="5. Subscription and Payment">
          <p>Access to premium features requires a paid subscription. Current pricing:</p>
          <ul>
            <li><strong>Free Trial:</strong> 30 days full access, no payment required</li>
            <li><strong>Subscription:</strong> ₹49/month for the first 3 months (launch offer), then ₹99/month</li>
            <li>Payments are processed via UPI. No credit/debit card information is stored on our servers.</li>
            <li>Subscriptions are activated manually upon payment verification. Activation typically occurs within 24 hours of payment.</li>
          </ul>
          <p>Prices may be revised with 30 days' prior notice to registered email addresses.</p>
        </Section>

        <Section title="6. Permitted Use">
          <p>You may use the platform for your personal investment research. You agree NOT to:</p>
          <ul>
            <li>Redistribute, resell, or share scan results commercially without written consent</li>
            <li>Use automated bots or scrapers to access the platform</li>
            <li>Attempt to reverse-engineer, decompile, or extract our proprietary algorithms</li>
            <li>Use the platform to provide financial advisory services to third parties</li>
            <li>Share your account credentials with others</li>
            <li>Misrepresent scan results as professional investment advice</li>
          </ul>
        </Section>

        <Section title="7. Data Sources and Accuracy">
          <p>Our scanners use publicly available data from NSE, BSE, and yfinance. While we take care to ensure accuracy:</p>
          <ul>
            <li>Data may be delayed by up to 15 minutes</li>
            <li>Historical data accuracy depends on third-party data providers</li>
            <li>Scanner signals are statistical in nature and are NOT guaranteed to be accurate or profitable</li>
            <li>We are not responsible for errors in underlying data from NSE, BSE, or data providers</li>
          </ul>
        </Section>

        <Section title="8. Disclaimer of Warranties">
          <p>The platform is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that:</p>
          <ul>
            <li>The platform will be uninterrupted or error-free</li>
            <li>Scan results will be accurate, complete, or current</li>
            <li>Following signals will result in profitable trades</li>
          </ul>
          <Highlight>
            Past pattern accuracy does not guarantee future performance. Markets carry inherent risk. Never risk more than you can afford to lose.
          </Highlight>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>To the maximum extent permitted by applicable law, {COMPANY} and its founders shall not be liable for:</p>
          <ul>
            <li>Any trading losses arising from use of our signals</li>
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of profits, data, or goodwill</li>
            <li>Interruptions or delays in service</li>
          </ul>
          <p>Our total liability to you shall not exceed the amount paid by you in the 30 days preceding the claim.</p>
        </Section>

        <Section title="10. Intellectual Property">
          <p>All content, algorithms, software, and design on this platform are the exclusive intellectual property of {COMPANY}. You may not copy, reproduce, or distribute any part of the platform without written permission.</p>
        </Section>

        <Section title="11. Termination">
          <p>We may terminate or suspend your account at any time, with or without notice, for conduct that we believe violates these Terms. Upon termination, your right to use the platform ceases immediately.</p>
          <p>You may cancel your subscription at any time. See our Refund Policy for details.</p>
        </Section>

        <Section title="12. Governing Law">
          <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Chennai, Tamil Nadu.</p>
        </Section>

        <Section title="13. Changes to Terms">
          <p>We may update these Terms from time to time. We will notify registered users by email of significant changes. Continued use of the platform after changes constitutes acceptance of the new Terms.</p>
        </Section>

        <Section title="14. Contact">
          <p>For questions about these Terms, contact us at: <a href={`mailto:${EMAIL}`} style={{ color: "var(--accent)" }}>{EMAIL}</a></p>
          <p>Platform: <a href={`https://${URL}`} style={{ color: "var(--accent)" }}>{URL}</a></p>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--line)", display: "flex", gap: 24, fontSize: 13, color: "var(--ink-3)" }}>
          <Link href="/privacy" style={{ color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/refund"  style={{ color: "var(--accent)", textDecoration: "none" }}>Refund Policy</Link>
          <Link href="/"        style={{ color: "var(--ink-3)", textDecoration: "none" }}>← Home</Link>
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

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: "12px 16px", borderRadius: 9,
      background: "color-mix(in oklab, var(--warn) 10%, transparent)",
      border: "1px solid color-mix(in oklab, var(--warn) 30%, transparent)",
      color: "var(--ink-0)", fontSize: 14, lineHeight: 1.6,
    }}>
      {children}
    </div>
  );
}
