import React from "react";

function TransactionInput({ label, value, icon, type = "text", onChange, onClick }) {
  return (
    <div
      className="flex justify-between items-center p-3 bg-white rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-yellow-500">{icon}</span>}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          {type === "date" ? (
            <input
              type="date"
              value={value}
              className="border-none bg-transparent focus:outline-none"
              onChange={(e) => onChange(e.target.value)}
            />
          ) : (
            <p className="text-md font-medium">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionInput;
