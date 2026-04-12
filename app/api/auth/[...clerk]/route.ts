/**
 * Clerk v7 catch-all route handler.
 * With clerkMiddleware in middleware.ts, Clerk handles auth automatically.
 * This route exists only as a placeholder for any Clerk webhook endpoints.
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Clerk auth endpoint active' });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Clerk auth endpoint active' });
}
