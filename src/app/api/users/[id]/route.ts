import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { verifyJwtToken } from "@/lib/jwt";
import User from "@/models/User";
import Booking from "@/models/Booking";

function getAdmin(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  const payload = token ? verifyJwtToken(token) : null;
  return payload?.role === "admin" ? payload : null;
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    if (!getAdmin(request)) {
      return NextResponse.json({ message: "Admin access required." }, { status: 403 });
    }
    const { id } = await context.params;
    await connectDB();
    const user = await User.findById(id).select("-password").lean();
    if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });
    const reservationsCount = await Booking.countDocuments({ userId: user._id });
    return NextResponse.json({
      success: true,
      data: { ...user, id: user._id.toString(), reservationsCount },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to load user." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    if (!getAdmin(request)) {
      return NextResponse.json({ message: "Admin access required." }, { status: 403 });
    }
    const { id } = await context.params;
    const body = await request.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();

    if (name.length < 2) {
      return NextResponse.json({ message: "Name must be at least 2 characters." }, { status: 400 });
    }
    if (!/^[+0-9\s-]{8,}$/.test(phone)) {
      return NextResponse.json({ message: "Enter a valid phone number." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(id, { $set: { name, phone } }, { new: true, runValidators: true })
      .select("-password")
      .lean();
    if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });

    const reservationsCount = await Booking.countDocuments({ userId: user._id });
    return NextResponse.json({ success: true, data: { ...user, id: user._id.toString(), reservationsCount } });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: "Admin access required." }, { status: 403 });
    }
    const { id } = await context.params;
    if (admin.userId === id) {
      return NextResponse.json({ message: "You cannot delete your own account." }, { status: 400 });
    }

    await connectDB();
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "User not found." }, { status: 404 });
    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to delete user." }, { status: 500 });
  }
}
