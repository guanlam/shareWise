import React from "react";
import iconMappings from "../icon-mappings"; // Adjust the path if needed
import { useNavigate } from "react-router-dom";

import RecurrenceIcon from '@mui/icons-material/EventRepeat';
import GroupIcon from '@mui/icons-material/Group';

function TransactionItem({ transaction }) {
    const navigate = useNavigate();
    // Determine the appropriate icon component based on the category's icon name.
    // If there's no category or no matching icon, you can default to a fallback icon.
    const IconComponent =
        (transaction.category && iconMappings[transaction.category.icon]) ||
        // Optionally, you can set a default icon if none is found. For example, fallback to a generic icon:
        iconMappings["Default"];

    const editTransaction = () => {
        navigate("/addTransaction", { state: { transaction, action: "edit" } }); 
    };
    
    // console.log(transaction.recurrence);

    return (
        <div
            className="py-2 rounded-lg flex justify-between items-center hover:bg-gray-100"
            onClick={editTransaction}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-xl"
                    style={{ backgroundColor: transaction.category.color }}
                >
                    {IconComponent ? (
                        <IconComponent className="text-white" />
                    ) : (
                        <span className="text-white">?</span>
                    )}
                </div>

                <div>
                    <h3 className="font-semibold">
                        {transaction.category?.name}
                    </h3>
                    <p className="text-small text-gray-500 flex items-center space-x-1">
                        <span>{transaction.payment_method?.name}</span>
                        {transaction.description && (
                            <>
                            <span>•</span>
                            <span>{transaction.description}</span>
                            </>
                        )}
                        {Boolean(transaction.recurrence) && (
                            <>
                            <span>•</span>
                            <span><RecurrenceIcon fontSize="small" /></span>
                            </>
                        )}
                        {Boolean(transaction.group_expense) && (
                            <>
                            <span>•</span>
                            <span><GroupIcon fontSize="small" /></span>
                            </>
                        )}
                    </p>



                </div>
            </div>
            <p
                className={`text-small font-semibold ${
                    (transaction.adjustedAmount ?? transaction.amount) < 0
                        ? "text-red-600"
                        : "text-green-600"
                }`}
            >
                {(transaction.adjustedAmount ?? transaction.amount) < 0
                    ? `-RM ${Math.abs(
                          transaction.adjustedAmount ?? transaction.amount
                      )}`
                    : `RM ${transaction.adjustedAmount ?? transaction.amount}`}
            </p>
        </div>
    );
}

export default TransactionItem;
