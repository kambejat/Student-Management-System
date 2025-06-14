import { useState } from "react";
import axios from "axios";
import { Notification } from "../../../../helpers/Notifications";

interface Student {
  student_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  enrollment_year: string;
  grade_level: string;
  class_id: number;
}

type YearlyFeesFormProps = {
  students: Student[];
  setIsOpen: () => void;
};

export default function YearlyFeesForm({ students, setIsOpen }: YearlyFeesFormProps) {
  const API_URL = "/api";
  const currentYear = new Date().getFullYear().toString();

  const [academicYear, setAcademicYear] = useState(currentYear);
  const [gradeLevel, setGradeLevel] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  // Extract unique enrollment years
  const uniqueEnrollmentYears = Array.from(
    new Set(students.map((s) => s.enrollment_year.slice(0, 4)))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      academic_year: academicYear,
      grade_level: gradeLevel,
      fee_amount: parseFloat(feeAmount),
    };
    await axios.post(`${API_URL}/yearly_fees`, payload);
    setIsOpen()
    setNotification({ message: "Yearly fee saved", type:"success"})
  };

  return (
    <>
    <section className="bg-white dark:bg-gray-900">
  <div className="py-1 px-1 mx-auto max-w-2xl lg:py-4">
    <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
      Add Fee Structure
    </h2>
    <form onSubmit={handleSubmit} className="bg-shadow">
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-6">
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
            Academic Year
          </label>
          <input
            list="academic-years"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder={currentYear}
            required
          />
          <datalist id="academic-years">
            {uniqueEnrollmentYears.map((year) => (
              <option key={year} value={year} />
            ))}
          </datalist>
        </div>

        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
            Grade Level
          </label>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required
          >
            <option value="">Select Form</option>
            <option value="F1">Form 1</option>
            <option value="F2">Form 2</option>
            <option value="F3">Form 3</option>
            <option value="F4">Form 4</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
            Fee Amount
          </label>
          <input
            type="number"
            value={feeAmount}
            onChange={(e) => setFeeAmount(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Enter fee amount"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex text-center justify-center w-full items-center p-1.5 mt-2 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
      >
        Save
      </button>
    </form>

    {notification && (
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(null)}
      />
    )}
  </div>
</section>

    </>
  );
}
