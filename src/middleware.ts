import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Track page visits for analytics (skip API routes and static files)
    if (!request.nextUrl.pathname.startsWith('/api/') &&
        !request.nextUrl.pathname.startsWith('/_next/') &&
        !request.nextUrl.pathname.includes('.')) {

        // Log the visit in the background
        const visitorIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const pagePath = request.nextUrl.pathname;

        // Make a request to log the visit
        fetch(new URL('/api/analytics/track', request.url), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                visitorIp,
                userAgent,
                pagePath
            }),
        }).catch(console.error);
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
} 