import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongodb";
import { verifyJwtToken } from "@/lib/jwt";
import User from "@/models/User";
import Booking from "@/models/Booking";

function requireAdmin(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;
  const payload = token ? verifyJwtToken(token) : null;
  return payload?.role === "admin" ? payload : null;
}

function formatUser(user: any, reservationsCount = 0) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    dateOfBirth: user.dateOfBirth || "",
    role: user.role || "user",
    createdAt: user.createdAt,
    reservationsCount,
  };
}

export async function GET(request: NextRequest) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ message: "Admin access required." }, { status: 403 });
    }

    await connectDB();
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();

    const reservationCounts = await Booking.aggregate([
      { $match: { userId: { $ne: null } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);
    const counts = new Map<string, number>(
      reservationCounts.map((item: { _id: { toString(): string }; count: number }) => [
        item._id.toString(),
        item.count,
      ])
    );

    return NextResponse.json({
      success: true,
      data: users.map((user: any) => formatUser(user, counts.get(user._id.toString()) || 0)),
    });
  } catch (error: any) {
    console.error("GET /api/users failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to load users." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ message: "Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const dateOfBirth = String(body.dateOfBirth || "").trim();
    const password = String(body.password || "");
    const role = body.role === "admin" ? "admin" : "user";

    if (name.length < 2) {
      return NextResponse.json({ message: "Name must be at least 2 characters." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }
    if (!/^[+0-9\s-]{8,}$/.test(phone)) {
      return NextResponse.json({ message: "Enter a valid phone number." }, { status: 400 });
    }
    if (!dateOfBirth) {
      return NextResponse.json({ message: "Date of birth is required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters." }, { status: 400 });
    }

    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "A user with this email already exists." }, { status: 409 });
    }

    const user = await User.create({
      name,
      email,
      phone,
      dateOfBirth,
      password: await bcrypt.hash(password, 10),
      role,
    });

    return NextResponse.json(
      { success: true, data: formatUser(user.toObject(), 0) },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/users failed:", error);
    return NextResponse.json(
      { message: error.code === 11000 ? "A user with this email already exists." : error.message || "Failed to create user." },
      { status: error.code === 11000 ? 409 : 500 }
    );
  }
}
