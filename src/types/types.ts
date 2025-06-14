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
  user_id?: number | "";
  student_id: number;
  first_name: string;
  last_name: string;
}

// types.ts
export type FeeRecord = {
  fee_id?: number;
  student_id: number | string;
  student_name: string;
  academic_year: string;
  grade_level: string;
  total_fee: number;
  total_paid: number;
  balance: number;
  amount_paid?: number;
  reference_number?: string;
  payment_date?: string;
  payment_method?: string;
};

export type FeeData = {
  student_id?: string | number | undefined;  // could be undefined
  student_name?: string;
 academic_year?: string | undefined; 
  grade_level: string;
  total_fee: number;
  total_paid?: number;
  balance: number;
  reference_number?: string;
  payment_date?: string;
  payment_method?: string
  amount_paid?: number | undefined;          // could be 0 or undefined
};
