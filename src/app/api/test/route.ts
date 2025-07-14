import { NextResponse } from 'next/server';

// Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('[TEST API] GET request received');

        return NextResponse.json({
            success: true,
            message: 'API is working',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[TEST API] Error:', error);
        return NextResponse.json({
            error: 'Test API failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 