import React, { useEffect, useState } from "react";
import GradesTable from "./GradesTable";
import axios from "axios";
import { Grade } from "../../../../types/types";
import useAuth from "../../../../context/useAuth";

const GradesPage: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [user, token] = useAuth();

  if (!user) {
    return;
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(config);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axios.get(`/api/grades`, config);
      setGrades(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const handleDelete = async (grade_id: number) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) return;
    try {
      await axios.delete(`/api/grades/${grade_id}`);
      setGrades((prev) => prev.filter((g) => g.grade_id !== grade_id));
    } catch (error) {
      console.error("Error deleting grade:", error);
    }
  };

  return (
    <div className="container mx-auto p-2">
      <GradesTable
        grades={grades}
        handleDelete={handleDelete}
        getGrades={fetchGrades}
      />
    </div>
  );
};

export default GradesPage;
