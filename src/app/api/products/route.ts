import { NextResponse } from 'next/server';
import { createProduct, updateProduct, deleteProduct, initDatabase } from '@/lib/database';
import { getAllProducts as getStaticProducts } from '@/data/products';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

// Check if user is authenticated admin
async function isAuthenticated(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token) return false;

        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return true;
    } catch {
        return false;
    }
}

export async function GET() {
    try {
        console.log('[PRODUCTS API] GET request received');

        // Initialize database if needed
        console.log('[PRODUCTS API] Initializing database...');
        try {
            await initDatabase();
            console.log('[PRODUCTS API] Database initialized');
        } catch (dbError) {
            console.error('[PRODUCTS API] Database initialization failed:', dbError);
            // Return fallback data instead of failing completely
            const fallbackProducts = [
                {
                    id: 1,
                    name: 'Smart Fietsslot Pro',
                    description: 'Revolutionair fietsslot dat je met je smartphone kunt openen.',
                    price: 89.99,
                    image: '/images/fietsslot.png',
                    category: 'fietsslot',
                    stock: 25,
                    features: ['Smartphone opening', 'Alarm functie', 'GPS tracking'],
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Smart Kabelslot Secure',
                    description: 'Flexibel kabelslot met smartphone bediening en alarm.',
                    price: 79.99,
                    image: '/images/kettingslot.png',
                    category: 'kabelslot',
                    stock: 30,
                    features: ['Smartphone opening', 'Alarm functie', 'Verstelbare kabel'],
                    created_at: new Date().toISOString()
                }
            ];
            console.log('[PRODUCTS API] Returning fallback products');
            return NextResponse.json(fallbackProducts);
        }

        console.log('[PRODUCTS API] Fetching static products...');
        const products = getStaticProducts();
        console.log('[PRODUCTS API] Raw products:', products.length, 'products');

        console.log('[PRODUCTS API] Returning', products.length, 'products');
        return NextResponse.json(products);
    } catch (error) {
        console.error('[PRODUCTS API] Error fetching products:', error);
        return NextResponse.json({
            error: 'Failed to fetch products',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, price, image, category, stock, features } = body;

        // Validate required fields
        if (!name || !description || !price || !category || stock === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const productId = await createProduct({
            name,
            description,
            price: parseFloat(price),
            image: image || '/images/default-product.jpg',
            category,
            stock: parseInt(stock),
            features: features || []
        });

        return NextResponse.json({ success: true, id: productId }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, description, price, image, category, stock, features } = body;

        console.log(`[PRODUCTS API] PUT request for product ${id} with stock: ${stock}`);

        // Validate required fields
        if (!id || !name || !description || !price || !category || stock === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await updateProduct(parseInt(id), {
            name,
            description,
            price: parseFloat(price),
            image: image || '/images/default-product.jpg',
            category,
            stock: parseInt(stock),
            features: features || []
        });

        console.log(`[PRODUCTS API] Successfully updated product ${id}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[PRODUCTS API] Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        await deleteProduct(parseInt(id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
} 