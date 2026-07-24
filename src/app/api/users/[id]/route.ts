import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";

// GET: Fetch single user profile
export async function GET(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    if (!userId) {
      return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Standardize _id to id string for React components
    const formattedUser = {
      ...user,
      id: user._id.toString(),
    };

    return NextResponse.json(formattedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error fetching user details." },
      { status: 500 }
    );
  }
}

// PUT: Update user profile details
export async function PUT(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    const body = await request.json();
    const { name, email, phone, phoneNumber, dateOfBirth, dob } = body;

    await connectDB();

    // 1. Prevent email duplicate conflicts with other users
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: "This email address is already in use by another account." },
          { status: 400 }
        );
      }
    }

    // 2. Normalize input values
    const phoneVal = phone !== undefined ? phone : phoneNumber;
    const rawDob = dateOfBirth !== undefined ? dateOfBirth : dob;

    const updateData: Record<string, any> = {};

    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (phoneVal !== undefined) updateData.phone = phoneVal;
    if (rawDob !== undefined) updateData.dateOfBirth = rawDob;

    // 3. Perform database update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select("-password")
      .lean();

    if (!updatedUser) {
      return NextResponse.json({ message: "User account not found." }, { status: 404 });
    }

    const formattedUser = {
      ...updatedUser,
      id: updatedUser._id.toString(),
    };

    return NextResponse.json(formattedUser, { status: 200 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Email is already registered to another account." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Failed to update user profile." },
      { status: 500 }
    );
  }
}