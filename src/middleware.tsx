import { NextRequest, NextResponse } from "next/server";
import withAuth from "./middlewares/withAuth";

export function mainMiddleware(request: NextRequest) {
  return NextResponse.next();
}

const protectedPaths = [
  "/profil",
  "/manajemen-data",
  "/manajemen-data/pengguna",
  "/manajemen-data/status",
  "/manajemen-data/magang",
  "/manajemen-data/formasi",
];

export default withAuth(mainMiddleware, protectedPaths);

export const config = {
  matcher: [
    "/profil/:path*",
    "/manajemen-data/:path*",
    "/manajemen-data/pengguna/:path*",
    "/manajemen-data/status/:path*",
    "/manajemen-data/magang/:path*",
    "/manajemen-data/formasi/:path*",
  ],
};
