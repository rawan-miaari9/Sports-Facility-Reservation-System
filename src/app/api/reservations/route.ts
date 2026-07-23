import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; 
import Booking from '@/models/Booking';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '6a60df19c3d0da26c5506d8';

    // Query by userId matching your schema structure
    const query = userId ? { userId } : {};
    const bookings = await Booking.find(query).lean().sort({ bookingDate: 1 });

    // Format the bookings to map your schema properties (bookingDate, startTime, endTime, totalPrice) to the frontend
    const formattedBookings = bookings.map((b: any) => ({
      id: b._id.toString(),
      facilityName: b.facilityName || 'Arena Court',
      facilityImage: b.facilityImage || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5',
      sport: b.sport || 'Tennis / Badminton',
      date: b.bookingDate || '2026-07-21',
      timeSlot: b.startTime && b.endTime ? `${b.startTime} - ${b.endTime}` : '10:00 - 12:00',
      price: b.totalPrice || 50,
      status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Confirmed',
      equipment: b.equipment || [],
      userEmail: 'rawan@athletichub.com'
    }));

    return NextResponse.json({ success: true, data: formattedBookings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}