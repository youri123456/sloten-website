import { NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

function verifyToken(request: Request) {
    const token = request.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];

    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
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

        const orders = await getAllOrders();

        // Parse order items JSON for each order
        const parsedOrders = orders.map(order => ({
            ...order,
            order_items: JSON.parse(order.order_items || '[]')
        }));

        return NextResponse.json(parsedOrders);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
} 