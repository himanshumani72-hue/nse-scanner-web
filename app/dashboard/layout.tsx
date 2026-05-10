import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check subscription
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // No sub record yet → create trial
  if (!sub) {
    await supabase.from("subscriptions").insert({
      user_id:   user.id,
      status:    "trial",
      trial_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  // If expired/cancelled/halted → redirect to billing
  if (sub && sub.status === "expired") redirect("/billing");
  if (sub && sub.status === "cancelled") redirect("/billing");
  if (sub && sub.status === "trial") {
    const trialEnd = new Date(sub.trial_end);
    if (trialEnd < new Date()) redirect("/billing");
  }

  return <>{children}</>;
}
