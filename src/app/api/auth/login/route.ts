import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/validators/auth/auth";
import { signJwtToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Zod Validation
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Connect to Database
    await connectDB();

    // MUST use .select("+password") because UserSchema sets select: false
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare Password safely
    let isMatch = false;
    if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const token = signJwtToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return user data AND token
    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Something went wrong during login" },
      { status: 500 }
    );
  }
}
