import React, { useState, useRef, useEffect } from "react";
import ProgressBar from "../components/ProgressBar"; // Your progress bar component
import calculateBudgetProgress from "./calculate/calculateBudgetProgress";
import iconMappings from "../icon-mappings";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function BudgetCard({ budget, transactions }) {
  const totalSpent = calculateBudgetProgress(budget, transactions);
  const progressPercent = (totalSpent / budget.amount) * 100;
  const progressColor = progressPercent > 100 ? "#c93a3a" : "#24bf31";

  // State to toggle button visibility
  const [isOpen, setIsOpen] = useState(false);

  // Ref to detect click outside
  const dropdownRef = useRef(null);

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
          {isOpen && (
            <div className="absolute right-5 top-0 bg-white z-20 border rounded-md shadow-lg text-small">
              {/* Triangle pointer */}
              <div className="absolute right-[-9px] top-[4px] border-x-8 border-x-transparent border-b-8 border-b-white rotate-90"></div>

              <button className="block px-3 py-1 hover:bg-gray-100 w-full">
                Edit
              </button>
              <button className="block px-3 py-1 hover:bg-gray-100 w-full">
                Delete
              </button>
              <button className="block px-3 py-1 hover:bg-gray-100 w-full">
                Archive
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <ProgressBar bgcolor={progressColor} completed={Math.min(progressPercent, 100)} />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-supersmall font-bold" style={{ color: progressColor }}>
          RM{totalSpent.toFixed(2)} / RM{budget.amount}
        </p>
        <p className="text-supersmall font-bold">RM{(budget.amount - totalSpent).toFixed(2)} Left</p>
      </div>
    </div>
  );
}

export default BudgetCard;
