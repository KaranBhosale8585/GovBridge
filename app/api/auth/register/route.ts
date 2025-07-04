import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, email, password ,role} = await req.json();
  if (!username || !email || !password || !role)
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  console.log(username, email, password , role);
  await connectDB();

  const existing = await User.findOne({ email });
  if (existing)
    return NextResponse.json(
      { error: `User already exists` },
      { status: 400 }
    );

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed,role });
  return NextResponse.json({ message: "User registered successfully", user });
}
