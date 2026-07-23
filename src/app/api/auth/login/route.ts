import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/validators/auth/auth";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    //  Zod Validation
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    //  Connect to Database
    await connectDB();

    //  check if user already in db
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    //  Compare Password
    let isMatch = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
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

    // Generate JWT Token (AFTER user and password are valid)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return NextResponse.json(
        { message: "Server authentication error" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name:user.name,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "1d" }
    );

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
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}