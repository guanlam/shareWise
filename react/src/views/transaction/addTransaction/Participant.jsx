import React, { useState, useEffect, useRef } from 'react';
import PopUp from "../../components/PopUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import axiosClient from "../../axios-client";
import CustomButton from "../../components/CustomButton";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


function DropdownOptions({ participantId, onEdit, onDelete }) {
  // No shared ref here, as each instance is separate.
  return (
    <div className="absolute right-5 top-0 bg-white z-20 border rounded-md shadow-lg text-small">
      <div className="absolute right-[-9px] top-[4px] border-x-8 border-x-transparent border-b-8 border-b-white rotate-90"></div>
      <button
        type="button"
        className="block px-3 py-1 hover:bg-gray-100 w-full"
        onClick={() => onEdit(participantId)}
      >
        Edit
      </button>
      <button
        type="button"
        className="block px-3 py-1 hover:bg-gray-100 w-full"
        onClick={() => onDelete(participantId)}
      >
        Delete
      </button>
    </div>
  );
}

function Participant({ onClose }) {
  const [allParticipants, setAllParticipants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipant, setNewParticipant] = useState({ name: "", email: "" });
  
  // For editing
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editParticipant, setEditParticipant] = useState({ name: "", email: "" });

  // Dropdown state per participant (store the ID of the open one)
  const [openParticipant, setOpenParticipant] = useState(null);


  // State for Snackbar visibility and message
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = () => {
    axiosClient
      .get("/participants")
      .then((res) => setAllParticipants(res.data))
      .catch((err) => console.error(err));
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    setNewParticipant({ ...newParticipant, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newParticipant.name || !newParticipant.email) {
      // alert("Please enter all fields");
      setAlertMessage("Please enter all fields");
      setSeverity('error');
      setOpen(true);
      return;
    }
    axiosClient
      .post("/participants", newParticipant)
      .then((res) => {
        fetchParticipants();
        setShowAddForm(false);
        setNewParticipant({ name: "", email: "" });
        setAlertMessage('Participant added successfully!');
        setSeverity('success'); // Set to success
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.data && err.response.data.errors) {
          // Extract error messages from the `errors` object
          const errorMessages = Object.values(err.response.data.errors)
            .flat() // Flatten the array of errors for each field
            .join('\n'); // Join them into a single string
          setAlertMessage(err.response.data.errors.email);
          setSeverity('error');
        }
        
      });
  };

  // Delete participant
  const handleDelete = (participantId) => {
    // Optionally, ask for confirmation before deletion
    // if (window.confirm("Are you sure you want to delete this participant?")) {
      axiosClient
        .delete(`/participants/${participantId}`)
        .then((response) => {
          fetchParticipants();
          setOpenParticipant(null);

          setAlertMessage('Transaction deleted successfully!');
          setSeverity('success'); // Set to success
          console.log(response)
        })
        .catch((err) => console.error("Error deleting participant:", err));
        
    // }
  };

  // When edit button is clicked from dropdown
  const handleEditClick = (participantId) => {
    const participant = allParticipants.find(p => p.id === participantId);
    if (participant) {
      setEditingParticipant(participant);
      setEditParticipant({ name: participant.name, email: participant.email });
      setShowEditForm(true);
      setOpenParticipant(null);
    }
  };

  // Handle changes in edit form
  const handleEditChange = (e) => {
    setEditParticipant({ ...editParticipant, [e.target.name]: e.target.value });
  };

  // Submit updated participant
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editParticipant.name || !editParticipant.email) {
      alert("Please fill all required fields.");
      return;
    }
    axiosClient
      .put(`/participants/${editingParticipant.id}`, editParticipant)
      .then((res) => {
        fetchParticipants();
        setShowEditForm(false);
        setEditingParticipant(null);
        setEditParticipant({ name: "", email: "" });

        setAlertMessage('Participant updated successfully!');
        setSeverity('success'); // Set to success
        console.log(res)
      })
      .catch((err) => console.error("Error editing participant:", err));
      
  };

  // Toggle dropdown for a participant
  const toggleDropdown = (participantId) => {
    setOpenParticipant(openParticipant === participantId ? null : participantId);
  };


  // Open the Snackbar after setting message and severity
    useEffect(() => {
      if (alertMessage && severity) {
        setOpen(true);
      }
    }, [alertMessage, severity]);


  const handleClose = () => {
    setOpen(false); // Close Snackbar
  };

  return (
    <PopUp
      title="Participant"
      onClose={onClose}
      interaction={<GroupAddIcon onClick={handleAddClick} className="cursor-pointer" />}
    >
      <section className="space-y-4">
        {/* Add Participant Form */}
        {showAddForm && (
          <div className="flex border flex-col border-light-gray rounded-lg p-2">
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={newParticipant.name}
              onChange={handleInputChange}
              className="p-2"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={newParticipant.email}
              onChange={handleInputChange}
              className="p-2"
              required
            />
            <div className="flex justify-end space-x-2">
              <CustomButton
                onClick={() => setShowAddForm(false)}
                className="bg-white text-black p-2 rounded"
                text="Cancel"
              />
              <CustomButton
                onClick={handleSubmit}
                className="bg-dark-green text-white p-2 rounded"
                text="Add"
              />
            </div>
          </div>
        )}

        {/* List of Participants */}
        {allParticipants.map((participant) => (
          <div key={participant.id} className="flex relative border border-light-gray rounded-lg p-2">
            <div className="flex-1">
              <h3 className="text-medium font-semibold">{participant.name}</h3>
              <h4 className="text-small">{participant.email}</h4>
            </div>
            <div className="mr-[-.5rem] cursor-pointer">
              <MoreVertIcon onClick={() => toggleDropdown(participant.id)} />
            </div>
            {openParticipant === participant.id && (
              <DropdownOptions 
                participantId={participant.id} 
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            )}
          </div>
        ))}

        {/* Edit Participant Form Pop-Up */}
        {showEditForm && (
          <PopUp title="Edit Participant" onClose={() => { setShowEditForm(false); setEditingParticipant(null); }}>
            <form className="popUp-form flex flex-col gap-4 h-full justify-between" onSubmit={handleEditSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-small text-[#798f86]">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={editParticipant.name}
                    onChange={handleEditChange}
                    className="p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-small text-[#798f86]">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={editParticipant.email}
                    onChange={handleEditChange}
                    className="p-2"
                    required
                  />
                </div>
              </div>
              <div className="text-right">
                <CustomButton className="bg-dark-green text-white" text="Confirm" onClick={handleEditSubmit} />
              </div>
            </form>
          </PopUp>
        )}

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
      </section>
    </PopUp>
  );
}

export default Participant;
