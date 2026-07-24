import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const query = userId
      ? {
          bookingType: "registered",
          userId,
        }
      : {};

    const bookings = await Booking.find(query)
      .sort({ date: 1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: bookings,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const booking = await Booking.create({
      facilityId: body.facilityId,

      bookingType: body.bookingType || "registered",

      userId: body.userId,

      guestName: body.guestName,
      guestPhone: body.guestPhone,
      guestEmail: body.guestEmail,

      date: body.date,
      timeSlot: body.timeSlot,

      price: body.price,

      paymentMethod: body.paymentMethod,

      equipment: body.equipment || [],

      status: "Pending",
    });

    return NextResponse.json(
      {
        success: true,
        data: booking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}