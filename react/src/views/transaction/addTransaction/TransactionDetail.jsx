import React, { useState, useEffect } from "react";
import {
  ChevronRight as ChevronRightIcon,
  // Import additional icons
} from "@mui/icons-material";

import DebitCardIcon from '@mui/icons-material/CreditCard';
import FoodnDrinkIcon from '@mui/icons-material/Fastfood';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RecurrenceIcon from '@mui/icons-material/EventRepeat';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import CustomSwitch from "../../components/CustomSwitch";
import BasicDatePicker from "./BasicDatePicker";
import Participant from "./Participant";
import axiosClient from "../../axios-client";
import iconMappings from "../../icon-mappings";

function TransactionDetail({ transaction, setTransaction, setActivePanel, selectedCategory, selectedPaymentMethod }) {
  // Local state to control whether it's a group expense (only applicable for Expense)
  const [isGroupExpense, setIsGroupExpense] = useState(false);
  const [amount, setAmount] = useState("");

  const [groupExpenseShowPopUp, setGroupExpenseShowPopUp] = useState(false);


 

  // Handlers for Expense and Income buttons
  const handleSelectExpense = () => {
    // Update the transaction type to "Expense"
    setTransaction((prev) => ({ ...prev, type: "Expense" }));
    // Enable group expense option for expense; reset group expense state if needed
    setIsGroupExpense(false);
  };

  const handleSelectIncome = () => {
    // Update the transaction type to "Income"
    setTransaction((prev) => ({ ...prev, type: "Income", group_expense: false }));
    // For income, group expense is not applicable
    setIsGroupExpense(false);
  };

  // When the group expense switch is toggled, update local and parent state
  const handleSwitchToggle = (event) => {
    const isChecked = event.target.checked;
    setIsGroupExpense(isChecked);
    setTransaction((prev) => ({
      ...prev,
      group_expense: isChecked,
      participants: isChecked ? [] : prev.participants, // Reset participants if disabled
    }));
  };
  

  // Sync group_expense state with the transaction object
  useEffect(() => {
    setTransaction((prev) => ({ ...prev, group_expense: isGroupExpense }));
  }, [isGroupExpense, setTransaction]);



  const [allParticipants, setAllParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]); // State to store selected participants and amounts
  useEffect(() => {
      fetchParticipants();
    }, []);

    const fetchParticipants = () => {
      axiosClient
        .get("/participants")
        .then((res) => setAllParticipants(res.data))
        .catch((err) => console.error(err));
    };

    const handleAddParticipant = () => {
      setSelectedParticipants([...selectedParticipants, { participantId: "", amount: "" }]);
      setTransaction((prev) => ({
        ...prev,
        participants: [...prev.participants, { participantId: "", amount: "" }],
      }));
    };
    
  
    const handleParticipantChange = (index, field, value) => {
      const updatedParticipants = [...selectedParticipants];
      updatedParticipants[index][field] = value;
      setSelectedParticipants(updatedParticipants);
      setTransaction((prev) => ({
        ...prev,
        participants: updatedParticipants,
      }));
    };
    
  

  return (
    <div className="p-6 flex flex-col gap-4 size-full">
      {/* Header: Transaction Type Selection */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-large font-semibold whitespace-nowrap">New Transaction</h2>
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
            type="text"
            placeholder="0"
            className="text-big"
            value={transaction.amount || amount}
            onChange={(e) => setAmount(e.target.value)}
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
                  style={{ backgroundColor: selectedCategory?.color || "#1c312c" }} // ✅ Fixed fallback
                >
                  <span className="text-white">
                    {selectedCategory?.icon ? React.createElement(iconMappings[selectedCategory.icon]) : "?"}
                  </span>
                </div>

                {/* Category Name */}
                <h3>{selectedCategory?.name || "Select Category"}</h3>
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
                  <span className="text-white">{selectedPaymentMethod?.icon ? React.createElement(iconMappings[selectedPaymentMethod.icon]) : "?"}</span>
                </div>
                <h3>{selectedPaymentMethod?.name || "Select Payment Method"}</h3>
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
                  value={transaction.recurrence_frequency}
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
          {transaction.type === "Expense" && (
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
                    <CustomSwitch onChange={handleSwitchToggle} checked={isGroupExpense} />
                    </div>
                </div>

                {groupExpenseShowPopUp && <Participant onClose={() => setGroupExpenseShowPopUp(false)}/>}

                {/* Render additional input fields for group expense if enabled */}
                {isGroupExpense && (
                  <>
                    {selectedParticipants.map((participant, index) => (
                      <div key={index} className="flex gap-2">
                        <select
                          id="participant"
                          name="participant"
                          className="w-[70%] rounded-full p-2"
                          value={participant.participantId}
                          onChange={(e) => handleParticipantChange(index, 'participantId', e.target.value)}
                        >
                          <option value="" disabled hidden>Select a person</option>
                          {allParticipants.map((p, idx) => (
                            <option key={idx} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Enter Amount"
                          className="border-b-2 border-[#adccbd]"
                          value={participant.amount}
                          onChange={(e) => handleParticipantChange(index, 'amount', e.target.value)}
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddParticipant}
                      className="mt-2 text-blue-500"
                    >
                      Add More
                    </button>
                  </>
                )}

                
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
                value={transaction.description}
                onChange={(e) => setTransaction((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#adccbd]"></div>
        </div>
      </form>
    </div>
  );
}

export default TransactionDetail;
