import connectDB from "@/app/database/dbconnect";
import User from "@/database_models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined. Please add it to your .env file.");
}

export async function POST(req) {
  await connectDB(); // Ensure database is connected

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  const body = await req.json(); // Read request body
  const { email, password } = body;

  if (!email || !password) {
    return new Response(
      JSON.stringify({ success: false, message: "Email and password are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (action === "register") {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new Response(
          JSON.stringify({ success: false, message: "User already exists" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      return new Response(
        JSON.stringify({ success: true, message: "User created successfully" }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error instanceof Error ? error.message : "Internal Server Error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else if (action === "login") {
    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return new Response(
          JSON.stringify({ success: false, message: "User not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid credentials" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return new Response(
        JSON.stringify({ success: true, token }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error instanceof Error ? error.message : "Internal Server Error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid action" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}