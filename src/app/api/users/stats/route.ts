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

    // Build a query that matches either a string ID or an ObjectId
    let userQuery;
    try {
      userQuery = {
        $or: [
          { userId: userId },
          { userId: new mongoose.Types.ObjectId(userId) }
        ],
        status: 'confirmed'
      };
    } catch (e) {
      userQuery = { userId: userId, status: 'confirmed' };
    }

    const bookings = await Booking.find(userQuery);

    let monthlyInvestment = 0;
    let hoursCompleted = 0;
    const confirmedSlotsCount = bookings.length;

    bookings.forEach((booking) => {
      monthlyInvestment += booking.totalPrice || 0;

      if (booking.startTime && booking.endTime) {
        const [startHour, startMin] = booking.startTime.split(':').map(Number);
        const [endHour, endMin] = booking.endTime.split(':').map(Number);
        
        const durationInHours = (endHour + endMin / 60) - (startHour + startMin / 60);
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