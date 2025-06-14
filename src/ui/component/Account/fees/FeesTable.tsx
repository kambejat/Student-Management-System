import { useEffect, useState } from "react";
import axios from "axios";
import ImportExportButtons from "./ImportExportButtons";
import { FeeData, FeeRecord } from "../../../../types/types";
import { Notification } from "../../../../helpers/Notifications";

export default function FeesTable() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [gradeLevel, setGradeLevel] = useState<string>("");
  const [source, setSource] = useState<"fetched" | "imported">("fetched");
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  const handleImport = (importedData: Partial<FeeData>[]) => {
    const payload = importedData
      .filter(
        (item) =>
          item.student_id !== undefined &&
          item.academic_year !== undefined &&
          item.amount_paid !== undefined
      )
      .map((item) => ({
        student_id: Number(item.student_id),
        academic_year: item.academic_year!,
        amount_paid: Number(item.amount_paid),
        reference_number:
          item.reference_number ||
          `REF-${item.student_id}-${item.academic_year}`,
        payment_date: item.payment_date || new Date().toISOString(),
        payment_method: item.payment_method || "Imported",
      }));

    axios
      .post("/api/import_fees", payload)
      .then((response) => {
        setNotification({ message: response.data.message, type: "success" });
        fetchFees();
        setSource("imported");
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          const errorMessages = error.response.data.errors
            .map(
              (err: any) =>
                `Row ${err.index + 1}: ${err.error} (Ref: ${
                  err.reference_number
                })`
            )
            .join("\n");

          setNotification({ message: errorMessages, type: "error" });
        } else {
          setNotification({
            message: error.message || "Unknown error",
            type: "error",
          });
        }
      });
  };

  const fetchFees = () => {
    if (gradeLevel) {
      axios
        .get<FeeRecord[]>(
          `/api/fees_collection_with_balances?grade_level=${gradeLevel}`
        )
        .then((res) => {
          setFees(res.data);
          setSource("fetched");
        })
        .catch((err) => setNotification({message: err, type:"error"}));
    }
  };

  useEffect(() => {
    fetchFees();
  }, [gradeLevel]);

  return (
    <div className="flex flex-col p-2">
      <div className="sm:flex">
        <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="g-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full w-1/2 px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option value="">Filter by Form</option>
            <option value="F1">Form 1</option>
            <option value="F2">Form 2</option>
            <option value="F3">Form 3</option>
            <option value="F4">Form 4</option>
          </select>
        </div>
        <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
          <ImportExportButtons data={fees} onImport={handleImport} />
        </div>
      </div>

      <div className="flex flex-col pt-2">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Student ID
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Name
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Academic Year
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Form
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Total Fee
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Total Paid
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Balance
                    </th>
                    {source === "imported" && (
                      <>
                        <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                          New Amount Paid
                        </th>
                      </>
                    )}
                    {source === "fetched" && (
                      <>
                        <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                          Last Paid
                        </th>
                        <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                          Date
                        </th>
                        <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                          Method
                        </th>
                      </>
                    )}
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
                        {fee.academic_year}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {fee.grade_level}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {fee.total_fee}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {fee.total_paid}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {fee.balance}
                      </td>
                      {source === "imported" && (
                        <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                          {fee.amount_paid ?? ""}
                        </td>
                      )}
                      {source === "fetched" && (
                        <>
                          <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            {fee.amount_paid ?? ""}
                          </td>
                          <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            {fee.payment_date
                              ? new Date(fee.payment_date).toLocaleDateString()
                              : ""}
                          </td>
                          <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            {fee.payment_method ?? ""}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
