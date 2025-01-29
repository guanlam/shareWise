import React, { useState } from "react";
import BalanceSummary from "./BalanceSummary";
import TransactionFilter from "./TransactionFilter";
import TransactionList from "./TransactionList";

function Transaction() {
    // Sample transactions (you can replace with API data)
    const allTransactions = [
        {
            id: 1,
            category: "Food & Beverage",
            method: "Cash",
            description: "Pan Mee",
            amount: -9.9,
            date: "2024-11-05",
        },
        {
            id: 2,
            category: "Food & Beverage",
            method: "Debit Card",
            description: "Pan Mee",
            amount: -9.9,
            date: "2024-11-05",
        },
        {
            id: 3,
            category: "Food & Beverage",
            method: "Today",
            description: "Pan Mee",
            amount: 9.9,
            date: "2024-11-05",
        },
        {
            id: 4,
            category: "Food & Beverage",
            method: "Today",
            description: "Pan Mee",
            amount: -9.9,
            date: "2024-11-04",
        },
        {
            id: 5,
            category: "Food & Beverage",
            method: "Today",
            description: "Pan Mee",
            amount: -9.9,
            date: "2024-11-04",
        },
        {
            id: 6,
            category: "Food & Beverage",
            method: "Today",
            description: "Pan Mee",
            amount: -9.9,
            date: "2024-11-04",
        },
    ];

    const [selectedMonth, setSelectedMonth] = useState(10); // Default to November
    const filteredTransactions = allTransactions.filter((txn) => {
        return new Date(txn.date).getMonth() === selectedMonth;
    });

    // Calculate balance summary
    const income = allTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    const expense = allTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = income + expense;


    const currentMonth = new Date().getMonth();


    return (
        <div className="flex gap-4 size-[100%] justify-between">
            {/* Left Side: Balance Summary & Transaction Filter */}
            <div className="w-[40%] h-[100%] flex flex-col gap-4  rounded-xl">
                <BalanceSummary
                    balance={balance}
                    income={income}
                    expense={Math.abs(expense)}
                />
                <TransactionFilter
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    resetFilters={() => setSelectedMonth(currentMonth)}
                />
            </div>

            {/* Right Side: Transaction List */}
            <div className="w-[40%] h-[100%] flex flex-col gap-4 rounded-xl bg-light-mint p-4">
                <TransactionList transactions={filteredTransactions} />
            </div>
        </div>
    );
}

export default Transaction;
