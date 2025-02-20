import React from "react";
import { parseISO, isAfter, isBefore } from "date-fns";

function calculateBudgetProgress(budget, transactions) {
  // Filter transactions by the budget criteria:
  // - Transaction date falls within budget.start_date and budget.end_date
  // - Transaction type matches budget.type (usually Expense)
  // - (Optional) Transaction category_id matches budget.category_id if required
  const filtered = transactions.filter((txn) => {
    const txnDate = parseISO(txn.date);
    return (
      txn.type === budget.type &&
      isAfter(txnDate, parseISO(budget.start_date)) &&
      isBefore(txnDate, parseISO(budget.end_date)) &&
      (budget.category_id ? txn.category_id === Number(budget.category_id) : true)
    );
  });

  const totalSpent = filtered.reduce((sum, txn) => sum + Number(txn.amount), 0);
  return totalSpent;
}

export default calculateBudgetProgress;
