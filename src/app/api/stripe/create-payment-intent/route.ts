import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
    try {
        const { amount, currency = 'eur' } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Create payment intent with explicit payment methods including iDEAL
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe uses cents
            currency,
            payment_method_types: [
                'card',
                'ideal', // iDEAL for Dutch customers
                'bancontact', // Belgian payment method
                'sofort', // European bank transfer
            ],
            metadata: {
                integration_check: 'accept_a_payment',
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json(
            { error: 'Failed to create payment intent' },
            { status: 500 }
        );
    }
} 