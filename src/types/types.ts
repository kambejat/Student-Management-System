export interface Expense {
  type: string;
  name?: string;
  amount: string;
  description: string;
  expense_date?: string;
}

export interface Fee {
  student_id: string;
  student_name?: string;
  amount: string;
  reference_number: string;
  payment_date?: string;
  status?: "Paid" | "Unpaid";
}

export interface Teacher {
  teacher_id: number;
  user_id: number;
  class_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  date_of_birth: string;
}


export interface User  {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string; // Only required for creating new users
  role: number; // Role ID
  permissions: number[]; // Array of permission IDs
  isActive: boolean;
};

export interface Class {
  id: number;
  class_id: number;
  name: string;
}

export interface FormData {
  user_id: number | "";
  class_id: number | "";
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  date_of_birth: string;
}

export interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
}