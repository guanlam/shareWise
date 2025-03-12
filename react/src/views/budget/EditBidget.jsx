import React, { useState, useEffect } from "react";
import PopUp from "../components/PopUp";
import CustomButton from "../components/CustomButton";
import BudgetSelect from "./BudgetSelect";
import DatePeriodPicker from "./DatePeriodPicker";
import axiosClient from "../axios-client";
import iconMappings from "../icon-mappings";
import { format } from "date-fns";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function EditBudget({ onClose, editBudget, refreshBudgets }) {

  // State for Snackbar visibility and message
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // 'success' or 'error'


  // Initialize local state with the passed editBudget data
  const [budget, setBudget] = useState({
    name: editBudget.name || "",
    amount: parseFloat(editBudget.amount || 0),
    type: editBudget.type || "Expense",
    category_id: editBudget.category_id || "",
    start_date: editBudget.start_date || "",
    end_date: editBudget.end_date || "",
  });

  console.log(budget);

  const [nowCategory, setNowCategory] = useState(null);
  useEffect(() => {
    axiosClient
      .get(`/categories?id=${budget.category_id}`)
      .then((res) => setNowCategory(res.data))
      .catch((err) => console.error(err));
  }, [editBudget.category_id]);
  // console.log('console.log(nowCategory): ',nowCategory[0].name)
  

  // State for selected category (used by BudgetSelect)
  const [selectedCategory, setSelectedCategory] = useState(null);
  // State for all categories available for the budget type
  const [allCategories, setAllCategories] = useState([]);

  // When the budget type changes, fetch corresponding categories
  useEffect(() => {
    axiosClient
      .get(`/categories?type=${budget.type}`)
      .then((res) => setAllCategories(res.data))
      .catch((err) => console.error(err));
  }, [budget.type]);

  // If editBudget prop changes, update the local budget state
  useEffect(() => {
    setBudget({
      name: editBudget.name || "",
      amount: parseFloat(editBudget.amount || 0),
      type: editBudget.type || "Expense",
      category_id: editBudget.category_id || "",
      start_date: editBudget.start_date || "",
      end_date: editBudget.end_date || "",
    });
  }, [editBudget]);

  // Handler for category selection
  const handleCategorySelect = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setBudget((prev) => ({ ...prev, category_id: selectedOption.value }));
    
  };

  // Handlers for switching budget type
  const handleSelectExpense = (e) => {
    e.preventDefault();
    setBudget((prev) => ({ ...prev, type: "Expense" }));
  };

  const handleSelectIncome = (e) => {
    e.preventDefault();
    setBudget((prev) => ({ ...prev, type: "Income" }));
  };

  // Handler to update budget period when a range is selected
  const handlePeriodSelect = (range) => {
    setBudget((prev) => ({
      ...prev,
      start_date: format(range.startDate, "yyyy-MM-dd"),
      end_date: format(range.endDate, "yyyy-MM-dd"),
    }));
  };

  // Submit handler to update the budget via a PUT request
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosClient
      .put(`/budgets/${editBudget.id}`, budget)
      .then((res) => {
        console.log("Budget updated:", res.data.budget);
        setAlertMessage('Budget updated successfully!');
        setSeverity('success');

        // Add a 1-second delay before calling onDelete
        setTimeout(() => {
          onClose(); // Close the pop-up after updating
          // Optionally, trigger a refresh of the budget list in the parent component
          refreshBudgets();
        }, 1000); // 1000 milliseconds = 1 second

        
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.data && err.response.data.errors) {
          // Extract error messages from the `errors` object
          const errorMessages = Object.values(err.response.data.errors)
            .flat() // Flatten the array of errors for each field
            .join('\n'); // Join them into a single string
  
          setAlertMessage(errorMessages); // Set error messages to be displayed
          setSeverity('error'); // Set to error
        }
      });
    
  };


  // Open the Snackbar after setting message and severity
    useEffect(() => {
      if (alertMessage && severity) {
        setOpen(true);
      }
    }, [alertMessage, severity]);
    

  const handleClose = () => {
    setOpen(false); // Close Snackbar
  };


  return (
    <PopUp title="Edit Budget" onClose={onClose}>
      <form
        className="popUp-form flex flex-col gap-4 h-full justify-between"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4">
          {/* Budget Name */}
          <div className="flex flex-col gap-2">
            <label className="text-small text-[#798f86]">Name</label>
            <input
              type="text"
              placeholder="Enter Budget Name"
              value={budget.name}
              onChange={(e) =>
                setBudget((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="w-full h-[1px] bg-[#adccbd]"></div>

          {/* Budget Amount */}
          <div className="flex flex-col gap-2">
            <label className="text-small text-[#798f86]">Amount</label>
            <input
              type="number"
              placeholder="0"
              step="0.01"
              value={budget.amount}
              onChange={(e) =>
                setBudget((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value),
                }))
              }
              required
            />
          </div>
          <div className="w-full h-[1px] bg-[#adccbd]"></div>

          {/* Budget Type */}
          <div className="flex flex-col gap-2">
            <label className="text-small text-[#798f86]">Budget Type</label>
            <div className="flex gap-4">
              <button
                onClick={handleSelectExpense}
                className={`px-4 py-2 rounded-3xl text-supersmall ${
                  budget.type === "Expense"
                    ? "bg-dark-green text-white"
                    : "bg-white text-black"
                }`}
              >
                Expense
              </button>
              <button
                onClick={handleSelectIncome}
                className={`px-4 py-2 rounded-3xl text-supersmall ${
                  budget.type === "Income"
                    ? "bg-dark-green text-white"
                    : "bg-white text-black"
                }`}
              >
                Income
              </button>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#adccbd]"></div>

          {/* Budget Category */}
          <div className="flex flex-col gap-2">
            <label className="text-small text-[#798f86]">Budget For {" (Existing Category Selected: " + nowCategory?.[0]?.name + ")"}</label>
            <BudgetSelect
            
              onChange={handleCategorySelect}
              placeholder="Select Budget Category"
              iconMappings={iconMappings}
              categories={allCategories}
            />
          </div>
          <div className="w-full h-[1px] bg-[#adccbd]"></div>

          {/* Budget Period */}
          <div className="flex flex-col gap-2">
            <label className="text-small text-[#798f86]">Budget Period</label>
            <div>
              <DatePeriodPicker onSelectRange={handlePeriodSelect} editBudget={editBudget} />
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#adccbd]"></div>
        </div>
        <div className="flex justify-end items-center gap-4 mt-4 mb-4">
          <CustomButton
            type="reset"
            className="bg-white text-black"
            text="Cancel"
            onClick={onClose}
          />
          <CustomButton
            type="submit"
            className="bg-dark-green text-white"
            text="Confirm"
          />
        </div>
      </form>

      {/* Snackbar for success or error message */}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
              <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
              <div style={{ whiteSpace: 'pre-line' }}>
                {alertMessage}
              </div>
              </Alert>
            </Snackbar>
    </PopUp>
  );
}

export default EditBudget;
