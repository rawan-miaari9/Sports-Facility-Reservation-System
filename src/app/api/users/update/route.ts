import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(request: Request) {
  try {
    await dbConnect();

    // Await cookies function for Next.js 15+
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token') || cookieStore.get('auth_token');

    if (!tokenCookie) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    // Verify and decode the JWT token to get the user ID
    const decoded: any = jwt.verify(tokenCookie.value, JWT_SECRET);
    const userId = decoded.userId;

    const body = await request.json();
    const { name, email, phone, dateOfBirth } = body;

    // Find and update user in MongoDB based on your User schema
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name, 
        email, 
        phone, 
        dateOfBirth 
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        userId: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        dateOfBirth: updatedUser.dateOfBirth || '',
        role: updatedUser.role || 'user'
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}