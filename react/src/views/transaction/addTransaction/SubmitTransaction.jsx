import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function SubmitTransaction({ transaction, action }) {
  const navigate = useNavigate();

  // State for Snackbar visibility and message
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // 'success' or 'error'

  const handleSubmit = async () => {
    try {
      if (action === 'add') {
        // Create a new transaction
        await axiosClient.post('/transactions', transaction);
        setAlertMessage('Transaction added successfully!');
        setSeverity('success'); // Set to success
      } else if (action === 'edit') {
        // Update the existing transaction
        await axiosClient.put(`/transactions/${transaction.id}`, transaction);
        setAlertMessage('Transaction updated successfully!');
        setSeverity('success'); // Set to success
      }

      // Navigate to the transaction list page after the operation
      navigate('/transaction');
      
      // Open the success Snackbar
      setOpen(true);
    } catch (error) {
      console.error('Failed to submit transaction:', error);
      
      if (error.response && error.response.data && error.response.data.errors) {
        // Extract error messages from the `errors` object
        const errorMessages = Object.values(error.response.data.errors)
          .flat() // Flatten the array of errors for each field
          .join('\n'); // Join them into a single string

        setAlertMessage(errorMessages); // Set error messages to be displayed
        setSeverity('error'); // Set to error
      } else {
        setAlertMessage('Error submitting transaction');
        setSeverity('error'); // Generic error message
      }

      // Open the error Snackbar
      setOpen(true);
    }
  };

  const handleCancel = () => {
    navigate('/transaction'); // Navigate to the transaction list
  }

  const handleClose = () => {
    setOpen(false); // Close Snackbar
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <button onClick={handleCancel} className='border border-black w-[30%] p-4 rounded-md uppercase'>Cancel</button>
        <button onClick={handleSubmit} className='bg-dark-green text-white w-[30%] p-4 rounded-md uppercase'>
          {action === 'add' ? 'Save' : 'Update'}
        </button>
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

export default SubmitTransaction;
