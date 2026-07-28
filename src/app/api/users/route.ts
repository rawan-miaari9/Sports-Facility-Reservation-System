import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const user = await User.create(body);

    return Response.json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    await connectDB();

    const users = await User.find(
      { role: "user" },
      {
        name: 1,
        email: 1,
      }
    );

    return Response.json(users);
  } catch (error) {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}