import { redirect } from "next/navigation";

export default function ModeratorDashboardRedirect() {
  redirect("/dashboard/home");
}