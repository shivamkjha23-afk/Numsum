import { NextResponse, type NextRequest } from "next/server";
import { can, defaultRole, isRole } from "@/lib/rbac";
import type { Role } from "@/lib/types";

type ProtectedRoute = {
  path: string;
  permission: string;
};

const protectedRoutes: ProtectedRoute[] = [
  { path: "/submit-challenge", permission: "submit:challenge" },
  { path: "/teams/create", permission: "create:team" },
  { path: "/competitions/manufacturing-sprint/join", permission: "join:competition" },
  { path: "/community/new", permission: "create:discussion" },
  { path: "/community/comment", permission: "comment" },
  { path: "/research/upload", permission: "upload:research" },
  { path: "/organizations/dashboard", permission: "manage:organization" },
  { path: "/admin", permission: "admin:access" },
];

function getRole(request: NextRequest): Role {
  const role = request.cookies.get("numsum_role")?.value;
  return isRole(role) ? role : defaultRole;
}

export function middleware(request: NextRequest) {
  const protectedRoute = protectedRoutes.find((route) => request.nextUrl.pathname === route.path || request.nextUrl.pathname.startsWith(`${route.path}/`));

  if (!protectedRoute) {
    return NextResponse.next();
  }

  const role = getRole(request);

  if (can(role, protectedRoute.permission)) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/auth-required";
  redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/submit-challenge/:path*", "/teams/create/:path*", "/competitions/manufacturing-sprint/join/:path*", "/community/new/:path*", "/community/comment/:path*", "/research/upload/:path*", "/organizations/dashboard/:path*", "/admin/:path*"],
};
