import React, { useEffect, useState } from "react";
import Card from "../../ui/card/Card";
import { EarningsIcon, ParentIcon, StudentIcon, TeacherIcon } from "../../ui/icon/icons";
import EarningChart from "../../ui/charts/Earnings";
import ExpensesChart from "../../ui/charts/Expenses";
import StudentsChart from "../../ui/charts/Students";
import EventCalendar from "../../ui/calender/calender";
import Reminders from "../../ui/notifications/reminders";
import axios from "axios";
import { Teacher } from "../../types/types";

interface Parent {
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface Student {
  student_id: number;
  user_id?: number | "";
  first_name: string;
  last_name: string;
  parent_name: string;
  phone_number: string;
}

const API_URL = "/api";

const Home: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(()=> {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${API_URL}/students`);
        setStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    const fetchParents = async ()=>{
      try {
        const response = await axios.get(`${API_URL}/parents`);
        setParents(response.data)
      } catch (error) {
        console.log("Failed to fetch parents.", error)
      }
    }

    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${API_URL}/teachers`)
        setTeachers(response.data)
      } catch (error) {
        console.log("Failed to fetch teachers", error)
      }
    }
  
    fetchStudents();
    fetchParents();
    fetchTeachers();
  },[])
  return (
    <>
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Students" count={students.length} icon={<StudentIcon />} />
          <Card title="Teachers" count={teachers.length} icon={<TeacherIcon />} />
          <Card title="Parents" count={parents.length} icon={<ParentIcon />} />
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
