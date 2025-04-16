import React, { useState } from "react";

interface SubjectResult {
  subject: string;
  marks: number;
  pass: boolean;
}

interface StudentData {
  name: string;
  studentId: string;
  totalFees: number;
  feesPaid: number;
  subjects: SubjectResult[];
}

const mockStudentData: StudentData = {
  name: "John Doe",
  studentId: "S12345",
  totalFees: 5000,
  feesPaid: 3500,
  subjects: [
    { subject: "Math", marks: 85, pass: true },
    { subject: "Science", marks: 70, pass: true },
    { subject: "History", marks: 45, pass: false },
  ],
};

const StudentPortal: React.FC = () => {
  const [studentData] = useState<StudentData>(mockStudentData);
  const feesRemaining = studentData.totalFees - studentData.feesPaid;

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <p className="text-lg">Name: {studentData.name}</p>
        <p className="text-lg">ID: {studentData.studentId}</p>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Fee Details</h2>
          <p className="text-lg">Total Fees: ${studentData.totalFees}</p>
          <p className="text-lg">Fees Paid: ${studentData.feesPaid}</p>
          <p className={`text-lg font-bold ${feesRemaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
            Remaining Fees: ${feesRemaining}
          </p>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Results</h2>
          <table className="w-full mt-2 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Subject</th>
                <th className="border p-2">Marks</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentData.subjects.map((subject) => (
                <tr key={subject.subject} className="text-center">
                  <td className="border p-2">{subject.subject}</td>
                  <td className="border p-2">{subject.marks}</td>
                  <td className={`border p-2 ${subject.pass ? 'text-green-600' : 'text-red-600'}`}>
                    {subject.pass ? "Passed" : "Failed"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;