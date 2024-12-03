import connectDB from "@/app/database/dbconnect";
import Portfolio from "@/database_models/portfolio";

export async function POST(req) {
  try {
    await connectDB(); // Ensure the database is connected
    const { userId, stocks } = await req.json();

    // Validate input data
    if (!userId || !stocks || !Array.isArray(stocks)) {
      return new Response(
        JSON.stringify({ message: "Invalid input data structure. `userId` and `stocks` are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate stock entries
    const transformedStocks = stocks.map((stock) => {
      if (!stock.ticker?.trim()) {
        throw new Error(`Invalid stock ticker: ${JSON.stringify(stock)}`);
      }

      const amount = parseFloat(stock.amount); // Convert amount to a number
      if (isNaN(amount) || amount <= 0) {
        throw new Error(`Invalid stock amount for ticker "${stock.ticker}": ${stock.amount}`);
      }

      // Return transformed stock object
      return {
        ticker: stock.ticker.trim(),
        amount,
      };
    });

    // Upsert the portfolio
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId }, // Find by userId
      { $set: { stocks: transformedStocks, lastUpdated: Date.now() } }, // Update fields
      { new: true, upsert: true } // Create if not found, return updated document
    );

    return new Response(
      JSON.stringify({ message: "Portfolio saved successfully.", portfolio }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saving portfolio:", error.message || error);
    return new Response(
      JSON.stringify({ message: error.message || "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url); // Extract query params
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "User ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return new Response(
        JSON.stringify({ message: "Portfolio not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(portfolio),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}