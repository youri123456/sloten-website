import { NextResponse } from 'next/server';
import { createContactMessage } from '@/lib/database';

// Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { name, email, subject, message } = await request.json();

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // Create contact message in database
        const messageId = await createContactMessage({
            name,
            email,
            subject,
            message
        });

        return NextResponse.json({
            success: true,
            messageId,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('Error creating contact message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
} 