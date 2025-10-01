import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  key: { type: String, required: true },    
  name: { type: String, required: true },   
  pct: { type: Number, required: true },     
  amount: { type: Number, required: true }   
});

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
    rule: {
      type: String,
      enum: ["50-30-20", "custom"],
      default: "50-30-20"
    },
    customSplits: {
      needs: { type: Number, default: 0 },
      wants: { type: Number, default: 0 },
      savings: { type: Number, default: 0 }
    },
    totals: {
      needs: { type: Number, default: 0 },
      wants: { type: Number, default: 0 },
      savings: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    categories: [categorySchema],

    // ✅ For multiple budgets per user
    title: { type: String, default: "My Budget" },  // e.g. "September 2025 Budget"
    period: {
      month: { type: Number }, // 1–12
      year: { type: Number }
    }
  },
  { timestamps: true }
)

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
