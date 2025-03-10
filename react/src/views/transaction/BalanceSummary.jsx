import React from "react";
import arrowUpIcon from "/image/icons8-arrow-up.png";
import arrowDownIcon from "/image/icons8-arrow-down.png";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip component from Material-UI

function BalanceSummary({ balance, income, expense }) {
    // Calculate the percentage of expense compared to income
    const expensePercentage = (expense / income) * 100; // Expense as a percentage of income
    
    // Define the threshold for a warning (e.g., when expense is 90% or more of income)
    const alertThreshold = 90; // 90% of income
    
    // Determine if the balance is healthy or approaching negative
    const isHealthy = balance > 0;

    // Dynamic background color based on the expense percentage
    let bgColor = "bg-dark-green"; // Default to healthy balance (green background)

    // Handle case where income and expense are both zero
    if (income === 0 && expense === 0) {
        bgColor = "bg-dark-green"; // Keep the background green for zero income and expense
    }
    // If expense is nearing the income (within 10% of income), use light red background
    else if (expensePercentage >= alertThreshold && expensePercentage < 100) {
        bgColor = "bg-red-500"; // Light red background for alert
    } else if (expensePercentage >= 100 || !isHealthy) {
        // If expense exceeds income or balance is negative, use a darker red background
        bgColor = "bg-red-700"; 
    }

    // Dynamic Tooltip based on the balance and expense conditions
    let tooltipMessage = "Your balance is healthy!";
    if (expensePercentage >= 100) {
        tooltipMessage = "Your expenses have exceeded your income. Consider adjusting your spending!";
    } else if (expensePercentage >= alertThreshold) {
        tooltipMessage = "Your expenses are approaching your income. Monitor your spending!";
    }

    return (
        <div className="size-[100%] flex flex-col gap-6">
            <div className={`pl-[18%] px-4 ${bgColor} rounded-lg flex items-center justify-between`}>
                <div className="rounded-lg flex flex-col py-4">
                    <p className="text-big font-bold text-white">
                        RM {balance.toFixed(2)}
                    </p>
                    <h2 className="text-small text-white">Total Balance</h2>
                </div>
                <div>
                    {/* Tooltip wrapped around InfoOutlinedIcon with dynamic message */}
                    <Tooltip title={tooltipMessage} arrow>
                        <InfoOutlinedIcon fontSize="medium" sx={{ color: 'white' }} />
                    </Tooltip>
                </div>
            </div>

            <div className="flex items-center justify-between w-full">
                <div className="w-[40%] all-center py-4 pr-4 bg-light-cyan rounded-lg gap-4">
                    <img src={arrowUpIcon} alt="arrow up" className="size-[45px] bg-light-mint p-2 rounded-xl" />
                    <div>
                        <span className="font-semibold">Income</span>
                        <p className="text-medium font-bold">
                            RM {income.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className="w-[40%] all-center py-4 pr-4 bg-light-cyan rounded-lg gap-4">
                    <img src={arrowDownIcon} alt="arrow down" className="size-[45px] bg-light-mint p-2 rounded-xl" />
                    <div>
                        <span className="font-semibold">Expense</span>
                        <p className="text-medium font-bold">
                            RM {expense.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BalanceSummary;
