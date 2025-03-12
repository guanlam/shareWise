import React, { useState, useRef, useEffect } from "react";
import ProgressBar from "../components/ProgressBar"; // Your progress bar component
import calculateBudgetProgress from "./calculate/calculateBudgetProgress";
import iconMappings from "../icon-mappings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axiosClient from "../axios-client";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function BudgetCard({ budget, transactions, onDelete, setEditBudget, setShowEditPopUp, refreshBudgets, refreshArchiveBudgets,isArchived }) {
  const totalSpent = calculateBudgetProgress(budget, transactions);
  const progressPercent = (totalSpent / budget.amount) * 100;
  const progressColor = progressPercent > 100 ? "#c93a3a" : "#24bf31";

  // State to toggle button visibility
  const [isOpen, setIsOpen] = useState(false);

  // Ref to detect click outside
  const dropdownRef = useRef(null);


  // State for Snackbar visibility and message
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('success'); // 'success' or 'error'


  // Toggle visibility of buttons
  const toggleOptions = () => {
    setIsOpen((prev) => !prev);
  };

  // Close the options if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close the dropdown
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    setEditBudget(budget);
    setShowEditPopUp(true);
    setIsOpen(false); // Close the dropdown
  };

  // Delete handler: calls API to delete the budget and notifies parent
  const handleDelete = () => {
    axiosClient
      .delete(`/budgets/${budget.id}`)
      .then(() => {
        if (onDelete) {

          setAlertMessage('Budget deleted successfully!');
          setSeverity('success');
          

          // Add a 1-second delay before calling onDelete
          setTimeout(() => {
            onDelete(budget.id);
            refreshBudgets();
            refreshArchiveBudgets();
          }, 1000); // 1000 milliseconds = 1 second
          
        }
      })
      .catch((err) => {
        console.error("Error deleting budget:", err);
        if (err.response && err.response.data && err.response.data.errors) {
          // Extract error messages from the `errors` object
          const errorMessages = Object.values(err.response.data.errors)
            .flat() // Flatten the array of errors for each field
            .join('\n'); // Join them into a single string
  
          setAlertMessage(errorMessages); // Set error messages to be displayed
          setSeverity('error'); // Set to error
        }
      });
      // Open the success Snackbar
      // setOpen(true);
  };

  // Handle unarchive - toggle archived to false
  const handleUnarchive = (budgetId) => {
    axiosClient
      .patch(`/budgets/${budgetId}/unarchive`)
      .then((response) => {
        console.log(response.data.message);
        setAlertMessage('Budget unarchive successfully!');
          setSeverity('success');
        // Refresh the budgets after unarchiving
        refreshBudgets();
        refreshArchiveBudgets();
      })
      .catch((error) => {
        console.error("There was an error unarchiving the budget:", error);
        if (error.response && error.response.data && error.response.data.errors) {
          // Extract error messages from the `errors` object
          const errorMessages = Object.values(error.response.data.errors)
            .flat() // Flatten the array of errors for each field
            .join('\n'); // Join them into a single string
  
          setAlertMessage(errorMessages); // Set error messages to be displayed
          setSeverity('error'); // Set to error
        }
      });
      // Open the success Snackbar
      // setOpen(true);
  };

  // Handle Archive - Toggle archived to true
  const handleArchive = (budgetId) => {
    axiosClient
      .patch(`/budgets/${budgetId}/archive`)
      .then((response) => {
        console.log(response.data.message);
        setAlertMessage('Budget archive successfully!');
        setSeverity('success');
        // Refresh the budgets after archiving
        refreshBudgets();
        refreshArchiveBudgets();
      })
      .catch((error) => {
        console.error("There was an error archiving the budget:", error);
        if (error.response && error.response.data && error.response.data.errors) {
          // Extract error messages from the `errors` object
          const errorMessages = Object.values(error.response.data.errors)
            .flat() // Flatten the array of errors for each field
            .join('\n'); // Join them into a single string
  
          setAlertMessage(errorMessages); // Set error messages to be displayed
          setSeverity('error'); // Set to error
        }
      });

      // Open the success Snackbar
      // setOpen(true);
  };


  // Open the Snackbar after setting message and severity
  useEffect(() => {
    if (alertMessage && severity) {
      setOpen(true);
    }
  }, [alertMessage, severity]);
  // The way the useEffect is currently set up, it will trigger only when both alertMessage and severity change.


  const handleClose = () => {
    setOpen(false); // Close Snackbar
  };


  return (
    <div className="flex border flex-col border-light-gray rounded-lg p-4 gap-4">
      {/* Render budget details */}
      <div className="flex justify-between items-center">
        {/* Icon, name, etc. */}
        <div
          className="size-[2.5rem] all-center rounded-xl text-white"
          style={{ backgroundColor: budget.category.color }}
        >
          {/* You could conditionally render an icon based on the category */}
          {React.createElement(iconMappings[budget.category.icon])}
        </div>
        <div className="flex-[.9]">
          <h3 className="text-small font-semibold">{budget.name}</h3>
          <p className="text-supersmall text-gray-500">
            {budget.start_date} - {budget.end_date}
          </p>
        </div>

        {/* Dropdown toggle button */}
        <div className="relative cursor-pointer" ref={dropdownRef}>
          <MoreVertIcon fontSize="medium" onClick={toggleOptions} />
          {isOpen && !isArchived && (
            <div className="absolute right-5 top-0 bg-white z-20 border rounded-md shadow-lg text-small">
              {/* Triangle pointer */}
              <div className="absolute right-[-9px] top-[4px] border-x-8 border-x-transparent border-b-8 border-b-white rotate-90"></div>

              <button className="block px-3 py-1 hover:bg-gray-100 w-full" onClick={handleEdit}>
                Edit
              </button>
              <button className="block px-3 py-1 hover:bg-gray-100 w-full" onClick={handleDelete}>
                Delete
              </button>
              <button className="block px-3 py-1 hover:bg-gray-100 w-full" onClick={() => handleArchive(budget.id)}>
                Archive
              </button>
            </div>
          )}
          {isOpen && isArchived && (
            <div className="absolute right-5 top-0 bg-white z-20 border rounded-md shadow-lg text-small">
              {/* Triangle pointer */}
              <div className="absolute right-[-9px] top-[4px] border-x-8 border-x-transparent border-b-8 border-b-white rotate-90"></div>

              <button className="block px-3 py-1 hover:bg-gray-100 w-full" onClick={handleDelete}>
                Delete
              </button>
              <button className="block px-3 py-1 hover:bg-gray-100 w-full" onClick={() => handleUnarchive(budget.id)}>
                Unarchive
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <ProgressBar bgcolor={progressColor} completed={progressPercent} />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-supersmall font-bold" style={{ color: progressColor }}>
          RM{totalSpent.toFixed(2)} / RM{budget.amount}
        </p>
        <p className="text-supersmall font-bold">RM{(budget.amount - totalSpent).toFixed(2)} Left</p>
      </div>


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
    </div>
  );
}

export default BudgetCard;

