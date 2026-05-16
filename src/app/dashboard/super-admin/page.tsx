import { redirect } from "next/navigation";

export default function SuperAdminDashboardRedirect() {
  redirect("/dashboard/home");
}