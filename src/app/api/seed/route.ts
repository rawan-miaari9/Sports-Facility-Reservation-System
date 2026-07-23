import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Court from '@/models/Court';
import Booking from '@/models/Booking';

export async function GET() {
  try {
    await dbConnect();

    // Clear old test data
    await Court.deleteMany({});
    await Booking.deleteMany({});

    // 1. Create a sample court
    const sampleCourt = await Court.create({
      name: 'Championship Court',
      sportType: 'Basketball',
      description: 'Main wing elite indoor basketball court.',
      pricePerHour: 50,
      capacity: 10,
      images: [],
      isActive: true,
    });

    // 2. Create a sample booking linked to that court
    const sampleBooking = await Booking.create({
      userId: 'test_user_123', // Dummy ID for now until your teammate's user model is ready
      courtId: sampleCourt._id,
      bookingDate: '2026-07-25',
      startTime: '16:00',
      endTime: '18:00',
      totalPrice: 100, // 2 hours * $50
      status: 'confirmed',
    });

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with a court and booking!',
      data: { sampleCourt, sampleBooking },
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}