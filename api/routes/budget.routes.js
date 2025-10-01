import express from "express";
import { saveBudget, getMyBudget } from "../controllers/budget.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const budgetRoutes = express.Router();

budgetRoutes.post("/save", authenticate, saveBudget);
budgetRoutes.get("/me", authenticate, getMyBudget);

export default budgetRoutes;
