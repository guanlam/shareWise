import React from 'react'
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';

function SubmitTransaction({ transaction, action }) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (action === "add") {
        // Create a new transaction
        await axiosClient.post("/transactions", transaction);
        alert("Transaction added successfully!");
      } else if (action === "edit") {
        // Update the existing transaction
        await axiosClient.put(`/transactions/${transaction.id}`, transaction); // Assuming `transaction.id` exists
        alert("Transaction updated successfully!");
      }

      // Navigate to the transaction list page after the operation
      navigate('/transaction');

    } catch (error) {
      console.error("Failed to submit transaction:", error);
      alert("Error submitting transaction");
    }
  };

  return (
    <div className='flex justify-between items-center'>
      <button className='border border-black w-[30%] p-4 rounded-md uppercase'>Cancel</button>
      <button onClick={handleSubmit} className='bg-dark-green text-white w-[30%] p-4 rounded-md uppercase'>
        {action === "add" ? "Save" : "Update"} {/* Dynamically change button text */}
      </button>
    </div>
  )
}

export default SubmitTransaction;
