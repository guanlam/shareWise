import React, { useState, useEffect } from "react";
import Section from "../components/Section";
import ArchiveIcon from "@mui/icons-material/Archive";
import FoodnDrinkIcon from "@mui/icons-material/Fastfood";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PopUp from "../components/PopUp";
import CustomButton from "../components/CustomButton";
import BudgetSelect from "./BudgetSelect";
import DatePeriodPicker from "./DatePeriodPicker";
import axiosClient from "../axios-client";
import iconMappings from "../icon-mappings";
import ProgressBar from "../components/ProgressBar";
import BudgetCard from "./BudgetCard";
import { format } from "date-fns";

// Define your colors (adjust as needed)
const greenColor = "#24bf31";
const redColor = "#c93a3a";

function Budget() {
  // State for the budget form (for adding a new budget)
  const [budget, setBudget] = useState({
    name: "",
    amount: 0,
    type: "Expense",
    category_id: "",
    start_date: "",
    end_date: "",
  });
  

  // State for fetched budgets from the API
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  // State for category selection in the form
  const [selectedCategory, setSelectedCategory] = useState(null);
  // State to show/hide the pop-up form for adding a new budget
  const [showPopUp, setShowPopUp] = useState(false);

  console.log(budgets);


    // Fetch budgets on mount
    useEffect(() => {
        axiosClient.get("/budgets")
        .then((res) => setBudgets(res.data))
        .catch((err) => console.error(err));
    }, []);

    // Fetch transactions on mount
    useEffect(() => {
        axiosClient.get("/transactions")
        .then((res) => setTransactions(res.data))
        .catch((err) => console.error(err));
    }, []);

    ////

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

  // Close pop-up handler
  const closePopUp = () => {
    setShowPopUp(false);
  };

  // (Optional) You can add a submit handler for the form to create a new budget
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosClient
      .post("/budgets", budget)
      .then((res) => {
        // Refresh budgets list after adding
        axiosClient.get("/budgets").then((res) => setBudgets(res.data));
        closePopUp();
        console.log("Budget stored:", res.data.budget);
        
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex gap-4 size-full justify-center flex-wrap">
      {/* Left Section: Render the list of budgets */}
      <Section className="flex flex-col gap-4 p-4 pb-10 bg-light-mint">
        <div className="p-4 size-full">
          <div className="flex justify-between items-center">
            <h2 className="text-large font-bold">My Budget</h2>
            <div className="flex gap-4">
              <div onClick={() => setShowPopUp(true)}>
                <AddIcon fontSize="large" />
              </div>
              <ArchiveIcon fontSize="large" />
            </div>
          </div>
          <div className="css-scrollbar flex flex-col gap-4">
            {budgets.length > 0 ? (
              budgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} transactions={transactions} />
              ))
            ) : (
              <p className="text-center">No budgets available</p>
            )}
          </div>
        </div>
      </Section>

      {/* Pop-up Form for Adding Budget */}
      {showPopUp && (
        <PopUp title="Add Budget" onClose={closePopUp}>
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
                  onClick={() => setShowPopUp(false)}
                />
                <CustomButton
                  type="submit"
                  className="bg-dark-green text-white"
                  text="Confirm"
                />
              </div>
            </div>
          </form>
        </PopUp>
      )}
    </div>
  );
}

export default Budget;
