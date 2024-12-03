import { sendEmail } from '@/lib/email';
import crypto from 'crypto';
import User from '@/database_models/user'; // Ensure this points to the correct user model
import bcrypt from "bcrypt";
import dbConnect from "@/app/database/dbconnect";

export async function POST(req) {
  try {
    await dbConnect(); // Ensure database is connected
    const { email } = await req.json();

    // Check if email is provided
    if (!email) {
      return new Response(
        JSON.stringify({ message: "Email is required" }),
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Email not found" }),
        { status: 404 }
      );
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Update user with token and expiry
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      resetUrl: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`,
      name: user.name,
    });

    return new Response(
      JSON.stringify({ message: "Password reset email sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Password Reset Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnect(); // Ensure database is connected
    const { token, password } = await req.json();

    if (!token || !password) {
      return new Response(
        JSON.stringify({ message: "Token and password are required." }),
        { status: 400 }
      );
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Ensure the token is not expired
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired reset token." }),
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return new Response(
      JSON.stringify({ message: "Password reset successful." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Password Reset Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      { status: 500 }
    );
  }
}