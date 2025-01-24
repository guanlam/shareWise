import React from 'react';

function ChangePassword() {
  return (
    <div className="p-4 rounded-lg">
      <h2 className="font-bold text-lg mb-4">Change Password</h2>
      <form>
        <div className="mb-4">
          <label className="block mb-1">Current Password:</label>
          <input type="password" className="w-full border p-2 rounded" placeholder="Enter current password" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">New Password:</label>
          <input type="password" className="w-full border p-2 rounded" placeholder="Enter new password" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Confirm New Password:</label>
          <input type="password" className="w-full border p-2 rounded" placeholder="Confirm new password" />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Change Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;
