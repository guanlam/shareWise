import React, { useEffect, useState } from 'react'
import Section from '../components/Section'
import BalanceSummary from '../transaction/BalanceSummary'
import TransactionList from '../transaction/TransactionList'
import axiosClient from '../axios-client';
import ExpenseByCategory from './ExpenseByCategory';

function Dashboard() {

    // State to hold all transactions fetched from the API
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to hold the selected month (0 = January, 11 = December)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();


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
    return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
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
    <div className="flex gap-4 size-full justify-between flex-wrap">
            {/* Left Side: Balance Summary & Transaction Filter */}
            <Section className="flex flex-col gap-4 p-4">
                {/* Left Panel - Dashboard Details */}
                <BalanceSummary
                    balance={filteredBalance}
                    income={filteredIncome}
                    expense={Math.abs(filteredExpense)}
                />
                <div className='h-[38vh] bg-light-mint rounded-xl'>
                    <TransactionList title="Recent Transaction" transactions={filteredTransactions} loading={loading} />
                </div>
                

            </Section>
            

            {/* Right Side: Dasboard Pie Chart */}
            <Section className="bg-light-mint overflow-auto">
                <ExpenseByCategory transactions={filteredTransactions}/>
            

            </Section>


    </div>
  )
}

export default Dashboard
