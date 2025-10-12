import mongoose from "mongoose";

// ===== Category Subschema =====
const categorySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },       // unique identifier (e.g. "needs", "wants", "savings", "rent")
  name: {
    type: String,
    required: true
  },      // human-readable name
  pct: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },    // calculated amount
  type: {                                      // distinguishes default vs user-created
    type: String,
    enum: ["default", "custom"],
    default: "default"
  }
});

// ===== Budget Schema =====
const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    income: {
      type: Number,
      required: true,
      default: 0
    },

    // ✅ Used only when rule = "custom"
    customSplits: {
      type: Map,
      of: Number, // allows dynamic keys like { Rent: 20, Food: 15 }
      default: {}
    },

    totals: {
      needs: { type: Number, default: 0 },
      wants: { type: Number, default: 0 },
      savings: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },

    // ✅ Dynamic + Default categories
    categories: {
      type: [categorySchema],
      default: [
        { key: "needs", name: "Needs", pct: 50, amount: 0, type: "default" },
        { key: "wants", name: "Wants", pct: 30, amount: 0, type: "default" },
        { key: "savings", name: "Savings", pct: 20, amount: 0, type: "default" }
      ]
    },

    title: {
      type: String,
      default: "My Budget"
    },

    period: {
      month: { type: Number, min: 1, max: 12 },
      year: { type: Number }
    }
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
