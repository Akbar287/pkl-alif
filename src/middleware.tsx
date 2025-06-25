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
  "/manajemen-data/file",
  "/magang/pengajuan",
  "/magang/persetujuan-kasubag",
  "/magang/persetujuan-subag",
  "/magang/riwayat",
  "/magang/penerbitan-sk",
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
    "/manajemen-data/file/:path*",
    "/magang/pengajuan/:path*",
    "/magang/persetujuan-kasubag/:path*",
    "/magang/persetujuan-subag/:path*",
    "/magang/riwayat/:path*",
    "/magang/penerbitan-sk/:path*",
  ],
};
