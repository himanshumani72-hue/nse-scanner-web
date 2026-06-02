import Link from "next/link";
import { TrendingUp } from "lucide-react";

const LAST_UPDATED = "02 June 2026";
const EMAIL        = "himanshumani72@gmail.com";

export const metadata = {
  title: "Refund Policy — NSE Scanner Pro",
  description: "Cancellation and refund policy for NSE Scanner Pro subscriptions.",
};

export default function RefundPage() {
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
          <Link href="/privacy" style={{ color: "var(--ink-2)", textDecoration: "none" }}>Privacy</Link>
          <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none" }}>Dashboard →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>Legal</p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "var(--ink-0)", margin: "0 0 8px" }}>Refund & Cancellation Policy</h1>
        <p style={{ fontSize: 13, color: "var(--ink-3)", margin: "0 0 40px" }}>Last updated: {LAST_UPDATED}</p>

        {/* Summary box */}
        <div style={{
          padding: "18px 22px", borderRadius: 12, marginBottom: 40,
          background: "color-mix(in oklab, var(--up) 10%, transparent)",
          border: "1px solid color-mix(in oklab, var(--up) 30%, transparent)",
        }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 600, color: "var(--up)" }}>Quick Summary</h3>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: "var(--ink-1)", lineHeight: 1.7 }}>
            <li>30-day free trial — no payment, no risk</li>
            <li>Subscriptions are month-to-month (not auto-renewing) — you actively choose to renew</li>
            <li>Refunds available within 7 days of payment if the platform did not work as described</li>
            <li>No refunds after 7 days or for trial periods</li>
            <li>Cancel anytime — no penalties</li>
          </ul>
        </div>

        <Section title="1. Free Trial">
          <p>NSE Scanner Pro offers a <strong>30-day free trial</strong> to all new users. During the trial:</p>
          <ul>
            <li>No payment is required</li>
            <li>Full access to all features is available</li>
            <li>No credit/debit card information is collected</li>
            <li>The trial ends automatically — access reverts to limited view, no charges are applied</li>
          </ul>
          <p>Refunds are not applicable to free trial periods as no payment is made.</p>
        </Section>

        <Section title="2. Subscription Model">
          <p>Our subscription is <strong>pay-per-month via UPI</strong> — not an auto-recurring mandate. This means:</p>
          <ul>
            <li>You manually pay ₹49 (launch offer, first 3 months) or ₹99 each month</li>
            <li>There is NO auto-debit, NO ECS mandate, NO recurring UPI mandate</li>
            <li>If you do not pay for a month, your subscription simply does not renew</li>
            <li>You are in full control — no need to "cancel" a recurring charge</li>
          </ul>
        </Section>

        <Section title="3. Refund Eligibility">
          <p>You may request a refund if:</p>
          <ul>
            <li><strong>Platform non-delivery:</strong> You paid but your subscription was not activated within 48 hours and we could not resolve it</li>
            <li><strong>Technical failure:</strong> The platform was inaccessible for more than 72 continuous hours due to our fault</li>
            <li><strong>Duplicate payment:</strong> You accidentally paid twice for the same subscription period</li>
          </ul>
          <p>Refund requests must be made within <strong>7 days of the payment date</strong>.</p>
        </Section>

        <Section title="4. Non-Refundable Situations">
          <p>Refunds will NOT be issued for:</p>
          <ul>
            <li>Change of mind after activating a subscription</li>
            <li>Dissatisfaction with scanner signals or pattern accuracy (signals are statistical tools, not guarantees)</li>
            <li>Trading losses incurred using the platform</li>
            <li>Requests made after 7 days from the payment date</li>
            <li>Periods during which the service was accessible and functional</li>
            <li>Free trial periods</li>
          </ul>
        </Section>

        <Section title="5. How to Request a Refund">
          <p>To request a refund, email us at <a href={`mailto:${EMAIL}`} style={{ color: "var(--accent)" }}>{EMAIL}</a> with:</p>
          <ul>
            <li>Subject line: "Refund Request — [your registered email]"</li>
            <li>Your full name and registered email address</li>
            <li>UPI Transaction Reference (UTR number)</li>
            <li>Reason for the refund request</li>
            <li>Date of payment</li>
          </ul>
          <p>We will review your request and respond within <strong>5 business days</strong>.</p>
        </Section>

        <Section title="6. Refund Processing">
          <p>Approved refunds will be:</p>
          <ul>
            <li>Processed back to the same UPI account/number that made the payment</li>
            <li>Initiated within 5 business days of approval</li>
            <li>Reflected in your account within 3-7 additional business days depending on your bank</li>
          </ul>
          <p>We are unable to process refunds to a different UPI account or bank account than the one used for payment.</p>
        </Section>

        <Section title="7. Cancellation">
          <p>Since our subscription is not auto-renewing, there is nothing to formally "cancel." Simply do not make a payment for the next month and your subscription will not renew.</p>
          <p>If you would like your account deleted entirely (including all your data), email us at <a href={`mailto:${EMAIL}`} style={{ color: "var(--accent)" }}>{EMAIL}</a> and we will process the deletion within 30 days.</p>
        </Section>

        <Section title="8. Service Credits">
          <p>In cases where a refund is not eligible but we acknowledge service disruption on our end, we may offer service credits (additional subscription days) at our discretion as an alternative resolution.</p>
        </Section>

        <Section title="9. Disputes">
          <p>If you are dissatisfied with our refund decision, you may raise a formal dispute by emailing <a href={`mailto:${EMAIL}`} style={{ color: "var(--accent)" }}>{EMAIL}</a> with "Dispute" in the subject line. We will review all disputes within 10 business days.</p>
          <p>For unresolved disputes, the matter shall be subject to the jurisdiction of courts in Chennai, Tamil Nadu, India.</p>
        </Section>

        <Section title="10. Contact">
          <p>For all refund and cancellation queries:</p>
          <ul>
            <li>Email: <a href={`mailto:${EMAIL}`} style={{ color: "var(--accent)" }}>{EMAIL}</a></li>
            <li>Response time: within 5 business days</li>
            <li>Refund processing: 5–12 business days from approval</li>
          </ul>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--line)", display: "flex", gap: 24, fontSize: 13 }}>
          <Link href="/terms"   style={{ color: "var(--accent)", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/privacy" style={{ color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</Link>
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
