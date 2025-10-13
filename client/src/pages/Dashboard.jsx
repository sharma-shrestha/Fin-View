// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/**
 * Dashboard fetches the logged-in user's budget via:
 * GET ${VITE_API_URL}/budget/me?month=<month>&year=<year>
 *
 * Backend returns: { success: true, budget }
 * Where budget is the document saved in DB.
 */

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchBudget = async () => {
      setLoading(true);
      setErr(null);
      try {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/budget/me?month=${month}&year=${year}`,
          {
            credentials: "include", // important to send auth cookie/session
          }
        );

        // If backend uses next(handleError(...)) it may respond non-200
        const data = await res.json();

        if (!res.ok) {
          // Backend returned an error: show message (if any)
          setBudget(null);
          setErr(data?.message || data?.msg || "No budget found");
        } else if (data && data.success && data.budget) {
          setBudget(data.budget);
        } else if (data && data.budget) {
          // fallback if backend returns budget directly
          setBudget(data.budget);
        } else {
          setBudget(null);
        }
      } catch (error) {
        console.error("Error fetching budget:", error);
        setErr("Failed to fetch budget");
        setBudget(null);
      } finally {
        setLoading(false);
      }
    };

    // Only attempt fetch if user exists (logged-in)
    if (user && user._id) {
      fetchBudget();
    } else {
      // if no user in redux, we still attempt fetch to rely on session cookie (if any)
      fetchBudget();
    }
  }, [user]);

  if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;

  if (err)
    return (
      <div className="text-center p-10 text-red-400">
        {err}. <br />
        Please set up your account or login. <br />
        <Button className="mt-4" onClick={() => (window.location.href = "/AccountSetup")}>
          Go to Account Setup
        </Button>
      </div>
    );

  if (!budget)
    return (
      <div className="text-center p-10 text-red-400">
        No budget data found. Please set up your account.
        <div className="mt-4">
          <Button onClick={() => (window.location.href = "/AccountSetup")}>Go to Account Setup</Button>
        </div>
      </div>
    );

  const COLORS = ["#4CAF50", "#FFC107", "#03A9F4", "#E91E63", "#9C27B0", "#FF5722", "#00BCD4", "#8BC34A"];

  // Ensure categories exist and amounts are numbers
  const categoryData = (budget.categories || []).map((cat) => ({
    name: cat.name,
    value: Number(cat.amount || 0),
  }));

  // Bar data is placeholder/historical sample. Keep or replace with real time series later.
  const barData = [
    { name: "Jan", income: budget.income || 0, expenses: (budget.totals?.needs || 0) + (budget.totals?.wants || 0) },
    { name: "Feb", income: budget.income || 0, expenses: (budget.totals?.needs || 0) + (budget.totals?.wants || 0) },
    { name: "Mar", income: budget.income || 0, expenses: (budget.totals?.needs || 0) + (budget.totals?.wants || 0) },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name || budget?.user?.name || "User"}!</h1>
        <Button className="bg-green-500 hover:bg-green-600">+ Add Expense</Button>
      </div>

      {/* Budget Summary - show up to first 3 categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {(budget.categories || []).slice(0, 3).map((cat, idx) => (
          <Card key={idx} className="bg-[#1e293b] border border-[#334155]">
            <CardContent className="p-4">
              <div className="text-sm text-gray-400">{cat.name}</div>
              <div className="text-xl font-semibold mt-2">₹{Number(cat.amount || 0).toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Income vs Expense (simple bar) */}
      <Card className="bg-[#1e293b] border border-[#334155] mb-8">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Spending by Categories */}
      <Card className="bg-[#1e293b] border border-[#334155] mb-8">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Spending by Categories</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ minWidth: 200 }}>
              {categoryData.map((cat, i) => (
                <div key={i} className="flex justify-between text-gray-300 text-sm mb-2">
                  <span>{cat.name}</span>
                  <span>₹{Number(cat.value || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions (placeholder) */}
      <Card className="bg-[#1e293b] border border-[#334155]">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <table className="w-full text-sm text-left">
            <thead className="text-gray-400 border-b border-gray-600">
              <tr>
                <th className="py-2">Date</th>
                <th>Name</th>
                <th>Category</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: "Aug 12, 2025", name: "Netflix", category: "Subscriptions", amount: -499 },
                { date: "Aug 13, 2025", name: "Groww", category: "Investments", amount: -2710 },
                { date: "Aug 16, 2025", name: "Reliance Retail", category: "Groceries", amount: -1100 },
              ].map((tx, idx) => (
                <tr key={idx} className="border-b border-gray-700">
                  <td className="py-2">{tx.date}</td>
                  <td>{tx.name}</td>
                  <td>{tx.category}</td>
                  <td className="text-right text-red-400">₹{tx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
