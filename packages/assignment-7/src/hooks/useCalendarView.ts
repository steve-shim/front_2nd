import { useEffect, useState } from "react";
import { fetchHolidays } from "../apis/fetchHolidays";

export const useCalendarView = () => {
  const [view, setView] = useState<"week" | "month">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === "week") {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      } else if (view === "month") {
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      }
      return newDate;
    });
  };

  const holidays = fetchHolidays(currentDate);

  return { view, setView, currentDate, setCurrentDate, holidays, navigate };
};
