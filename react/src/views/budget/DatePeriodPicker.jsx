import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

// Modal pop-up for selecting a date range with shortcuts
const DatePeriodPickerPopup = ({ initialRange, onSelect, onClose }) => {
  const [range, setRange] = useState(
    initialRange || {
      startDate: new Date(),
      endDate: addDays(new Date(), 6),
      key: 'selection',
    }
  );

  const [activeShortcut, setActiveShortcut] = useState(null);

  // Update the local range when the user selects a date
  const handleSelect = (ranges) => {
    setRange(ranges.selection);
  };

  // Shortcut: This Week
  const setThisWeek = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    setRange({
      startDate: weekStart,
      endDate: weekEnd,
      key: 'selection',
    });
    setActiveShortcut('week');

  };

  // Shortcut: This Month
  const setThisMonth = () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    setRange({
      startDate: monthStart,
      endDate: monthEnd,
      key: 'selection',
    });
    setActiveShortcut('month');

  };

  // Shortcut: This Year
  const setThisYear = () => {
    const today = new Date();
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);
    setRange({
      startDate: yearStart,
      endDate: yearEnd,
      key: 'selection',
    });
    setActiveShortcut('year');

  };

  const handleConfirm = () => {
    onSelect(range);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white p-4 rounded-lg max-w-md mx-auto">
        <div className="flex gap-4 mb-2 justify-between">
            
          <button
            type="button"
            onClick={setThisWeek}
            className={`rounded-sm py-2 px-3 ${activeShortcut === 'week' ? 'bg-dark-green text-white' : 'border border-gray-300'}`}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={setThisMonth}
            className={`rounded-sm py-2 px-3 ${activeShortcut === 'month' ? 'bg-dark-green text-white' : 'border border-gray-300'}`}
          >
            This Month
          </button>
          <button
            type="button"
            onClick={setThisYear}
            className={`rounded-sm py-2 px-3 ${activeShortcut === 'year' ? 'bg-dark-green text-white' : 'border border-gray-300'}`}
          >
            This Year
          </button>
        </div>
        <DateRange
          editableDateInputs={true}
          onChange={handleSelect}
          moveRangeOnFirstSelection={false}
          ranges={[range]}
        />
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-3xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-dark-green text-white rounded-3xl"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DatePeriodPicker({ onSelectRange }) {
  const [selectedRange, setSelectedRange] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleOpen = () => setShowPicker(true);
  const handleClose = () => setShowPicker(false);
  const handleSelect = (range) => {
    setSelectedRange(range);
    if (onSelectRange) {
      onSelectRange(range);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleOpen}
        className="py-2 focus:outline-none w-full text-left"
      >
        {selectedRange
          ? `${format(selectedRange.startDate, 'd/M/yyyy')} - ${format(selectedRange.endDate, 'd/M/yyyy')}`
          : 'Select Budget Period'}
      </button>
      {showPicker && (
        <DatePeriodPickerPopup
          initialRange={selectedRange}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
