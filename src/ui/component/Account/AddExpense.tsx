// AddExpenseForm.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";

// Define the type for the newExpense state
interface Expense {
  type: string;
  amount: number;
  description: string;
}

interface AddExpenseFormProps {
  onAddExpense: (expense: Expense) => void; // Function to handle form submission
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onAddExpense }) => {
  const [newExpense, setNewExpense] = useState<Expense>({
    type: "",
    amount: 0,
    description: "",
  });

  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault();
    onAddExpense(newExpense);
    setNewExpense({ type: "", amount: 0, description: "" }); // Reset form after submit
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExpense((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Add Expense</h2>
      <form onSubmit={handleAddExpense}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Expense Type</label>
          <input
            type="text"
            name="type"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={newExpense.type}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={newExpense.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={newExpense.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;
