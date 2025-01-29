import React from "react";

const Notification = ({ message, type }) => {
  if (!message) return null;

  const styles = {
    success: "css-input !bg-teal-100 border-t-4 !border-teal-500 rounded-b !text-teal-900 px-4 py-3 shadow-md",
    error: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative",
  };

  return (
    <div className={styles[type]} role="alert">
      <p>{message}</p>
    </div>
  );
};

export default Notification;
