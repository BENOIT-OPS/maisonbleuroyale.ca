import { auth } from "@/auth";
import { AdminDashboard } from "@/components/admin-dashboard";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  return <AdminDashboard userEmail={session.user.email} />;
}
