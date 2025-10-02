import React, { useState, useEffect } from "react";
import axios from "axios";
import { ExportIcon, ImportIcon } from "../../../icon/icons";

type ImportExportGradesProps = {
  getGrades: () => void;
};

const ImportExportGrades: React.FC<ImportExportGradesProps> = ({
  getGrades,
}) => {
  const [subjectId, setSubjectId] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");

  // For datalist options
  const [subjects, setSubjects] = useState<
    { subject_id: string; name: string }[]
  >([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchSubjectsAndStudents();
  }, []);

  const fetchSubjectsAndStudents = async () => {
    try {
      const [subjectsRes, studentsRes] = await Promise.all([
        axios.get("/api/subjects"),
        axios.get("/api/students"),
      ]);
      setSubjects(subjectsRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error("Error fetching data for datalists:", error);
    }
  };

  const handleExport = async () => {
    if (!subjectId) {
      alert("Please enter a Subject ID");
      return;
    }

    try {
      // 1. Fetch subject name
      const subjectRes = await axios.get(`/api/subjects/${subjectId}`);
      const subjectName = subjectRes.data.name || `subject_${subjectId}`;

      // 2. Fetch the export template as a blob
      const response = await axios.get(`/api/grades/export/${subjectId}`, {
        responseType: "blob",
      });

      // 3. Trigger file download with proper filename
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `grade_import_template_${subjectName}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please check the Subject ID.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").slice(1); // skip header

      const jsonData = lines
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const values = line
            .split(",")
            .map((s) => s.replace(/(^"|"$)/g, "").replace(/""/g, '"'));

          return {
            student_id: values[0]?.trim(),
            subject_id: values[2]?.trim(),
            class_id: values[4]?.trim(),
            term: values[5]?.trim(),
            exam_type: values[6]?.trim(),
            score: parseFloat(values[7]) || 0,
            max_score: parseFloat(values[8]) || 100,
            remarks: values[9]?.trim() || undefined,
            exam_date: values[10]?.replace(/\r/g, "").trim() || undefined,
          };
        });

      try {
        const response = await axios.post("/api/grades/import", jsonData, {
          headers: { "Content-Type": "application/json" },
        });
        getGrades();
        alert(response.data.message || "Import successful");
      } catch (error: any) {
        console.log("Import failed:", error);
        alert(
          "Import failed: " + error?.response?.data?.message || "Unknown error"
        );
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <h2 className="pb-2 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">Import / Export Grades Data</h2>

      <div className="flex flex-wrap items-center gap-3">
        {/* Subject input */}
        <div>
          <input
            type="text"
            placeholder="Subject ID or Name"
            list="subject-list"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white w-48"
          />
          <datalist id="subject-list">
            {subjects.map((subject) => (
              <option key={subject.subject_id} value={subject.subject_id}>
                {subject.name}
              </option>
            ))}
          </datalist>
        </div>

        {/* Student input */}
        <div>
          <input
            type="text"
            placeholder="Student ID or Name"
            list="student-list"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white w-48"
          />
          <datalist id="student-list">
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </datalist>
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          <ExportIcon className="w-4 h-4 mr-1" /> Export
        </button>

        {/* Import input */}
        <label className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-[#311fb7] focus:ring-4 focus:ring-[#98a5ff] sm:w-auto dark:bg-primary-600 dark:hover:bg-[#3b22e0] dark:focus:ring-[#311fb7] cursor-pointer">
          <ImportIcon className="w-4 h-4" /> Import
          <input
            type="file"
            accept=".csv .xlsx"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default ImportExportGrades;
