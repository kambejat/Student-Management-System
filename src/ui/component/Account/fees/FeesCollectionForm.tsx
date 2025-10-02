import React, { useState } from "react";

type Student = {
  student_id: number;
  first_name: string;
  last_name: string;
  enrollment_year: string;
  grade_level: string;
};

type FeeFormData = {
  student_id: number;
  reference_number: string;
  amount_paid: number;
  payment_date: string;
  payment_method: string;
  academic_year: string;
  grade_level: string;
};

type FeesCollectionFormProps = {
  students: Student[];
  onSubmit: (data: FeeFormData) => void;
};

export default function FeesCollectionForm({
  students,
  onSubmit,
}: FeesCollectionFormProps) {
  const [formData, setFormData] = useState<FeeFormData>({
    student_id: 0,
    reference_number: "",
    amount_paid: 0,
    payment_date: new Date().toISOString().slice(0, 10),
    payment_method: "",
    academic_year: "",
    grade_level: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "student_id" || name === "amount_paid" ? Number(value) : value,
    }));
  };

  const handleStudentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Try matching by full name
    const student = students.find(
      (s) =>
        `${s.first_name} ${s.last_name}`.toLowerCase() === input.toLowerCase()
    );

    if (student) {
      setFormData((prev) => ({
        ...prev,
        student_id: student.student_id,
        academic_year: student.enrollment_year.slice(0, 4), // e.g. "2025"
        grade_level: student.grade_level,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form (optional)
    setFormData({
      student_id: 0,
      reference_number: "",
      amount_paid: 0,
      payment_date: new Date().toISOString().slice(0, 10),
      payment_method: "",
      academic_year: "",
      grade_level: "",
    });
  };

  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg shadow p-2">
      <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
        Capture Individual Fee
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Student
            </label>
            <input
              list="students"
              onChange={handleStudentInput}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Select student by name"
              required
            />
            <datalist id="students">
              {students.map((s) => (
                <option
                  key={s.student_id}
                  value={`${s.first_name} ${s.last_name}`}
                />
              ))}
            </datalist>
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Reference Number
            </label>
            <input
              type="text"
              name="reference_number"
              value={formData.reference_number}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Amount Paid
            </label>
            <input
              type="number"
              name="amount_paid"
              value={formData.amount_paid}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Payment Date
            </label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Payment Method
            </label>
            <input
              type="text"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Academic Year
            </label>
            <input
              type="text"
              name="academic_year"
              value={formData.academic_year}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              readOnly
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Grade Level
            </label>
            <input
              type="text"
              name="grade_level"
              value={formData.grade_level}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              readOnly
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full text-center inline-flex justify-center items-center px-1 py-1.5 mt-2 text-sm font-medium text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
        >
          Collect
        </button>
      </form>
    </section>
  );
}
