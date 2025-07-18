import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

export default function withAuth(
    middleware: NextMiddleware,
    requireAuth: string[] = []
) {
    return async (req: NextRequest, next: NextFetchEvent) => {
        const pathname = req.nextUrl.pathname;

        const isProtected = requireAuth.some((path) => pathname.startsWith(path))

        if(isProtected) {
            const token = await getToken({
                req, secret: process.env.NEXTAUTH_SECRET,
                cookieName: "pkl-alif.session-token"
            });

            if(!token) {
                const url = new URL("/login", req.url);
                url.searchParams.set("callbackUrl", encodeURI(req.url));
                return NextResponse.redirect(url);
            }
        }
        
        return middleware(req, next);
    }
}