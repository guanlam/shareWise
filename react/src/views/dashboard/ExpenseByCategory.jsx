import React, { useMemo } from "react";
import PieChart from "./PieChart";

const ExpenseByCategory = ({ transactions }) => {
  // Calculate total expense per category
  const expenseData = useMemo(() => {
    const categoryTotals = {};

    transactions.forEach((txn) => {
      if (txn.type === "Expense") {
        const categoryName = txn.category?.name || "Unknown";
        const categoryIcon = txn.category?.icon || "Default"; // Ensure you also capture the icon

        // If this category hasn't been added yet, initialize it
        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = {
            total: 0,
            color: txn.category?.color || "#ccc",
            icon: categoryIcon, // Store the icon for this category
          };
        }

        // Add the amount to the total (absolute value for expenses)
        categoryTotals[categoryName].total += Math.abs(txn.adjustedAmount);
      }
    });

    // Return the final data structure, now with the `icon` field included
    return Object.keys(categoryTotals).map((category) => ({
      label: category,
      value: categoryTotals[category].total,
      color: categoryTotals[category].color,
      icon: categoryTotals[category].icon, // Include the icon here
    }));
  }, [transactions]);

  return (
    <div className="size-full all-center flex-col p-4 gap-4">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-medium font-semibold">Expense By Category</h2>
        <select id="frequency" name="frequency" className="bg-transparent text-small font-semibold">
          <option value="1">Monthly</option>
          <option value="2">Daily</option>
          <option value="3">Weekly</option>
          <option value="4">Yearly</option>
        </select>
      </div>
      <div className="size-full">
        <PieChart data={expenseData} />
      </div>
    </div>
  );
};

export default ExpenseByCategory;
