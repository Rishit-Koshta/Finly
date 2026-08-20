import { UtensilsCrossed, Home, Briefcase, ShoppingBag, Clapperboard, Plane, Paperclip } from "lucide-react";

// Mirrors com.rishit.financetracker.entity.enums.Category on the backend.
export const ALL_CATEGORIES = [
  "FOOD",
  "RENT",
  "SALARY",
  "SHOPPING",
  "ENTERTAINMENT",
  "TRAVEL",
  "OTHER",
];

// SALARY is income-only in practice — budgeting it does nothing on the
// backend, since overspend checks only ever fire for EXPENSE transactions.
export const BUDGETABLE_CATEGORIES = ALL_CATEGORIES.filter((c) => c !== "SALARY");

export const CATEGORY_LABEL = {
  FOOD: "Food",
  RENT: "Rent",
  SALARY: "Salary",
  SHOPPING: "Shopping",
  ENTERTAINMENT: "Entertainment",
  TRAVEL: "Travel",
  OTHER: "Other",
};

export const CATEGORY_ICON = {
  FOOD: UtensilsCrossed,
  RENT: Home,
  SALARY: Briefcase,
  SHOPPING: ShoppingBag,
  ENTERTAINMENT: Clapperboard,
  TRAVEL: Plane,
  OTHER: Paperclip,
};
