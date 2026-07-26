import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    let userQuery;
    try {
      userQuery = {
        $or: [
          { userId: userId },
          { userId: new mongoose.Types.ObjectId(userId) }
        ]
      };
    } catch (e) {
      userQuery = { userId: userId };
    }

    const bookings = await Booking.find(userQuery).lean();

    let monthlyInvestment = 0;
    let hoursCompleted = 0;
    const confirmedSlotsCount = bookings.length;

    bookings.forEach((booking: any) => {
      monthlyInvestment += booking.price || booking.totalPrice || 0;

      const slot = booking.timeSlot;
      if (slot && slot.includes('-')) {
        const [start, end] = slot.split('-').map((s: string) => s.trim());
        const [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);
        
        const durationInHours = (endHour + (startMin || 0) / 60) - (startHour + (endMin || 0) / 60);
        if (durationInHours > 0) {
          hoursCompleted += durationInHours;
        }
      }
    });

    return NextResponse.json({
      monthlyInvestment,
      hoursCompleted: Math.round(hoursCompleted * 10) / 10,
      confirmedSlotsCount,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}