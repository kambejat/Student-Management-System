import React from "react";
import Card from "../../ui/card/Card";
import { EarningsIcon, ParentIcon, StudentIcon, TeacherIcon } from "../../ui/icon/icons";
import EarningChart from "../../ui/charts/Earnings";
import ExpensesChart from "../../ui/charts/Expenses";
import StudentsChart from "../../ui/charts/Students";
import EventCalendar from "../../ui/calender/calender";
import Reminders from "../../ui/notifications/reminders";

const Home: React.FC = () => {
  return (
    <>
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Students" count={100} icon={<StudentIcon />} />
          <Card title="Teachers" count={50} icon={<TeacherIcon />} />
          <Card title="Parents" count={20} icon={<ParentIcon />} />
          <Card title="Earnings" count={15} icon={<EarningsIcon />} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">Earnings</h3>
          <EarningChart />
        </div>
        <div className="shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">Expenses</h3>
          <ExpensesChart />
        </div>
        <div className="shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">Students</h3>
          <StudentsChart />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="shadow-lg p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">Event Calendar</h3>
            <EventCalendar />
          </div>
          <div className="shadow-lg p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">Reminders</h3>
            <Reminders />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
