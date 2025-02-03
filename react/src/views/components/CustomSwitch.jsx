import React from 'react';
import Switch from '@mui/material/Switch';

function CustomSwitch({ checked, onChange }) {
  return (
    <Switch
      checked={checked}  // Controlled by parent
      onChange={onChange}  // Handle toggle in parent
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: '#1c312c',  // Dark Green when checked
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: '#1c312c',  // Track color when checked (dark green)
        },
        '& .MuiSwitch-switchBase': {
          color: '#ebf6f7',  // Light Green when unchecked
        },
        '& .MuiSwitch-track': {
          backgroundColor: '#ebf6f7',  // Track color when unchecked
        },
      }}
    />
  );
}

export default CustomSwitch;
