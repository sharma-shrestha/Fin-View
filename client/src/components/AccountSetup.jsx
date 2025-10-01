// src/pages/BudgetOnboardingSinglePage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title);

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  Pencil,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { getEnv } from "@/helpers/getEnv";

const currency = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

const SECTION_BG = "bg-[#0f172a]";
const PANEL_BG = "bg-[#111827]";
const MUTED = "text-slate-300";

const DEFAULT_RULE = {
  key: "50-30-20",
  name: "50-30-20 Rule (Recommended)",
  splits: { needs: 50, wants: 30, savings: 20 },
};

const RULES = [
  DEFAULT_RULE,
  { key: "custom", name: "Custom Rule", splits: { needs: 0, wants: 0, savings: 0 } },
];

const DEFAULT_CATEGORIES = [
  { key: "rent", name: "Rent", pct: 30 },
  { key: "groceries", name: "Groceries", pct: 12 },
  { key: "utilities", name: "Utilities", pct: 6 },
  { key: "transport", name: "Transportation", pct: 2 },
  { key: "dining", name: "Dining Out", pct: 8 },
  { key: "entertainment", name: "Entertainment", pct: 6 },
  { key: "subscriptions", name: "Subscriptions", pct: 20 },
  { key: "health", name: "Healthcare", pct: 4 },
  { key: "investments", name: "Investments", pct: 20 },
];

async function getCurrentUser() {
  try {
    const res = await fetch(`${getEnv("VITE_API_URL")}/users/me`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch user");
    return data.user;
  } catch (err) {
    console.error(err);
  }
}

async function saveBudgetToBackend(budget) {
  try {
    const res = await fetch(`${getEnv("VITE_API_URL")}/budget/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // important for cookies/session
      body: JSON.stringify(budget),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to save budget");
    return data;
  } catch (err) {
    console.error(err);
    alert("❌ Error saving budget: " + err.message);
  }
}

async function fetchBudgetFromBackend(month, year) {
  try {
    const res = await fetch(`${getEnv("VITE_API_URL")}/budget/me?month=${month}&year=${year}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) return null; // no budget found
    return data.budget;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default function BudgetOnboardingSinglePage() {
  const [activeStep, setActiveStep] = useState(1);
  const [rule, setRule] = useState(DEFAULT_RULE.key);
  const [customSplits, setCustomSplits] = useState({ needs: 0, wants: 0, savings: 0 });
  const [income, setIncome] = useState(50000);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function init() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // ✅ auto-fetch this month/year budget if exists
      const today = new Date();
      const budget = await fetchBudgetFromBackend(today.getMonth() + 1, today.getFullYear());
      if (budget) {
        setIncome(budget.income);
        setRule(budget.rule);
        setCustomSplits(budget.customSplits);
        setCategories(budget.categories);
      }
    }
    init();
  }, []);

  const selectedRule =
    rule === "custom"
      ? { key: "custom", name: "Custom Rule", splits: customSplits }
      : DEFAULT_RULE;

  const totals = useMemo(() => {
    const needs = Math.round((selectedRule.splits.needs / 100) * income);
    const wants = Math.round((selectedRule.splits.wants / 100) * income);
    const savings = Math.round((selectedRule.splits.savings / 100) * income);
    return { needs, wants, savings, total: income };
  }, [income, selectedRule]);

  const chartData = useMemo(
    () => ({
      labels: ["Needs", "Wants", "Savings"],
      datasets: [
        {
          label: "Breakdown",
          data: [totals.needs, totals.wants, totals.savings],
          backgroundColor: ["#1e3a8a", "#7c3aed", "#10b981"],
          borderColor: ["#0b1229", "#0b1229", "#0b1229"],
          borderWidth: 4,
          hoverOffset: 8,
        },
      ],
    }),
    [totals]
  );

  const progressByStep = (s) => (s === 1 ? 25 : s === 2 ? 50 : s === 3 ? 75 : 100);

  const setPct = (key, newPct) => {
    const pct = Math.max(0, Math.min(100, Number(newPct) || 0));
    setCategories((prev) => prev.map((c) => (c.key === key ? { ...c, pct } : c)));
  };

  const categoriesPctSum = useMemo(
    () => categories.reduce((acc, c) => acc + (Number(c.pct) || 0), 0),
    [categories]
  );
  const remainingPct = 100 - categoriesPctSum;

  const gotoNext = async () => {
    if (activeStep === 4) return;
    // ✅ At final step (Step 3 → Step 4), save budget
    if (activeStep === 3) {
      const today = new Date();
      const payload = {
        title: `${today.toLocaleString("default", { month: "long" })} ${today.getFullYear()} Budget`,
        income,
        rule,
        customSplits,
        totals,
        categories,
        period: { month: today.getMonth() + 1, year: today.getFullYear() },
      };
      await saveBudgetToBackend(payload);
    }
    setActiveStep((s) => Math.min(4, s + 1));
  };

  const gotoPrev = () => setActiveStep((s) => Math.max(1, s - 1));

  const StepHeader = ({ step, title }) => (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-300 hover:text-white"
          onClick={gotoPrev}
          disabled={activeStep === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-green-400 text-xl font-semibold">{title}</h2>
      </div>
      <div className="mt-3">
        <Progress value={progressByStep(step)} className="h-2 bg-white" />
        <div className="mt-1 text-xs text-slate-400">{progressByStep(step)}%</div>
      </div>
    </div>
  );

  return (
    <div className={`${SECTION_BG} min-h-screen w-full py-8 px-4 md:px-8`}>
      <div className="mx-auto max-w-6xl space-y-10 b">
        {/* -------- STEP 1 -------- */}
        {activeStep === 1 && (
          <section id="step1">
            <StepHeader step={1} title="Let’s set up your account" />
            <Card className={`${PANEL_BG} border-slate-400`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Wallet Icon */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="h-28 w-full rounded-xl bg-slate-800/60 flex items-center justify-center">
                      <Wallet className="h-12 w-20 text-slate-300" />
                    </div>
                  </div>
                  <br></br>
                  {/* Username + Dropdown */}
                  <div className="col-span-2 space-y-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-white text-lg font-semibold">
                        {user ? user.name : "Loading..."}
                      </h3>
                      <p className="text-sm text-slate-300">
                        Select your rule to categorize your spends
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Select value={rule} onValueChange={setRule}>
                        <SelectTrigger className="w-[320px] bg-slate-900 text-white border-slate-800">
                          <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 text-white border-slate-700">
                          <SelectItem value="50-30-20">50-30-20 Rule (Recommended)</SelectItem>
                          <SelectItem value="custom">Custom Rule</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        onClick={gotoNext}
                        className=" bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold mt-3"
                      >
                        Next
                      </Button>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* -------- STEP 2 -------- */}
        {activeStep === 2 && (
          <section id="step2">
            <StepHeader step={2} title="Income & High-level Allocations" />
            <Card className={`${PANEL_BG} border-slate-400`}>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="income" className={`${MUTED}`}>
                    Enter Your Monthly Income (₹)
                  </Label>
                  <Input
                    id="income"
                    type="number"
                    inputMode="numeric"
                    value={income}
                    onChange={(e) => {
                      const val = parseInt(e.target.value || "0", 10);
                      setIncome(Number.isFinite(val) && val >= 0 ? val : 0);
                    }}
                    placeholder="E.g. 40,000"
                    className="mt-2 bg-slate-900 text-slate-100 border-slate-800 placeholder:text-slate-500 "
                  />
                </div>

                <div className="justify-between">
                  {["needs", "wants", "savings"].map((key) => (
                    <Card key={key} className="bg-slate-800/60 border-slate-700 gap-3 mb-4">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-slate-300 capitalize">
                              {key} - {selectedRule.splits[key]}%
                            </p>
                            <p className="mt-1 text-lg font-semibold text-slate-100">
                              {currency(Math.round((selectedRule.splits[key] / 100) * income))}
                            </p>
                          </div>
                          <Button size="icon" variant="ghost" className="text-slate-400 hover:text-slate-100">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={gotoPrev} className="border-slate-700 text-white-200 hover:bg-red-800">
                    Back
                  </Button>
                  <Button
                    onClick={gotoNext}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* -------- STEP 3 -------- */}
        {activeStep === 3 && (
          <section id="step3">
            <StepHeader step={3} title="Your Budget Overview" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={`${PANEL_BG} border-slate-800`}>
                <CardHeader>
                  <CardTitle className="text-slate-100">
                    {selectedRule.name} Breakdown
                  </CardTitle>
                  <CardDescription className={`${MUTED}`}>{currency(income)} Total Budget</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="w-full max-w-md mx-auto">
                    <Doughnut 
                      data={chartData}
                      options={{
                        plugins: { legend: { display: false } },
                        cutout: "70%",
                        responsive: true,
                        maintainAspectRatio: true,
                      }}
                    />
                    <div className="mt-6 grid grid-cols-3 text-center text-sm text-slate-300">
                      <div>
                        <div className="h-3 w-3 rounded-full inline-block mr-2" style={{ background: "#1e3a8a" }} />
                        Needs ({selectedRule.splits.needs}%)
                        <div className="mt-1 font-semibold text-slate-100">{currency(totals.needs)}</div>
                      </div>
                      <div>
                        <div className="h-3 w-3 rounded-full inline-block mr-2" style={{ background: "#7c3aed" }} />
                        Wants ({selectedRule.splits.wants}%)
                        <div className="mt-1 font-semibold text-slate-100">{currency(totals.wants)}</div>
                      </div>
                      <div>
                        <div className="h-3 w-3 rounded-full inline-block mr-2" style={{ background: "#10b981" }} />
                        Savings ({selectedRule.splits.savings}%)
                        <div className="mt-1 font-semibold text-slate-100">{currency(totals.savings)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${PANEL_BG} border-slate-800`}>
                <CardHeader>
                  <CardTitle className="text-slate-100">Your Budget Overview</CardTitle>
                  <CardDescription className={`${MUTED}`}>Distribute your expenses across categories</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-4 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Categories Sum</span>
                      <span className={`font-semibold ${remainingPct === 0 ? "text-emerald-400" : remainingPct < 0 ? "text-rose-400" : "text-amber-300"}`}>
                        {categoriesPctSum}% (Remaining: {remainingPct}%)
                      </span>
                    </div>
                    <Separator className="my-3 bg-slate-800" />
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-slate-400">Category</TableHead>
                        <TableHead className="text-slate-400">% Allocation</TableHead>
                        <TableHead className="text-right text-slate-400">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((c) => (
                        <TableRow key={c.key} className="border-slate-800">
                          <TableCell className="text-slate-200">{c.name}</TableCell>
                          <TableCell className="text-slate-300">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="border-slate-700 text-slate-300">
                                {c.pct}%
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-slate-300 border-slate-300">
                                  {[0, 2, 4, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50].map((p) => (
                                    <DropdownMenuItem key={p} onClick={() => setPct(c.key, p)}>
                                      {p}%
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-slate-200">
                            {currency(Math.round(((Number(c.pct) || 0) / 100) * income))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="justify-between">
                 <Button variant="outline" onClick={gotoPrev} className="border-slate-700 text-white-200 hover:bg-red-800">
                    Back
                  </Button>
                  <Button
                    onClick={gotoNext}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold"
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        )}

        {/* -------- STEP 4 -------- */}
        {activeStep === 4 && (
          <section id="step4">
            <StepHeader step={4} title="All Set!" />
            <Card className={`${PANEL_BG} border-slate-800 overflow-hidden`}>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="rounded-xl bg-slate-800/60 h-36 flex flex-col items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                    <p className="mt-3 text-slate-100 font-medium">
                      You have successfully set up your account…
                    </p>
                    <p className="text-slate-400 text-sm">
                      Income: <span className="text-slate-200 font-medium">{currency(income)}</span> • Rule:{" "}
                      <span className="text-slate-200 font-medium">{selectedRule.name}</span>
                    </p>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep(1)}
                      className="border-slate-700 text-white-200 hover:bg-red-800"
                    >
                      Restart
                    </Button>
                    <Button
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold"
                      onClick={() => navigate("/dashboard")}
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
