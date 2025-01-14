import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

interface Student {
  id: string;
  name: string;
}

interface Fee {
  student_id: string;
  amount: string;
  reference_number: string;
  paid: boolean;
  payment_date?: string;
}

interface Expense {
  type: string;
  amount: string;
  description: string;
  expense_date?: string;
}

const AccountManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fees' | 'expenses' | 'addFees' | 'addExpenses'>('fees');
  const [activeFeeTab, setActiveFeeTab] = useState<'paid' | 'unpaid'>('paid');
  const [fees, setFees] = useState<Fee[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newFee, setNewFee] = useState<Fee>({ student_id: '', amount: '', reference_number: '', paid: false });
  const [newExpense, setNewExpense] = useState<Expense>({ type: '', amount: '', description: '' });
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/students'); // Replace with your API endpoint
        setStudents(response.data); // Assuming response.data contains the student array
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const paidFees = fees.filter(fee => fee.paid);
  const unpaidFees = fees.filter(fee => !fee.paid);

  const handleTabClick = (tab: 'fees' | 'expenses' | 'addFees' | 'addExpenses') => {
    setActiveTab(tab);
  };

  const handleFeeTabClick = (tab: 'paid' | 'unpaid') => {
    setActiveFeeTab(tab);
  };

  const handleAddFee = (e: FormEvent) => {
    e.preventDefault();
    setFees([...fees, { ...newFee, paid: false }]);
    setNewFee({ student_id: '', amount: '', reference_number: '', paid: false });
  };

  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault();
    setExpenses([...expenses, newExpense]);
    setNewExpense({ type: '', amount: '', description: '' });
  };

  const handleStudentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const studentName = e.target.value;
    const selectedStudent = students.find(student => student.name.toLowerCase() === studentName.toLowerCase());
    if (selectedStudent) {
      setNewFee({ ...newFee, student_id: selectedStudent.id });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Tabs */}
      <div className="flex space-x-4">
        <button
          className={`py-2 px-4 rounded ${activeTab === 'fees' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabClick('fees')}
        >
          Fees
        </button>
        <button
          className={`py-2 px-4 rounded ${activeTab === 'expenses' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabClick('expenses')}
        >
          Expenses
        </button>
        <button
          className={`py-2 px-4 rounded ${activeTab === 'addFees' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabClick('addFees')}
        >
          Add Fee
        </button>
        <button
          className={`py-2 px-4 rounded ${activeTab === 'addExpenses' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabClick('addExpenses')}
        >
          Add Expense
        </button>
      </div>

      {/* Fees Content */}
      {activeTab === 'fees' && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Fees</h2>

          {/* Fee Tabs (Paid vs Unpaid) */}
          <div className="flex space-x-4 mb-4">
            <button
              className={`py-2 px-4 rounded ${activeFeeTab === 'paid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleFeeTabClick('paid')}
            >
              Paid Fees
            </button>
            <button
              className={`py-2 px-4 rounded ${activeFeeTab === 'unpaid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleFeeTabClick('unpaid')}
            >
              Unpaid Fees
            </button>
          </div>

          {/* Paid Fees Table */}
          {activeFeeTab === 'paid' && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Paid Fees</h3>
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="py-2 px-4">Student ID</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Reference Number</th>
                    <th className="py-2 px-4">Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paidFees.map((fee, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4">{fee.student_id}</td>
                      <td className="py-2 px-4">${fee.amount}</td>
                      <td className="py-2 px-4">{fee.reference_number}</td>
                      <td className="py-2 px-4">{fee.payment_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Unpaid Fees Table */}
          {activeFeeTab === 'unpaid' && (
            <div>
              <h3 className="text-lg font-semibold">Unpaid Fees</h3>
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="py-2 px-4">Student ID</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Reference Number</th>
                    <th className="py-2 px-4">Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {unpaidFees.map((fee, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4">{fee.student_id}</td>
                      <td className="py-2 px-4">${fee.amount}</td>
                      <td className="py-2 px-4">{fee.reference_number}</td>
                      <td className="py-2 px-4">{fee.payment_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Expenses Content */}
      {activeTab === 'expenses' && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Expenses</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="py-2 px-4">Expense Type</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Expense Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index}>
                  <td className="py-2 px-4">{expense.type}</td>
                  <td className="py-2 px-4">${expense.amount}</td>
                  <td className="py-2 px-4">{expense.description}</td>
                  <td className="py-2 px-4">{expense.expense_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Fee Form */}
      {activeTab === 'addFees' && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Add Fee</h2>
          <form onSubmit={handleAddFee}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Student Name</label>
              <input
                list="studentList"
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={newFee.student_id} // Changed to `student_id`
                onChange={handleStudentNameChange}
                required
              />
              <datalist id="studentList">
                {students.map((student) => (
                  <option key={student.id} value={student.name} />
                ))}
              </datalist>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={newFee.amount}
                onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Reference Number</label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={newFee.reference_number}
                onChange={(e) => setNewFee({ ...newFee, reference_number: e.target.value })}
              />
            </div>
            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md">
              Add Fee
            </button>
          </form>
        </div>
      )}

      {/* Add Expense Form */}
      {activeTab === 'addExpenses' && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Add Expense</h2>
          <form onSubmit={handleAddExpense}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Expense Type</label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={newExpense.type}
                onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md">
              Add Expense
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
