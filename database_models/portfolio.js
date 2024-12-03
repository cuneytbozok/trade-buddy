const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  amount: { type: Number, required: true },
});

const portfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stocks: [stockSchema], // Array of stock objects
    lastUpdated: { type: Date, default: Date.now }, // Timestamp for updates
  },
  { timestamps: true } // Includes createdAt and updatedAt fields automatically
);

// Check if the model already exists to prevent OverwriteModelError
module.exports = mongoose.models.Portfolio || mongoose.model("Portfolio", portfolioSchema);