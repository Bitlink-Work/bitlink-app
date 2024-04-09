import React, { useState } from "react";
import { Calendar } from "react-datepicker2";

const SelectDateField = () => {
  const [selectedDate, setSelectedDate] = useState<any>(null);

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <Calendar value={selectedDate} onChange={handleDateChange} />
      <input
        type="text"
        value={selectedDate ? selectedDate.format("DD/MM/YYYY") : ""}
        readOnly
      />
    </div>
  );
};

export default SelectDateField;
