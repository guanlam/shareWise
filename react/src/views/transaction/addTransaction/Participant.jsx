import React, { useEffect, useState } from "react";
import PopUp from "../../components/PopUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import axiosClient from "../../axios-client";
import CustomButton from "../../components/CustomButton";

function Participant({ onClose }) {
  const [allParticipants, setAllParticipants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipant, setNewParticipant] = useState({ name: "", email: "" });

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
      alert("Please enter all fields");
      return;
    }

    axiosClient
      .post("/participants", newParticipant)
      .then((res) => {
        fetchParticipants(); // Refetch the updated list
        setShowAddForm(false); // Hide form
        setNewParticipant({ name: "", email: "" }); // Reset form fields
      })
      .catch((err) => console.error(err));
  };

  return (
    <PopUp
      title="Participant"
      onClose={onClose}
      interaction={
        <GroupAddIcon onClick={handleAddClick} className="cursor-pointer" />
      }
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
                        onClick={handleSubmit} // Call handleSubmit manually
                        className="bg-dark-green text-white p-2 rounded"
                        text="Add"
                    />
                </div>
            </div>
            )}


        {/* List of Participants */}
        {allParticipants.map((participant) => (
          <div key={participant.id} className="flex border border-light-gray rounded-lg p-2">
            <div className="flex-1">
              <h3 className="text-medium font-semibold">{participant.name}</h3>
              <h4 className="text-small">{participant.email}</h4>
            </div>
            <div className="mr-[-.5rem]">
              <MoreVertIcon />
            </div>
          </div>
        ))}
      </section>
    </PopUp>
  );
}

export default Participant;
