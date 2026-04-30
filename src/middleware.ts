import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page through
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("jcni_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const resp = NextResponse.redirect(new URL("/admin/login", req.url));
    resp.cookies.set("jcni_session", "", { maxAge: 0, path: "/" });
    return resp;
  }
}
