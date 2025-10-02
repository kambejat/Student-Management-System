import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface RecordExpenseData {
  expense_type: string;
  amount: string;
  description: string;
  expense_date: string;
  attachment: File | null;
}

const RecordExpense: React.FC = () => {
  const [form, setForm] = useState<RecordExpenseData>({
    expense_type: '',
    amount: '',
    description: '',
    expense_date: '',
    attachment: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, attachment: file }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('expense_type', form.expense_type);
    formData.append('amount', form.amount);
    formData.append('description', form.description);
    formData.append('expense_date', form.expense_date);
    if (form.attachment) {
      formData.append('attachment', form.attachment);
    }

    try {
      const res = await axios.post('/api/expenses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      res.status
      setMessage('Expense submitted successfully!');
      setForm({
        expense_type: '',
        amount: '',
        description: '',
        expense_date: '',
        attachment: null,
      });
    } catch (err) {
      setMessage(`Error submitting expense. ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
      <section className="bg-white dark:bg-gray-900 rounded-md shadow p-4 max-w-2xl mx-auto">
      <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
        Record Expense
      </h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">

          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Expense Type
            </label>
            <input
              type="text"
              name="expense_type"
              value={form.expense_type}
              onChange={handleChange}
              placeholder="e.g. Operational, Maintenance"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 1000.00"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Expense Date
            </label>
            <input
              type="date"
              name="expense_date"
              value={form.expense_date}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description..."
              rows={3}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Attachment (PDF, JPG, PNG)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-white dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 text-center inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
        >
          {loading ? 'Submitting...' : 'Submit Expense'}
        </button>

        {message && (
          <p className="mt-2 text-sm text-center text-green-600 dark:text-green-400">
            {message}
          </p>
        )}
      </form>
    </section>
  );
};

export default RecordExpense;
