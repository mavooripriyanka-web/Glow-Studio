import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the request is for an admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('admin_token')?.value;

        // If no token exists, redirect to signin
        if (!token) {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    // Check if the request is for a user dashboard route
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        const token = request.cookies.get('user_token')?.value;

        // If no token exists, redirect to signin
        if (!token) {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*'],
};
