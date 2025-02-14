import React from 'react'
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';

function SubmitTransaction({ transaction }) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axiosClient.post("/transactions", transaction);
      alert("Transaction added successfully!");
      
      navigate('/transaction');

    } catch (error) {
      console.error("Failed to add transaction:", error);
      alert("Error adding transaction");
    }
  };

  return (
    <div className='flex justify-between items-center'>
      <button className='border border-black w-[30%] p-4 rounded-md uppercase'>Cancel</button>
      <button onClick={handleSubmit} className='bg-dark-green text-white w-[30%] p-4 rounded-md uppercase'>Save</button>
    </div>
  )
}

export default SubmitTransaction
