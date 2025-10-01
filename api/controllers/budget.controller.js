import Budget from "../models/budget.model.js"

// ✅ Save a new budget (or update if same month/year exists)
export const saveBudget = async (req, res) => {
  try {
    const { income, rule, customSplits, totals, categories, title, period } = req.body;

    if (!period || !period.month || !period.year) {
      return res.status(400).json({ success: false, message: "Month and year are required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, "period.month": period.month, "period.year": period.year },
      { income, rule, customSplits, totals, categories, title, period, user: req.user._id },
      { new: true, upsert: true } // upsert = insert if not exists
    );

    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get logged-in user's budget for a given month/year
export const getMyBudget = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ success: false, message: "Month and year are required" });
    }

    const budget = await Budget.findOne({
      user: req.user._id,
      "period.month": Number(month),
      "period.year": Number(year)
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all budgets for logged-in user
export const getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({
      "period.year": -1,
      "period.month": -1
    });

    res.json({ success: true, budgets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
