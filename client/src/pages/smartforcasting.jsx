import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Lightbulb, AlertTriangle, TrendingUp } from "lucide-react";

const SmartForecasting = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p>No user data available. Please complete your Account Setup first.</p>
      </div>
    );
  }

  const income = user.income || 0;
  const categoryData = user.categoryData || [];

  const totalSpend = categoryData.reduce((sum, c) => sum + (c.amount || 0), 0);
  const predictedSpend = totalSpend * 1.05; // 5% increase
  const predictedSavings = income - predictedSpend;
  const riskCategory =
    categoryData.sort((a, b) => b.amount - a.amount)[0]?.category ||
    "Entertainment";

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-10 py-20">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/analytics")}
          className="text-gray-400 hover:text-white"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-semibold">Smart Forecasting</h2>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1e293b] p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-400" />
            <p className="text-gray-400">Next Month Predicted Spend</p>
          </div>
          <h3 className="text-xl font-bold text-green-400">
            ₹{predictedSpend.toFixed(0)}
          </h3>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-red-400" />
            <p className="text-gray-400">Risk Category Alert</p>
          </div>
          <h3 className="text-xl font-bold text-red-400">{riskCategory}</h3>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="text-blue-400" />
            <p className="text-gray-400">Predicted Savings</p>
          </div>
          <h3 className="text-xl font-bold text-blue-400">
            ₹{predictedSavings.toFixed(0)}
          </h3>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">Suggestions for you</h3>
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            text: `Reduce spending in ${riskCategory} by ₹1000 to stay within your budget.`,
          },
          {
            text: `Lower shopping spends to boost savings by ₹2000 this month.`,
          },
          {
            text: `Add ₹500 from ${riskCategory} category to your savings.`,
          },
        ].map((item, i) => (
          <div key={i} className="bg-[#1e293b] p-6 rounded-2xl">
            <p className="text-gray-300 mb-3">{item.text}</p>
            <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
              Apply Suggestion
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartForecasting;