import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
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

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Only JPG, PNG and WebP are allowed.'
            }, { status: 400 });
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'File too large. Maximum size is 5MB.'
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = path.extname(file.name);
        const filename = `product-${timestamp}${fileExtension}`;

        // Save to public/images directory
        const filePath = path.join(process.cwd(), 'public', 'images', filename);
        await writeFile(filePath, buffer);

        // Return the URL path for the image
        const imageUrl = `/images/${filename}`;

        return NextResponse.json({
            success: true,
            imageUrl,
            filename
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({
            error: 'Failed to upload file'
        }, { status: 500 });
    }
} 