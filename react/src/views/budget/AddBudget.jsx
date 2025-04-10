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

function AddBudget({onClose, setBudgets, refreshBudgets}) {

    // State for Snackbar visibility and message
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('success'); // 'success' or 'error'

    // State for the budget form (for adding a new budget)
    const [budget, setBudget] = useState({
        name: "",
        amount: 0,
        type: "Expense",
        category_id: "",
        start_date: "",
        end_date: "",
    });

    // State for category selection in the form
    const [selectedCategory, setSelectedCategory] = useState(null);
      
  
  ////PopUP Add Budget

  // Handler for when a category is selected in the form
  const handleCategorySelect = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setBudget((prev) => ({ ...prev, category_id: selectedOption.value }));
  };

  // Handlers for Expense and Income buttons in the form
  const handleSelectExpense = (e) => {
    e.preventDefault();
    setBudget((prev) => ({ ...prev, type: "Expense" }));
  };

  const handleSelectIncome = (e) => {
    e.preventDefault();
    setBudget((prev) => ({ ...prev, type: "Income" }));
  };

  // Fetch categories for the BudgetSelect component whenever budget type changes
  const [allCategories, setAllCategories] = useState([]);
  useEffect(() => {
    axiosClient
      .get(`/categories?type=${budget.type}`)
      .then((res) => setAllCategories(res.data))
      .catch((err) => console.error(err));
  }, [budget.type]);

  // Handler to update budget period when a range is selected from DatePeriodPicker
  const handlePeriodSelect = (range) => {
    setBudget((prev) => ({
      ...prev,
      start_date: format(range.startDate, "yyyy-MM-dd"),
      end_date: format(range.endDate, "yyyy-MM-dd"),
    }));
  };

  

  // (Optional) You can add a submit handler for the form to create a new budget
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosClient
      .post("/budgets", budget)
      .then((res) => {
        // Refresh budgets list after adding
        setAlertMessage('Budget created successfully!');
        setSeverity('success'); // Set to success
        

        // Add a 1-second delay before calling onDelete
        setTimeout(() => {
          refreshBudgets();
          onClose();
        }, 1000); // 1000 milliseconds = 1 second

        
        // console.log("Budget stored:", res.data.budget);

        
        
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
    <PopUp title="Add Budget" onClose={onClose}>
    <form className="popUp-form flex flex-col gap-4 h-full justify-between" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-small text-[#798f86]">Name</label>
          <input
            type="text"
            placeholder="Enter Budget Name"
            onChange={(e) =>
              setBudget((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="w-full h-[1px] bg-[#adccbd]"></div>
        <div className="flex flex-col gap-2">
          <label className="text-small text-[#798f86]">Amount</label>
          <input
              type="number"
              placeholder="0"
              step="0.01"  // This allows numbers with 2 decimal places
              onChange={(e) =>
                  setBudget((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value),
                  }))
              }
          />


        </div>
        <div className="w-full h-[1px] bg-[#adccbd]"></div>
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
        <div className="flex flex-col gap-2">
          <label className="text-small text-[#798f86]">Budget For</label>
          <BudgetSelect
            value={selectedCategory}
            onChange={handleCategorySelect}
            placeholder="Select Budget Category"
            iconMappings={iconMappings}
            categories={allCategories}
          />
        </div>
        <div className="w-full h-[1px] bg-[#adccbd]"></div>
        <div className="flex flex-col gap-2">
          <label className="text-small text-[#798f86]">Budget Period</label>
          <div>
            <DatePeriodPicker onSelectRange={handlePeriodSelect} />
          </div>
        </div>
        <div className="w-full h-[1px] bg-[#adccbd]"></div>
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

export default AddBudget;
