import { NextResponse } from 'next/server';
import { createOrder, initDatabase } from '@/lib/database';

// Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        // Initialize database if needed
        await initDatabase();

        const orderData = await request.json();

        console.log(`[ORDERS API] POST request received:`, {
            customer_name: orderData.customer_name,
            order_items: orderData.order_items,
            payment_intent_id: orderData.payment_intent_id
        });

        // Validate required fields
        const {
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            customer_city,
            customer_postal_code,
            total_amount,
            order_items
        } = orderData;

        if (!customer_name || !customer_email || !customer_phone || !customer_address ||
            !customer_city || !customer_postal_code || !total_amount || !order_items) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create order in database (stock will be checked and reduced during order creation)
        const orderId = await createOrder(orderData);

        console.log(`[ORDERS API] Order created successfully with ID: ${orderId}`);

        return NextResponse.json({
            success: true,
            orderId: orderId,
            message: 'Order created successfully'
        });

    } catch (error) {
        console.error('[ORDERS API] Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
} 