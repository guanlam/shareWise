import React, { useState, useEffect } from "react";
import Section from "../components/Section";
import ArchiveIcon from "@mui/icons-material/Archive";
import AddIcon from "@mui/icons-material/Add";

import axiosClient from "../axios-client";

import BudgetCard from "./BudgetCard";

import AddBudget from "./AddBudget";
import EditBudget from "./EditBidget";
import PopUp from "../components/PopUp";


function Budget() {

  // State for fetched budgets from the API
  const [budgets, setBudgets] = useState([]);
  const [archiveBudgets, setArchiveBudgets] = useState([]);

  const [transactions, setTransactions] = useState([]);
  
  const [showAddPopUp, setShowAddPopUp] = useState(false);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [showArchivePopUp, setShowArchivePopUp] = useState(false);


  // console.log(budgets);
  const [editBudget, setEditBudget] = useState({});



    // Fetch budgets on mount
    useEffect(() => {
        axiosClient.get("/budgets?archived=false")
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
        .get("/budgets?archived=false")
        .then((res) => setBudgets(res.data))
        .catch((err) => console.error(err));
    };

    const refreshArchiveBudgets = () => {
      axiosClient
        .get("/budgets?archived=true")
        .then((res) => setArchiveBudgets(res.data))
        .catch((err) => console.error(err));
    };



  const closeAddPopUp = () => {
    setShowAddPopUp(false);
  };

  const closeEditPopUp = () => {
    setShowEditPopUp(false);
  };

  const closeArchivePopUp = () => {
    setShowArchivePopUp(false);
  };

  const handleDeleteBudget = (budgetId) => {
    setBudgets((prev) => prev.filter(budget => budget.id !== budgetId));
  };

  const showArchiveBudget = () => {
    axiosClient
      .get('/budgets/?archived=true') // Assuming you're using PATCH to update a budget
      .then((res) => {
        setArchiveBudgets(res.data);
        // refreshBudgets();  // Refresh budgets to reflect changes
        setShowArchivePopUp(true); 
      })
      .catch((err) => {
        console.error("Error archiving budget:", err);
        
      });
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
              <div className="relative" onClick={showArchiveBudget}>
                <ArchiveIcon fontSize="large" />
                {archiveBudgets.length > 0 && <div className="absolute right-[-8px] top-[-8px] bg-dark-green text-white rounded-full size-6 all-center">{archiveBudgets.length}</div>}
                
              </div>
            </div>
          </div>
          <div className="css-scrollbar flex flex-col gap-4">
            {budgets.length > 0 ? (
              budgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} transactions={transactions} onDelete={handleDeleteBudget} setEditBudget={setEditBudget} setShowEditPopUp={setShowEditPopUp} 
                refreshBudgets={refreshBudgets} refreshArchiveBudgets={refreshArchiveBudgets}/>
              ))
            ) : (
              <p className="text-center">No budgets available</p>
            )}
          </div>
        </div>
      </Section>

      {/* Pop-up Form for Adding Budget */}
      {showAddPopUp && (
        <AddBudget onClose={closeAddPopUp} setBudgets={setBudgets} refreshBudgets={refreshBudgets} />
      )}

      {showEditPopUp && (
        <EditBudget onClose={closeEditPopUp} editBudget={editBudget} refreshBudgets={refreshBudgets} // Pass refresh function to EditBudget
        />
      )}

      {showArchivePopUp && (
        <PopUp title="Archive Budget" onClose={closeArchivePopUp}>
          <div className="flex flex-col gap-4">
            {archiveBudgets.length > 0 ? (
                archiveBudgets.map((budget) => (
                  <BudgetCard key={budget.id} budget={budget} transactions={transactions} onDelete={handleDeleteBudget} setEditBudget={setEditBudget} setShowEditPopUp={setShowEditPopUp} 
                  refreshBudgets={refreshBudgets} refreshArchiveBudgets={refreshArchiveBudgets} isArchived={true}/>
                ))
              ) : (
                <p className="text-center">No archive budgets available</p>
              )}
          </div>
        </PopUp>
      )}


    </div>
  );
}

export default Budget;
