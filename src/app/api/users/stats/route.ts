import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Fetch all confirmed bookings for this user from MongoDB
    const bookings = await Booking.find({ userId, status: 'confirmed' });

    let monthlyInvestment = 0;
    let hoursCompleted = 0;
    const confirmedSlotsCount = bookings.length;

    bookings.forEach((booking) => {
      // Add up total price
      monthlyInvestment += booking.totalPrice || 0;

      // Calculate hours from start time and end time (assuming HH:mm format)
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
      hoursCompleted: Math.round(hoursCompleted * 10) / 10, // round to 1 decimal place
      confirmedSlotsCount,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}