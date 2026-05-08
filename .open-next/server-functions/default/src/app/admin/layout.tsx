import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import type { ReactNode } from "react";
import AdminShell from "./_components/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Login page is public — middleware handles the redirect,
  // but layout also verifies to avoid flash of protected content.
  const cookieStore = await cookies();
  const token = cookieStore.get("jcni_session")?.value;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);
    } catch {
      redirect("/admin/login");
    }
  }
  // If no token, middleware already redirected. Layout just wraps.

  return <AdminShell>{children}</AdminShell>;
}
