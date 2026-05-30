import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminPaymentsClient from "./AdminPaymentsClient";

const FALLBACK_ADMIN = "himanshumani72@gmail.com";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const adminEmail = (process.env.ADMIN_EMAIL ?? FALLBACK_ADMIN).toLowerCase();
  if ((user.email ?? "").toLowerCase() !== adminEmail) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
        <div className="text-center text-slate-400">
          <h1 className="text-2xl font-bold text-white mb-2">403 — Admin Only</h1>
          <p>This page is restricted to the admin email.</p>
        </div>
      </div>
    );
  }

  // Fetch all payments grouped by status
  const svc = createServiceClient();
  const { data: payments = [] } = await svc.from("upi_payments")
    .select("*")
    .order("submitted_at", { ascending: false })
    .limit(200);

  return <AdminPaymentsClient initial={payments ?? []} adminEmail={user.email!} />;
}
