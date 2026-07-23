import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { FacilityModel } from '@/models/Facility';

// GET /api/facilities - Fetch all facilities
export async function GET() {
  try {
    await connectDB();
    const facilities = await FacilityModel.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: facilities.length, data: facilities }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/facilities - Create a new facility
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newFacility = await FacilityModel.create(body);

    return NextResponse.json({ success: true, data: newFacility }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}