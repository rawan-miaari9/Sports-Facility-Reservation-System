import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");

    let query: any = {};

    if (userId && role !== 'Admin') {
      const conditions: any[] = [
        { userId: userId },
        { user: userId },
        { athleteId: userId }
      ];

      if (mongoose.Types.ObjectId.isValid(userId)) {
        conditions.push(
          { userId: new mongoose.Types.ObjectId(userId) },
          { user: new mongoose.Types.ObjectId(userId) },
          { athleteId: new mongoose.Types.ObjectId(userId) }
        );
      }

      query = { $or: conditions };
    }

    const bookings = await Booking.find(query).lean().sort({ date: -1 });

    const userIds = [...new Set(bookings.map((b: any) => b.userId || b.user).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

    const formattedBookings = bookings.map((b: any) => {
      const matchedUser: any = userMap.get((b.userId || b.user)?.toString()) || {};
      return {
        id: b._id.toString(),
        facilityId: b.facilityId?.toString(),
        userId: (b.userId || b.user || '').toString(),
        userName: b.userName || matchedUser.name || 'Rawan',
        userEmail: b.userEmail || matchedUser.email || '',
        facilityName: b.facilityName || 'Arena Court',
        facilityImage: b.facilityImage || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5',
        sport: b.sport || 'Soccer / Tennis',
        date: b.date || b.bookingDate || '',
        timeSlot: b.timeSlot || (b.startTime && b.endTime ? `${b.startTime} - ${b.endTime}` : '16:00 - 18:00'),
        price: b.price || b.totalPrice || 0,
        status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Pending',
        equipment: b.equipment || []
      };
    });

    return NextResponse.json({ success: true, data: formattedBookings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const booking = await Booking.create({
      facilityId: body.facilityId,
      bookingType: body.bookingType || "registered",
      userId: body.userId || body.user,
      guestName: body.guestName,
      guestPhone: body.guestPhone,
      guestEmail: body.guestEmail,
      date: body.date,
      timeSlot: body.timeSlot,
      price: body.price,
      paymentMethod: body.paymentMethod,
      equipment: body.equipment || [],
      status: body.paymentMethod === "Card" ? "Confirmed" : "Pending",
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}