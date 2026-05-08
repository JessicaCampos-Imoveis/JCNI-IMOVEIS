"use client";

import { usePathname } from "next/navigation";
import AdminTopbar from "./AdminTopbar";

type Props = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: Props) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <>
      {!isLogin && <AdminTopbar />}
      {children}
    </>
  );
}
