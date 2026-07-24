import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; 
import Booking from '@/models/Booking';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query = {};
    if (userId) {
      try {
        query = {
          $or: [
            { userId: userId },
            { userId: new mongoose.Types.ObjectId(userId) }
          ]
        };
      } catch (e) {
        query = { userId: userId };
      }
    }

    const bookings = await Booking.find(query).lean().sort({ bookingDate: 1 });

    // Fetch user details to map names properly if missing
    const userIds = [...new Set(bookings.map((b: any) => b.userId).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

    const formattedBookings = bookings.map((b: any) => {
      const matchedUser: any = userMap.get((b.userId || b.user)?.toString()) || {};
      return {
        id: b._id.toString(),
        userId: (b.userId || b.user || '').toString(),
        userName: b.userName || matchedUser.name || 'Rawan M',
        userEmail: b.userEmail || matchedUser.email || 'rawan@gmail.com',
        facilityName: b.facilityName || 'Arena Court',
        facilityImage: b.facilityImage || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5',
        sport: b.sport || 'Tennis / Badminton',
        date: b.bookingDate || b.date || '2026-07-25',
        timeSlot: b.timeSlot || (b.startTime && b.endTime ? `${b.startTime} - ${b.endTime}` : '16:00 - 18:00'),
        price: b.totalPrice || b.price || 100,
        status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Confirmed',
        equipment: b.equipment || []
      };
    });

    return NextResponse.json({ success: true, data: formattedBookings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}