import React from 'react';

function EditProfile() {
  return (
    <div className="p-4 rounded-lg">
      <h2 className="font-bold text-lg mb-4">Edit Profile</h2>
      <form>
        <div className="mb-4">
          <label className="block mb-1">Name:</label>
          <input type="text" className="w-full border p-2 rounded" placeholder="Enter name" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <input type="email" className="w-full border p-2 rounded" placeholder="Enter email" />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
}

export default EditProfile;
