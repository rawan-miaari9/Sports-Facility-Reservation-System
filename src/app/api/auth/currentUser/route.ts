import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    await dbConnect();

    // Await the cookies function for Next.js 15+
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token') || cookieStore.get('auth_token');

    if (!tokenCookie) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    // Verify and decode the JWT token
    const decoded: any = jwt.verify(tokenCookie.value, JWT_SECRET);

    // Fetch the live user record from MongoDB to get phone, dateOfBirth, etc.
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        role: user.role || 'user'
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
  }
}