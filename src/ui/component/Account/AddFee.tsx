// AddFeeForm.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";

// Define types for the student and fee
interface Student {
  student_id: number;
  name: string;
}

interface Fee {
  student_id: number; // Changed to number for consistency
  student_name?: string;
  amount: string;
  reference_number: string;
  payment_date?: string;
  status?: "Paid" | "Unpaid";
}

interface AddFeeFormProps {
  students: Student[]; // List of students to populate the datalist
  onAddFee: (fee: Fee) => void; // Function to handle form submission
}

const AddFeeForm: React.FC<AddFeeFormProps> = ({ students, onAddFee }) => {
  const [newFee, setNewFee] = useState<Fee>({
    student_id: 0, // Ensure student_id is a number
    amount: "", // Amount should be a string to handle inputs easily
    reference_number: "",
  });

  const handleAddFee = (e: FormEvent) => {
    e.preventDefault();
    if (newFee.student_id && newFee.amount && newFee.reference_number) {
      onAddFee(newFee);
      setNewFee({ student_id: 0, amount: "", reference_number: "" }); // Reset form after submit
    }
  };

  const handleStudentNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const studentName = e.target.value;
    const student = students.find((s) => s.name === studentName);
    if (student) {
      setNewFee((prevState) => ({
        ...prevState,
        student_id: student.student_id, // Use student_id for consistency
        student_name: student.name, // Optionally store student name for reference
      }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Add Fee</h2>
      <form onSubmit={handleAddFee}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Student Name</label>
          <input
            list="studentList"
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={
              students.find((student) => student.student_id === newFee.student_id)?.name || ""
            }
            onChange={handleStudentNameChange}
            required
          />
          <datalist id="studentList">
            {students.map((student) => (
              <option key={student.student_id} value={student.name} />
            ))}
          </datalist>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={newFee.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Reference Number</label>
          <input
            type="text"
            name="reference_number"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={newFee.reference_number}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md">
          Add Fee
        </button>
      </form>
    </div>
  );
};

export default AddFeeForm;
