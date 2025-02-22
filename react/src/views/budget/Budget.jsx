import React, { useState, useEffect } from "react";
import Section from "../components/Section";
import ArchiveIcon from "@mui/icons-material/Archive";
import AddIcon from "@mui/icons-material/Add";

import axiosClient from "../axios-client";

import BudgetCard from "./BudgetCard";

import AddBudget from "./AddBudget";
import EditBudget from "./EditBidget";

// Define your colors (adjust as needed)
const greenColor = "#24bf31";
const redColor = "#c93a3a";

function Budget() {

  // State for fetched budgets from the API
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  const [showAddPopUp, setShowAddPopUp] = useState(false);
  const [showEditPopUp, setShowEditPopUp] = useState(false);


  // console.log(budgets);
  const [editBudget, setEditBudget] = useState({});



    // Fetch budgets on mount
    useEffect(() => {
        axiosClient.get("/budgets")
        .then((res) => {setBudgets(res.data)})
        .catch((err) => console.error(err));
    }, []);

    // Fetch transactions on mount
    useEffect(() => {
        axiosClient.get("/transactions")
        .then((res) => setTransactions(res.data))
        .catch((err) => console.error(err));
    }, []);

    // Function to refresh budgets after an update
    const refreshBudgets = () => {
      axiosClient
        .get("/budgets")
        .then((res) => setBudgets(res.data))
        .catch((err) => console.error(err));
    };



  const closeAddPopUp = () => {
    setShowAddPopUp(false);
  };

  const closeEditPopUp = () => {
    setShowEditPopUp(false);
  };

  const handleDeleteBudget = (budgetId) => {
    setBudgets((prev) => prev.filter(budget => budget.id !== budgetId));
  };

  return (
    <div className="flex gap-4 size-full justify-center flex-wrap">
      {/* Left Section: Render the list of budgets */}
      <Section className="flex flex-col gap-4 p-4 pb-6 bg-light-mint">
        <div className="p-4 size-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-large font-bold">My Budget</h2>
            <div className="flex gap-4">
              <div onClick={() => setShowAddPopUp(true)}>
                <AddIcon fontSize="large" />
              </div>
              <ArchiveIcon fontSize="large" />
            </div>
          </div>
          <div className="css-scrollbar flex flex-col gap-4">
            {budgets.length > 0 ? (
              budgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} transactions={transactions} onDelete={handleDeleteBudget} setEditBudget={setEditBudget} setShowEditPopUp={setShowEditPopUp}/>
              ))
            ) : (
              <p className="text-center">No budgets available</p>
            )}
          </div>
        </div>
      </Section>

      {/* Pop-up Form for Adding Budget */}
      {showAddPopUp && (
        <AddBudget onClose={closeAddPopUp} setBudgets={setBudgets} />
      )}

      {showEditPopUp && (
        <EditBudget onClose={closeEditPopUp} editBudget={editBudget} refreshBudgets={refreshBudgets} // Pass refresh function to EditBudget
        />
      )}


    </div>
  );
}

export default Budget;
