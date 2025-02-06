import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';  // Import dayjs for date handling

export default function BasicDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
            <DatePicker
            
            value={dayjs()}  // Set the default date to current date
            format="DD/MM/YYYY"
            sx={{
                '& .MuiInputBase-root': {
                    '& fieldset': {
                        border: 'none',
                        
                    }
                },
                '& .MuiInputBase-input': {
                color: 'black',
                paddingLeft:'0',
                paddingRight:'0',
                marginRight:'0',
                
                
                
                },
                
            }}
            />
        </DemoContainer>
    </LocalizationProvider>
  );
}
