import React from "react";
import TransactionItem from "./TransactionItem";
import LoadingEffect from "../components/LoadingEffect";

function TransactionList({ title, transactions, loading }) {
    // Group transactions by date
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        const date = transaction.date;
        if (!acc[date]) acc[date] = { transactions: [], total: 0 };

        // Use adjustedAmount if available, otherwise use the original amount
        const amount =
            transaction.adjustedAmount !== undefined
                ? transaction.adjustedAmount
                : transaction.amount;

        acc[date].transactions.push(transaction);
        acc[date].total += amount; // Sum up total per day
        return acc;
    }, {});

    // Function to format date as "Tues. 05/11/2024"
    const formatDate = (dateString) => {
        const options = {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        };
        // Format using en-GB and replace the comma for your desired format
        return new Intl.DateTimeFormat("en-GB", options)
            .format(new Date(dateString))
            .replace(",", ".");
    };

    return (
        <>
            <div className="p-4 size-full flex flex-col">
                {loading ? (
                    <LoadingEffect />
                ) : (
                    <>
                        <h2 className="text-medium font-semibold mb-3">
                            {title}
                        </h2>
                        <div className="css-scrollbar">
                            {Object.keys(groupedTransactions).length === 0 ? (
                                <p className="text-center">No transactions available</p>
                            ) : (
                                Object.keys(groupedTransactions).map((date) => (
                                    <div
                                        key={date}
                                        className="mb-4 bg-white p-4 rounded-xl"
                                    >
                                        {/* Date and Total Amount */}
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-gray-600 font-medium p-1">
                                                {formatDate(date)}
                                            </p>
                                            <p className="text-small text-gray-400">
                                                {groupedTransactions[date]
                                                    .total < 0
                                                    ? `-RM ${Math.abs(
                                                          groupedTransactions[
                                                              date
                                                          ].total
                                                      ).toFixed(2)}`
                                                    : `RM ${groupedTransactions[
                                                          date
                                                      ].total.toFixed(2)}`}
                                            </p>
                                        </div>

                                        <hr className="mb-2" />

                                        {/* Transactions List */}
                                        <div className="flex flex-col gap-2">
                                            {groupedTransactions[
                                                date
                                            ].transactions.map(
                                                (transaction) => (
                                                    <TransactionItem
                                                        key={transaction.id}
                                                        transaction={
                                                            transaction
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default TransactionList;
