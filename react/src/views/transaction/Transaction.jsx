import React, { useEffect, useState } from "react";
import BalanceSummary from "./BalanceSummary";
import TransactionFilter from "./TransactionFilter";
import TransactionList from "./TransactionList";
import Section from "../components/Section";
import axiosClient from "../axios-client";
import LoadingEffect2 from "../components/LoadingEffect2";

function Transaction() {
  // State to hold all transactions fetched from the API
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to hold the selected month (0 = January, 11 = December)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();


  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  // Fetch transactions on component mount
  useEffect(() => {
    axiosClient.get("/transactions")
      .then((res) => {
        // Transform each transaction: if Expense, make adjustedAmount negative
        const transformed = res.data.map((txn) => ({
          ...txn,
          adjustedAmount:
            txn.type === "Expense"
              ? -parseFloat(txn.amount)
              : parseFloat(txn.amount),
        }));
        setAllTransactions(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter transactions by the selected month using the date property
  const filteredTransactions = allTransactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    return txnDate.getMonth() === selectedMonth && txnDate.getFullYear() === selectedYear;
  });

  // Calculate summary values based on filtered transactions
  const filteredIncome = filteredTransactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + parseFloat(t.adjustedAmount ?? t.amount), 0);
  const filteredExpense = filteredTransactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + parseFloat(t.adjustedAmount ?? t.amount), 0);
  const filteredBalance = filteredIncome + filteredExpense;

  return (
    <div className="flex gap-4 size-[100%] justify-between flex-wrap">
      {/* Left Side: Balance Summary & Transaction Filter */}
      <Section className="flex flex-col gap-4">
        <BalanceSummary
          balance={filteredBalance}
          income={filteredIncome}
          expense={Math.abs(filteredExpense)}
        />
        <TransactionFilter
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          resetFilters={() => {
            setSelectedMonth(currentMonth);
            setSelectedYear(currentYear);
          }}
        />
      </Section>

      {/* Right Side: Transaction List */}
      <Section className="flex flex-col gap-4 bg-light-mint p-4">
      
        <TransactionList title="Transactions" transactions={filteredTransactions} loading={loading} />
        
      </Section>
    </div>
  );
}

export default Transaction;
