'use client';

import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Label } from '@/shared/ui/label';
import { useState } from 'react';

interface CalendarPickerProps {
  fromDate?: Date;
  toDate?: Date;
  setFromDate: (date: Date | undefined) => void;
}

const CalendarPicker = ({
  fromDate,
  toDate,
  setFromDate,
}: CalendarPickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(fromDate);

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setFromDate(date);
  };

  return (
    <div
      className="mt-2 w-full bg-white shadow-lg rounded-2xl p-4 grid gap-4"
      onClick={(e) => e.stopPropagation()}
    >
      <Label htmlFor="calendar" className="text-lg font-semibold">
        Select Date
      </Label>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        disabled={(date: Date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today;
        }}
        className="w-full rounded-lg border"
      />

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => handleSelect(undefined)}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default CalendarPicker;
