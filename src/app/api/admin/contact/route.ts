import { NextResponse } from 'next/server';
import { getAllContactMessages, updateContactMessageStatus } from '@/lib/database';
import jwt from 'jsonwebtoken';

// Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

function verifyToken(request: Request) {
    const token = request.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];

    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export async function GET(request: Request) {
    try {
        // Verify admin token
        const decoded = verifyToken(request);

        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const messages = await getAllContactMessages();

        return NextResponse.json(messages);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch contact messages' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        // Verify admin token
        const decoded = verifyToken(request);

        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { messageId, status } = await request.json();

        if (!messageId || !status) {
            return NextResponse.json({ error: 'Message ID and status are required' }, { status: 400 });
        }

        // Valid statuses
        const validStatuses = ['new', 'read', 'replied', 'archived'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        await updateContactMessageStatus(messageId, status);

        return NextResponse.json({ success: true, message: 'Message status updated' });
    } catch {
        return NextResponse.json({ error: 'Failed to update message status' }, { status: 500 });
    }
} 