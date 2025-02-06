import React, { useState } from "react";

function Calculator({ transaction, setTransaction, setActivePanel }) {
  const [expression, setExpression] = useState("");
  

  const handleClick = (value) => {
    if (value === "=") {
      try {
        const total = eval(expression);
        setTransaction((prev) => ({ ...prev, amount: total }));
        setExpression(total);
        //setActivePanel("category"); // Return to category selection
      } catch (error) {
        alert("Invalid calculation");
        setExpression("");
        setTransaction((prev) => ({ ...prev, amount: 0 }));
      }
    } else if (value === "X") {
      setExpression("");
      setTransaction((prev) => ({ ...prev, amount: 0 }));
    } else {
      setExpression(expression + value);
    }
  };


  const buttons = [
    { value: "7", colSpan: 1 },
    { value: "8", colSpan: 1 },
    { value: "9", colSpan: 1 },
    { value: "+", colSpan: 1 },
    { value: "X", colSpan: 1, rowSpan: 2 }, // X spans 2 rows
    { value: "4", colSpan: 1 },
    { value: "5", colSpan: 1 },
    { value: "6", colSpan: 1 },
    { value: "-", colSpan: 1 },
    { value: "1", colSpan: 1 },
    { value: "2", colSpan: 1 },
    { value: "3", colSpan: 1 },
    { value: "*", colSpan: 1 },
    { value: "=", colSpan: 1, className: "bg-dark-green text-white", rowSpan: 2 }, // OK spans 2 rows
    { value: "00", colSpan: 1 },
    { value: "0", colSpan: 1 },
    { value: ".", colSpan: 1 },
    { value: "/", colSpan: 1 },
  ];


  return (
    <div className="bg-light-cyan rounded-xl p-6 size-full flex flex-col justify-between">
      <h2 className="text-medium font-semibold mb-2 border-b-2">{expression || 0}</h2>
      <div className="grid grid-cols-5 gap-4 mt-[8%]">
        {buttons.map((btn, index) => (
            <button
            key={index}
            className={`border border-black p-4 rounded-xl all-center ${btn.className || ""}`}
            style={{
                gridColumn: `span ${btn.colSpan}`,
                gridRow: btn.rowSpan ? `span ${btn.rowSpan}` : undefined,
            }}
            onClick={() => handleClick(btn.value)}
            >
            {btn.value}
            </button>
        ))}
        </div>
    </div>
  );
}

export default Calculator;
