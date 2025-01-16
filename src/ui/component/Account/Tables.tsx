import React from "react";

interface Fee {
  student_id: string;
  student_name?: string;
  amount: string;
  reference_number: string;
  payment_date?: string;
  status?: "Paid" | "Unpaid"; // Add status to differentiate
}

interface FeesTableProps {
  fees: Fee[];
  searchTerm: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FeesTable: React.FC<FeesTableProps> = ({
  fees,
  searchTerm,
  handleSearch,
}) => {
  return (
    <div className="p-1 mt-1">
      <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
        <form className="w-full">
          <label className="sr-only">Search</label>
          <div className="relative mt-1 lg:w-64 xl:w-96">
            <input
              type="text"
              name="subject"
              id="users-search"
              value={searchTerm}
              onChange={handleSearch}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search by student ID...."
            />
          </div>
        </form>
      </div>
      <div className="flex flex-col pt-2">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="table-auto w-full border border-gray-200 shadow-md mb-6">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Student ID
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Student Name
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Amount
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Reference Number
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Payment Date
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee, index) => (
                    <tr
                      key={index}
                      className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                    >
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {fee.student_id}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {fee.student_name}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        MK{fee.amount}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {fee.reference_number}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {fee.payment_date}
                      </td>
                      <td
                        className={`p-2 text-base  text-gray-500 dark:text-gray-400 font-semibold ${
                          fee.status === "Paid"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {fee.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesTable;
