import { NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/database';
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

        const orders = await getAllOrders();

        // Parse order items JSON for each order with error handling
        const parsedOrders = orders.map(order => {
            try {
                const orderItems = JSON.parse(order.order_items || '[]');
                return {
                    ...order,
                    order_items: Array.isArray(orderItems) ? orderItems : []
                };
            } catch (error) {
                console.error('Error parsing order items for order', order.id, ':', error);
                return {
                    ...order,
                    order_items: []
                };
            }
        });

        return NextResponse.json(parsedOrders);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
} 