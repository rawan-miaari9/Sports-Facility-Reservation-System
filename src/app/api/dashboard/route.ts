import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import '@/models/Court'; 

export async function GET() {
  try {
    await dbConnect();

    // Fetch all bookings and populate related court info
    const bookings = await Booking.find({}).populate('courtId').lean();

    // Calculate dynamic dashboard stats
    const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed');
    const confirmedSlots = confirmedBookings.length;
    
    const monthlyInvestment = confirmedBookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
    const hoursCompleted = confirmedSlots * 2;

    const dashboardData = {
      monthlyInvestment,
      hoursCompleted,
      confirmedSlots,
      upcomingBookings: bookings,
    };

    return NextResponse.json({ success: true, data: dashboardData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}