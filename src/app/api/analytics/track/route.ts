import { NextResponse } from 'next/server';
import { logSiteVisit } from '@/lib/database';

// Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { visitorIp, userAgent, pagePath } = await request.json();

        // Log the visit to the database
        await logSiteVisit(visitorIp, userAgent, pagePath);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking visit:', error);
        return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 });
    }
} 