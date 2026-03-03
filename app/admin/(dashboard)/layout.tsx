import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/server/auth/session";

export default async function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="container">
      <header className="toolbar">
        <strong>Admin</strong>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link href="/admin/tutorials">Content</Link>
          <Link href="/admin/analytics">Analytics</Link>
          <form action="/api/admin/auth/logout" method="post">
            <button type="submit">Logout</button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
