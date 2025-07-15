import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        // Hardcoded admin credentials for Vercel
        if (username !== 'Youribrouwers' || password !== 'Youri.2003') {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: 1, username: 'Youribrouwers' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Create response with token
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: { id: 1, username: 'Youribrouwers' }
        });

        // Set token as HTTP-only cookie
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 