import React from "react";

const Reminders: React.FC = () => {
  const reminders = [
    { id: 1, text: "Team meeting at 10 AM" },
    { id: 2, text: "Project deadline: Jan 15" },
    { id: 3, text: "Submit report by Jan 20" },
  ];

  return (
    <div>
      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
        {reminders.map((reminder) => (
          <li key={reminder.id} className="mb-2">
            {reminder.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reminders;
