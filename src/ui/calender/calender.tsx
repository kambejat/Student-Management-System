import React, { useState } from "react";

interface Event {
  date: string; // YYYY-MM-DD format
  title: string;
  description?: string;
}

const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const EventCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sample events
  const events: Event[] = [
    { date: "2024-01-01", title: "New Year Celebration" },
    {
      date: "2024-01-15",
      title: "Team Meeting",
      description: "Discuss project milestones",
    },
    { date: "2024-02-14", title: "Valentine's Day Event" },
  ];

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
    setSelectedDate(""); // Clear selected date when navigating months
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(year, month);

    const calendarDays: JSX.Element[] = [];
    // Add empty slots for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="border py-1"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const hasEvent = events.some((event) => event.date === date);

      calendarDays.push(
        <div
          key={date}
          onClick={() => handleDateClick(date)}
          className={`py-1 text-center cursor-pointer text-sm ${
            hasEvent ? "bg-[#8b1031]" : ""
          } ${
            selectedDate === date
              ? "focus:outline-none  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:bg-indigo-500 hover:bg-indigo-500 text-base w-10 h-10 flex items-center justify-center font-medium text-white bg-indigo-700 rounded-full"
              : ""
          }`}
        >
          {day}
        </div>
      );
    }

    return calendarDays;
  };

  // Find events for the selected date
  const selectedEvents = selectedDate
    ? events.filter((event) => event.date === selectedDate)
    : [];

  return (
    <div className="max-w-sm w-full shadow-lg">
      <div className="md:p-8 p-5 dark:bg-gray-800 bg-white rounded-t">
        <div className="px-4 flex items-center justify-between">
          {/* Month Navigation */}
          <span
            tabIndex={0}
            className="focus:outline-none  text-base font-bold dark:text-gray-100 text-gray-800"
          >
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </span>
          <div className="flex items-center">
            <button
              aria-label="calendar backward"
              onClick={() => handleMonthChange("prev")}
              className="focus:text-gray-400 hover:text-gray-400 text-gray-800 dark:text-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-chevron-left"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <polyline points="15 6 9 12 15 18" />
              </svg>
            </button>
            <button
              aria-label="calendar forward"
              onClick={() => handleMonthChange("next")}
              className="focus:text-gray-400 hover:text-gray-400 ml-3 text-gray-800 dark:text-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler  icon-tabler-chevron-right"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex items-center justify-between pt-12 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <th key={day}>
                      <div className="w-full flex justify-center">
                        <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">
                          {day}
                        </p>
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
          </table>
        </div>
        <div className="grid grid-cols-7 mt-0 gap-[2px] w-full max-w-xs text-xs">
          {renderCalendar()}
        </div>

        {/* Display Events */}
        <div className="md:py-8 py-5 md:px-16 px-5 dark:bg-gray-700 bg-gray-50 rounded-b">
          {selectedEvents.length > 0 ? (
            <div className="px-4">
              {selectedEvents.map((event, index) => (
                <div
                  key={index}
                  className="border-b pb-4 border-gray-400 border-dashed"
                >
                  <p className="text-xs font-light leading-3 text-gray-500 dark:text-gray-300">
                    {event.date}
                  </p>
                  <a
                    tabIndex={0}
                    className="focus:outline-none text-lg font-medium leading-5 text-gray-800 dark:text-gray-100 mt-2"
                  >
                    {event.title}
                  </a>
                  <p className="text-sm pt-2 leading-4 leading-none text-gray-600 dark:text-gray-300">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            selectedDate && (
              <p className="mt-2 text-gray-500">No events for this date.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
