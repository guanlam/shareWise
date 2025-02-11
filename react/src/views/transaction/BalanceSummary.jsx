import React from "react";
import arrowUpIcon from "/image/icons8-arrow-up.png";
import arrowDownIcon from "/image/icons8-arrow-down.png"

function BalanceSummary({ balance, income, expense }) {
    return (
        <div className="size-[100%]  flex flex-col gap-6">
            <div className="bg-dark-green rounded-lg flex flex-col pl-[20%] py-4">
                <p className="text-big font-bold text-white">
                    RM {balance.toFixed(2)}
                </p>
                <h2 className="text-small text-white">Total Balance</h2>
            </div>

            <div className="flex items-center justify-between w-full">
                <div className="w-[40%] all-center py-4 pr-4 bg-light-cyan rounded-lg gap-4">
                    <img src={arrowUpIcon} alt="arrow up" className="size-[45px] bg-light-mint p-2 rounded-xl"/>
                    <div>
                        <span className="font-semibold">Income</span>
                        <p className="text-medium font-bold">
                            RM {income.toFixed(2)}
                        </p>
                    </div>
                    
                </div>
                <div className="w-[40%] all-center py-4 pr-4 bg-light-cyan rounded-lg gap-4">
                    <img src={arrowDownIcon} alt="arrow up" className="size-[45px] bg-light-mint p-2 rounded-xl"/>
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
