import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { priceForUser } from "@/lib/pricing";
import BillingForm from "./BillingForm";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  // ── Auth ──────────────────────────────────────────
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // ── Count this user's verified payments so far ────
  // service-role bypasses RLS so we see ALL their rows reliably
  const svc = createServiceClient();
  const { count } = await svc.from("upi_payments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "verified");

  const paidCount = count ?? 0;
  const pricing   = priceForUser(paidCount);

  return (
    <BillingForm
      amount={pricing.amount}
      isPromo={pricing.isPromo}
      promoLeft={pricing.promoLeft}
      originalPrice={pricing.originalPrice}
    />
  );
}
