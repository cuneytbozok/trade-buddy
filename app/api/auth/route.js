import connectDB from "@/app/database/dbconnect";
import User from "@/database_models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined. Please add it to your .env file.");
}

// Utility for sending JSON responses
const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// Helper to generate a JWT
const generateToken = (user) => {
  const payload = { id: user._id, email: user.email };
  const options = {
    expiresIn: "1h",
    audience: "tradebuddy.com",
    issuer: "tradebuddy-auth",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Handle Registration
const handleRegister = async (email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return jsonResponse({ success: false, message: "User already exists" }, 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  // Generate JWT
  const token = generateToken(newUser);

  return jsonResponse({
    success: true,
    message: "User created successfully",
    token,
  }, 201);
};

// Handle Login
const handleLogin = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return jsonResponse({ success: false, message: "User not found" }, 404);
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return jsonResponse({ success: false, message: "Invalid credentials" }, 401);
  }

  // Generate JWT
  const token = generateToken(user);

  return jsonResponse({ success: true, token });
};

// Main POST Handler
export async function POST(req) {
  await connectDB(); // Ensure database is connected

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return jsonResponse(
      { success: false, message: "Email and password are required" },
      400
    );
  }

  try {
    if (action === "register") {
      return await handleRegister(email, password);
    } else if (action === "login") {
      return await handleLogin(email, password);
    } else {
      return jsonResponse({ success: false, message: "Invalid action" }, 400);
    }
  } catch (error) {
    console.error("Auth Error:", error);
    return jsonResponse(
      { success: false, message: error.message || "Internal Server Error" },
      500
    );
  }
}