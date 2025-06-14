import React from "react";
import { FeeData } from "../../../../types/types";
import { ExportIcon, ImportIcon } from "../../../icon/icons";

type ImportExportButtonsProps = {
  data: FeeData[];
  onImport: (importedData: Partial<FeeData>[]) => void; // Partial so optional fields are allowed
};

export default function ImportExportButtons({
  data,
  onImport,
}: ImportExportButtonsProps) {
  // Export CSV for users to fill payment details
  const handleExport = () => {
    const rows = [
      [
        "Student ID",
        "Student Name",
        "Academic Year",
        "Balance",
        "Amount Paid (Enter)",
        "Reference Number (Enter)",
        "Payment Date (optional)",
        "Payment Method (optional)",
      ],
      ...data
        .filter((item) => item.balance > 0) // Export only those who owe
        .map((item) => [
          item.student_id,
          item.student_name,
          item.academic_year,
          item.balance,
          "", // amount_paid user fills
          "", // reference_number user fills
          "", // payment_date optional
          "", // payment_method optional
        ]),
    ];

    const csvContent = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "fees_import_template.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").slice(1); // skip header row

      const importedData = lines
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const values = line
            .split(",")
            .map((s) => s.replace(/(^"|"$)/g, "").replace(/""/g, '"'));

          return {
            student_id: values[0],
            academic_year: values[2],
            amount_paid: parseFloat(values[4]) || 0, // skip balance at values[3]
            reference_number: values[5] || undefined,
            payment_date: values[6] || undefined,
            payment_method: values[7] || undefined,
          };
        });

      onImport(importedData);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <button
        onClick={handleExport}
        className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
      >
        <ExportIcon className="mr-2 -ml-1 h-5 w-5" />Export CSV
      </button>
      <label className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-[#311fb7] focus:ring-4 focus:ring-[#98a5ff] sm:w-auto dark:bg-primary-600 dark:hover:bg-[#3b22e0] dark:focus:ring-[#311fb7] cursor-pointer">
        <ImportIcon className="mr-2 -ml-1 h-5 w-5" /> Import CSV
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </>
  );
}
