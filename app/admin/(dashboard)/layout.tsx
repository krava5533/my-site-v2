import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-warmwhite">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
