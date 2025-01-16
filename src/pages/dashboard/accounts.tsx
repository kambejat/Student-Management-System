import React, { useState, useEffect } from "react";
import axios from "axios";
import FeesTable from "../../ui/component/Account/Tables";
import ExpenseTable from "../../ui/component/Account/ExpenseTable";
import AddExpenseForm from "../../ui/component/Account/AddExpense";
import AddFeeForm from "../../ui/component/Account/AddFee";
import { Fee, Expense } from "../../types/types";

interface Student {
  student_id: number;
  name: string;
}

const AccountManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "fees" | "expenses" | "addFees" | "addExpenses"
  >("fees");
  const [fees, setFees] = useState<Fee[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTermExpense, setSearchTermExpense] = useState<string>("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("/api/students");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await axios.get("/api/fees");
        setFees(response.data);
      } catch (error) {
        console.error("Error fetching fees:", error);
      }
    };

    fetchFees();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("/api/expenses");
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const handleTabClick = (
    tab: "fees" | "expenses" | "addFees" | "addExpenses"
  ) => {
    setActiveTab(tab);
  };

  const handleAddFee = async (fee: {
    student_id: number;
    amount: string;
    reference_number: string;
  }) => {
    const fullFee = {
      ...fee,
      student_name: "", 
      payment_date: "",
    };

    try {
      const response = await axios.post("/api/fees", fullFee);
      setFees((prevFees) => [...prevFees, response.data]); // Update state with the newly added fee
      console.log("Fee added:", response.data); // Log the response
    } catch (error) {
      console.error("Error adding fee:", error);
    }
  };

  const handleAddExpense = (expense: {
    type: string;
    amount: number;
    description: string;
  }) => {
    console.log("Expense added:", expense);
    // Here you would typically send the expense to an API or update the state
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchExpense = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermExpense(e.target.value);
  };

  const filteredFees = fees.filter((fee) =>
    fee.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.type.toLowerCase().includes(searchTermExpense.toLowerCase()) ||
      expense.description
        .toLowerCase()
        .includes(searchTermExpense.toLowerCase())
  );

  return (
    <div className="container mx-auto p-1">
      {/* Tabs */}
      <div className="space-x-1 flex text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <div className="flex flex-wrap -mb-px space-x-1">
          <button
            className={`py-1 px-2 rounded ${
              activeTab === "fees"
                ? "text-blue-600 border-b-2 border-blue-600 rounded-t-md active dark:text-blue-500 dark:border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("fees")}
          >
            Fees
          </button>
          <button
            className={`py-1 px-2 rounded ${
              activeTab === "expenses"
                ? "text-blue-600 border-b-2 border-blue-600 rounded-t-md active dark:text-blue-500 dark:border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("expenses")}
          >
            Expenses
          </button>
          <button
            className={`py-1 px-2 rounded ${
              activeTab === "addFees"
                ? "text-blue-600 border-b-2 border-blue-600 rounded-t-md active dark:text-blue-500 dark:border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("addFees")}
          >
            Add Fee
          </button>
          <button
            className={`py-1 px-2 rounded ${
              activeTab === "addExpenses"
                ? "text-blue-600 border-b-2 border-blue-600 rounded-t-md active dark:text-blue-500 dark:border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("addExpenses")}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Fees Content */}
      {activeTab === "fees" && (
        <div className="mt-1">
          <FeesTable
            fees={filteredFees}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
          />
        </div>
      )}

      {/* Expenses Content */}
      {activeTab === "expenses" && (
        <div className="mt-1">
          <ExpenseTable
            expenses={filteredExpenses}
            searchTerm={searchTermExpense}
            handleSearch={handleSearchExpense}
          />
        </div>
      )}
      {activeTab === "addExpenses" && (
        <AddExpenseForm onAddExpense={handleAddExpense} />
      )}
      {activeTab === "addFees" && (
        <AddFeeForm students={students} onAddFee={handleAddFee} />
      )}
    </div>
  );
};

export default AccountManagement;
