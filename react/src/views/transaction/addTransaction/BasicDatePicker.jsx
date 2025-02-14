import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function BasicDatePicker({ date, setTransaction }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={date ? dayjs(date) : null}
        format="DD/MM/YYYY"
        onChange={(newDate) => {
          setTransaction((prev) => ({
            ...prev,
            date: newDate ? dayjs(newDate).format("YYYY-MM-DD") : prev.date,
          }));
        }}
        sx={{
          "& .MuiInputBase-root fieldset": { border: "none" },
          "& .MuiInputBase-input": {
            color: "black",
            paddingLeft: "0",
            paddingRight: "0",
            marginRight: "0",
          },
        }}
      />
    </LocalizationProvider>
  );
}
