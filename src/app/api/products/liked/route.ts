// src/app/api/products/liked/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product'; // Your Mongoose Product model
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/db'; // Your database connection utility

export const dynamic = 'force-dynamic';

// Define a type for your JWT payload for type safety
interface DecodedToken extends JwtPayload {
  userId: string;
}

/**
 * Verifies the JWT from the request headers and returns the user ID.
 * @param request - The incoming NextRequest.
 * @returns The user ID string or null if authentication fails.
 */
async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1]; // Expecting "Bearer TOKEN"

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    return decoded.userId;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

/**
 * GET handler for fetching products liked by the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect(); // Ensure database is connected

    const userId = await getUserIdFromToken(request);
    
    // If no userId is found, the token is invalid or missing
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated or invalid token.' }, { status: 401 });
    }

    // Find all products where the 'likes' array contains the authenticated user's ID.
    // Also populate the 'farmer' field to get the farmer's name for display on the frontend.
    const likedProducts = await Product.find({ likes: userId })
      .populate('farmer', 'name')
      .sort({ createdAt: -1 }); // Sort by newest first, optional

    return NextResponse.json({ products: likedProducts }, { status: 200 });

  } catch (error) {
    console.error('API Error (GET /api/products/liked):', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}