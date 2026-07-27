import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/validators/auth/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate payload against schema FIRST
    const validation = registerSchema.safeParse(body);
    
    // If validation fails, return 400 immediately
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // ONLY destructure validation.data AFTER checking validation.success
    const { name, email, phone, dateOfBirth, password } = validation.data;
    const role = body.role || "user";

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Save new user
    const newUser = await User.create({
      name,
      email,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      password: hashedPassword,
      role,
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}