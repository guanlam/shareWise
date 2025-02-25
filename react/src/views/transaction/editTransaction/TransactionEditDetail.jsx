import React, { useState, useEffect } from "react";
import {
  ChevronRight as ChevronRightIcon,
  // Import additional icons
} from "@mui/icons-material";


import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RecurrenceIcon from '@mui/icons-material/EventRepeat';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';

import BasicDatePicker from "../addTransaction/BasicDatePicker";
import Participant from "../addTransaction/Participant";
import axiosClient from "../../axios-client";
import iconMappings from "../../icon-mappings";
import { useNavigate } from "react-router-dom";






function TransactionEditDetail({ transaction, setTransaction, setActivePanel, selectedCategory, selectedPaymentMethod }) {
  // Local state to control whether it's a group expense (only applicable for Expense)
  const [isGroupExpense, setIsGroupExpense] = useState(false);
 

  const [groupExpenseShowPopUp, setGroupExpenseShowPopUp] = useState(false);
  const navigate = useNavigate();

 

  // Handlers for Expense and Income buttons
  const handleSelectExpense = () => {
    // Update the transaction type to "Expense"
    setTransaction((prev) => ({ ...prev, type: "Expense" }));
    // Enable group expense option for expense; reset group expense state if needed
    setIsGroupExpense(false);
  };

  const handleSelectIncome = () => {
    setTransaction((prev) => {
      // Create a new transaction object
      const updatedTransaction = { 
        ...prev, 
        type: "Income", 
        group_expense: false 
      };
  
      // Remove participants if they exist
      if (updatedTransaction.participants) {
        delete updatedTransaction.participants;
      }
  
      return updatedTransaction;
    });
  
    // Disable group expense since it's not applicable for Income
    setIsGroupExpense(false);
  };
  
  
  
  


  const handleDeleteTransaction = (e) => {
    e.preventDefault();
    // Show a confirmation dialog or proceed directly with the delete request
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      axiosClient
        .delete(`/transactions/${transaction.id}`)  // Make sure your URL is correct
        .then((response) => {
          // On success, you might want to update the state or redirect
          alert(response.data.message);
          // Optional: You could redirect to another page, or update the list of transactions in your state
          setTransaction(null);  // Clear the transaction state, or navigate away
          navigate('/transaction')
        })
        .catch((error) => {
          if (error.response) {
            // Handle error (e.g., Unauthorized or any server-side error)
            alert(error.response.data.message || 'Error deleting transaction');
          } else {
            alert('Error deleting transaction');
          }
        });
    }
  };



  // const handleMarkAsPaid = (participantId) => {
  //   axiosClient
  //     .patch(`/transactions/${transaction.id}/participants/${participantId}`, {
  //       payment_status: "Paid",
  //     })
  //     .then((response) => {
  //       // Update state to reflect the change in payment status
  //       setTransaction((prev) => ({
  //         ...prev,
  //         participants: prev.participants.map((participant) =>
  //           participant.id === participantId
  //             ? { ...participant, pivot: { ...participant.pivot, payment_status: "Paid" } }
  //             : participant
  //         ),
  //       }));
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.error("Error updating payment status:", error);
  //       alert("Error updating payment status");
  //     });
  // };

  const handleMarkAsPaid = (participantId) => {
    // Find the participant to get the amount owed
    const participant = transaction.participants.find(p => p.id === participantId);
    if (!participant) return;
  
    const paidAmount = parseFloat(participant.pivot.amount_owed);
  
    axiosClient
      .patch(`/transactions/${transaction.id}/participants/${participantId}`, {
        payment_status: "Paid",
      })
      .then((response) => {
        // Deduct the paid amount directly from the transaction's amount.
        setTransaction((prev) => ({
          ...prev,
          amount: (parseFloat(prev.amount) - paidAmount).toFixed(2),
          participants: prev.participants.map((p) =>
            p.id === participantId
              ? { ...p, pivot: { ...p.pivot, payment_status: "Paid" } }
              : p
          ),
        }));
      })
      .catch((error) => {
        console.error("Error updating payment status:", error);
        alert("Error updating payment status");
      });
  };
  
  
 
  
    

    
  return (
    <div className="p-6 flex flex-col gap-4 size-full">
      {/* Header: Transaction Type Selection */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-large font-semibold whitespace-nowrap">Edit Transaction</h2>
        <div className="flex gap-4">
          <button
            onClick={handleSelectExpense}
            className={`px-4 py-2 rounded-3xl text-small ${
              transaction.type === "Expense" ? "bg-dark-green text-white" : "bg-white text-black"
            }`}
          >
            Expense
          </button>
          <button
            onClick={handleSelectIncome}
            className={`px-4 py-2 rounded-3xl text-small ${
              transaction.type === "Income" ? "bg-dark-green text-white" : "bg-white text-black"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <form className="tran-form css-scrollbar">
        {/* Amount Input (Opens Calculator) */}
        <div className="css-input" onClick={() => setActivePanel("calculator")}>
          <label className="text-medium font-semibold">RM</label>
          <input
            type="number"  // This restricts the input to only numeric values
            placeholder="0"
            className="text-big"
            value={transaction.amount}
            onChange={(e) => {
              const value = e.target.value;

              // Handle empty string scenario
              if (value === "") {
                setTransaction((prev) => ({
                  ...prev,
                  amount: "",
                }));
              } else {
                const numericValue = parseFloat(value);  // Convert the string to a number

                if (!isNaN(numericValue) && numericValue >= 0) {  // Check if the value is a valid number and non-negative
                  setTransaction((prev) => ({
                    ...prev,
                    amount: numericValue,
                  }));
                }
              }
            }}
          />



        </div>
        <div className="w-full h-[2px] bg-black mb-4"></div>

        <div className="flex flex-col gap-4">
          {/* Category Section */}
          <div className="flex flex-col gap-2">
            <div className="text-small text-[#798f86]">
              <h5>Category</h5>
            </div>
            <div className="flex justify-between items-center" onClick={() => setActivePanel("category")}>
              <div className="flex items-center gap-4">
                {/* Category Icon with Background Color */}
                <div
                  className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-xl"
                  style={{ backgroundColor: transaction.category.color || selectedCategory?.color || "#1c312c" }} // ✅ Fixed fallback
                >
                  <span className="text-white">
                    {selectedCategory?.icon ? React.createElement(iconMappings[selectedCategory.icon]) : React.createElement(iconMappings[transaction.category.icon])}
                  </span>
                </div>

                {/* Category Name */}
                <h3>{selectedCategory?.name ? selectedCategory.name : transaction.category.name}</h3>
              </div>

              <div>
                <ChevronRightIcon fontSize="large" />
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#adccbd]"></div>

          {/* Payment Method Section */}
          <div className="flex flex-col gap-2">
            <div className="text-small text-[#798f86]"><h5>Payment Method</h5></div>
            <div className="flex justify-between items-center" onClick={() => setActivePanel("paymentMethod")}>
              <div className="flex items-center gap-4">
                <div className="w-[2.5rem] h-[2.5rem] bg-slate-500 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: selectedPaymentMethod?.color || "#1c312c" }} 
                >
                  <span className="text-white">{selectedPaymentMethod?.icon ? React.createElement(iconMappings[selectedPaymentMethod.icon]) : React.createElement(iconMappings[transaction.payment_method.icon])}</span>
                </div>
                <h3>{selectedPaymentMethod?.name ? selectedPaymentMethod.name : transaction.payment_method.name}</h3>
              </div>
              <div>
                <ChevronRightIcon fontSize="large" />
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#adccbd]"></div>

          {/* Date Section */}
          <div className="flex flex-col gap-2">
            <div className="text-small text-[#798f86]"><h5>Date</h5></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-[2.5rem] h-[2.5rem] bg-cyan-500 flex items-center justify-center rounded-xl">
                  <span className="text-white"><CalendarMonthIcon /></span>
                </div>
                <BasicDatePicker date={transaction.date} setTransaction={setTransaction} />
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#adccbd]"></div>

          {/* Recurrence Section */}
          <div className="flex flex-col gap-2">
            <div className="text-small text-[#798f86]"><h5>Recurrence</h5></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 w-full">
                <div className="w-[2.5rem] h-[2.5rem] bg-teal-500 flex items-center justify-center rounded-xl">
                  <span className="text-white"><RecurrenceIcon /></span>
                </div>
                <select 
                  id="recurrence" 
                  name="recurrence"
                  value={transaction.recurrence?.frequency || "None"}
                  onChange={(e) => {
                    const newRecurrenceFrequency = e.target.value;
                    setTransaction((prev) => {
                      const updatedTransaction = {
                        ...prev,
                        recurrence: newRecurrenceFrequency !== "None",
                        recurrence_frequency: newRecurrenceFrequency,
                      };

                      // If the value is "None", remove recurrence_frequency from the state
                      if (newRecurrenceFrequency === "None") {
                        delete updatedTransaction.recurrence_frequency;
                      }

                      return updatedTransaction;
                    });
                  }}
                >
                  <option value="None">None</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>

              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#adccbd]"></div>

          {/* Group Expense Section: Only for Expense Type */}
          {Boolean(transaction.group_expense) && (
            <>
                <div className="flex flex-col gap-2">
                  <div className="text-small text-[#798f86]"><h5>Group Expense</h5></div>
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                      <div className="w-[2.5rem] h-[2.5rem] bg-slate-500 flex items-center justify-center rounded-xl">
                          <span className="text-white"><GroupIcon /></span>
                      </div>
                      <h3>As Group Expense</h3>
                      </div>
                      <div className="flex gap-2">
                      <SettingsIcon fontSize="large" onClick={ ()=> setGroupExpenseShowPopUp(true)} />
                      {/* <CustomSwitch onChange={handleSwitchToggle} checked={isGroupExpense} /> */}
                      </div>
                  </div>

                  {groupExpenseShowPopUp && <Participant onClose={() => setGroupExpenseShowPopUp(false)}/>}

                  {/* // Show participant input if Group Expense is ON */}
                  
                    {transaction.participants.map((participant, index) => (
                    <div key={index} className="flex flex-col border border-[#adccbd]
                        p-2 rounded-xl gap-2">
                        
                        <div className="flex justify-between gap-2 font-semibold">
                          <div className="flex-[.1] whitespace-nowrap">
                            {index + 1}
                          </div>
                        
                          <div className="flex-[.6] whitespace-nowrap">
                              {participant.name}
                          </div>
                                  
                          
                          <div className="flex-[.2]">
                              RM{participant.pivot.amount_owed}
                          </div>

                          <div className={`flex-[.2] text-right ${participant.pivot.payment_status === "Paid" ? "text-green-500" : "text-red-500"}`}>
                            {participant.pivot.payment_status}
                          </div>


                        </div>
                        
                        <button className="underline text-gray-500 text-supersmall text-right" 
                        disabled={participant.pivot.payment_status === "Paid"}
                        onClick={(e) => {
                          e.preventDefault();
                          
                          handleMarkAsPaid(participant.id);
                        }}>
                              Already received? Click me
                        </button>
                        
                        
                        </div>
                    ))}

                      
                    
                  


                
                </div>
                <div className="w-full h-[1px] bg-[#adccbd]"></div>
            </>
          )}
          

          {/* Note Section */}
          <div className="flex flex-col gap-2">
            <div className="text-small text-[#798f86]"><h5>Note</h5></div>
            <div className="css-input">
              <input 
                type="text" 
                placeholder="Click to fill in the remarks"
                value={transaction.description || ""}
                onChange={(e) => setTransaction((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#adccbd]"></div>

          {/* Note Section */}
          <div className="flex flex-col gap-2">
          
           <button className="text-red-500 text-left" onClick={handleDeleteTransaction}>
            <p className="font-small uppercase mt-4">Delete</p>

           </button>
          </div>
          


        </div>
      </form>
    </div>
  );
}

export default TransactionEditDetail;
