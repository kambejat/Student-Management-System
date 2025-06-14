// AddFeeForm.tsx
import React, { useEffect, useState } from "react";
import YearlyFeesForm from "./fees/YearlyFeesForm";
import FeesCollectionForm from "./fees/FeesCollectionForm";
import Modal from "../Modal";
import { AddIcon } from "../../icon/icons";
import axios from "axios";
import { Notification } from "../../../helpers/Notifications";

// Define types for the student and fee
interface Student {
  student_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO date string e.g., "2025-02-01"
  enrollment_year: string; // ISO date string e.g., "2025-02-06"
  grade_level: string; // e.g., "F1", "F2", etc.
  class_id: number;
}

interface Fee {
  student_id: number; // Changed to number for consistency
  student_name?: string;
  amount: string;
  reference_number: string;
  payment_date?: string;
  status?: "Paid" | "Unpaid";
}

interface YearlyFees {
  academic_year: string;
  grade_level: string;
  fee_amount: number
}

interface AddFeeFormProps {
  students: Student[]; // List of students to populate the datalist
  onAddFee: (fee: Fee) => void; // Function to handle form submission
}

const AddFeeForm: React.FC<AddFeeFormProps> = ({ students }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);
  const [yearlyFees, setYearlyFees] = useState<YearlyFees[]>([]);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>("");

  useEffect(() => {
    fetchYearlyFees();
  }, []);

  const fetchYearlyFees = async () => {
    try {
      const response = await axios.get("/api/yearly_fees");
      setYearlyFees(response.data);
      if (response.data.length > 0) {
        setSelectedGradeLevel(response.data[0].grade_level);  // Set default
      }
    } catch (error) {
      setNotification({ message: "Failed to fetch yearly fees", type: "error" });
    }
  };

  const handleFeeSubmit = async (data: any) => {
    try {
      const response = await axios.post("/api/fees", data);
      setNotification({ message: response.data, type: "success" });
    } catch (error) {
      setNotification({ message: `${error}`, type: "error" });
    }
  };

  const selectedFee = yearlyFees.find(fee => fee.grade_level === selectedGradeLevel);

  return (
    <>
      <div className="flex flex-col p-2">
        <div className="sm:flex">
          <div></div>
          <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-[#311fb7] focus:ring-4 focus:ring-[#98a5ff] sm:w-auto"
            >
              <AddIcon className="mr-2 -ml-1 h-5 w-5" />
              Yearly Fees
            </button>
          </div>
        </div>

        <div className="flex flex-col pt-1">
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Left: Fees Collection Form */}
            <div className="md:w-1/2">
              <FeesCollectionForm students={students} onSubmit={handleFeeSubmit} />
            </div>

            {/* Right: Grade Level Selector + Single Fee Card */}
            <div className="md:w-1/2 pt-4 md:pt-0">
              <div className="mb-2">
                <label htmlFor="gradeSelector" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Grade Level
                </label>
                <select
                  id="gradeSelector"
                  className="w-full mt-1 p-1.5 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  value={selectedGradeLevel}
                  onChange={(e) => setSelectedGradeLevel(e.target.value)}
                >
                  {yearlyFees.map((fee, idx) => (
                    <option key={idx} value={fee.grade_level}>
                      {fee.grade_level}
                    </option>
                  ))}
                </select>
              </div>

              {selectedFee ? (
                <div className="p-6 bg-white shadow rounded-2xl dark:bg-gray-900">
                  <dl className="space-y-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Academic Year
                    </dt>
                    <dd className="text-5xl font-light md:text-6xl dark:text-white">
                      {selectedFee.academic_year}
                    </dd>

                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Grade Level
                    </dt>
                    <dd className="text-xl font-medium dark:text-white">
                      {selectedFee.grade_level}
                    </dd>

                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fee Amount
                    </dt>
                    <dd className="flex items-center space-x-1 text-sm font-medium text-green-500 dark:text-green-400">
                      <span>MWK {selectedFee.fee_amount.toLocaleString()}</span>
                      <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M17.25 15.25V6.75H8.75"
                        />
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M17 7L6.75 17.25"
                        />
                      </svg>
                    </dd>
                  </dl>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No fee data for selected grade.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        toggleModal={() => setIsOpen(false)}
        Content={
          <YearlyFeesForm students={students} setIsOpen={() => setIsOpen(false)} />
        }
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};
export default AddFeeForm