import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/database';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productId = parseInt(id);

        if (isNaN(productId)) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
        }

        const product = await getProductById(productId);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Parse the features JSON string
        const parsedProduct = {
            ...product,
            features: JSON.parse(product.features || '[]')
        };

        return NextResponse.json(parsedProduct);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
} 