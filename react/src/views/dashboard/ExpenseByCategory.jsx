import React, { useMemo } from "react";
import PieChart from "./PieChart";

const ExpenseByCategory = ({ transactions, yearDate }) => {
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

  
  const { currentMonth, currentYear } = yearDate;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthName = monthNames[currentMonth];

  const formattedDate = `${monthName} ${currentYear}`;



  return (
    <div className="size-full all-center flex-col p-4 gap-4">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-medium font-semibold">Expense By Category</h2>
        <h2 className="text-small font-semibold">{formattedDate}</h2>
      </div>
      <div className="size-full">
        {/* Check if there's no data */}
        {expenseData.length === 0 ? (
          <p className="text-center">No data available for expenses</p>
        ) : (
          <PieChart data={expenseData} />
        )}
      </div>
    </div>
  );
};

export default ExpenseByCategory;
