import React from "react";
import ImportExportFees from "./ImportExportButtons";
import { Grade } from "../../../../types/types";

interface GradesTableProps {
  grades: Grade[];
  handleDelete: (id: number) => void;
  getGrades: () => void;
}
const GradesTable: React.FC<GradesTableProps> = ({
  grades,
  handleDelete,
  getGrades,
}) => {
  return (
    <div className="flex flex-col p-2">
      <ImportExportFees getGrades={getGrades} />
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
                      Subject ID
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Term
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Exam Type
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Score
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Max
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      %
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Grade
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Date
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g) => (
                    <tr
                      key={g.grade_id}
                      className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                    >
                      <td className="p-2 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                        {g.student_id}
                      </td>
                      <td className="p-2 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                        {g.subject_id}
                      </td>
                      <td className="p-2 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                        {g.term}
                      </td>
                      <td className="p-2 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                        {g.exam_type}
                      </td>
                      <td className="p-2 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                        {g.score}
                      </td>
                      <td className="p-2 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                        {g.max_score}
                      </td>
                      <td className="p-2 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                        {g.percentage.toFixed(2)}
                      </td>
                      <td className="p-2 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                        {g.grade_letter}
                      </td>
                      <td className="p-2 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                        {g.exam_date}
                      </td>
                      <td className="p-2 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                        <button
                          onClick={() => handleDelete(g.grade_id)}
                          className="bg-red-500 text-white rounded px-2 py-0.5 text-xs"
                        >
                          Delete
                        </button>
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

export default GradesTable;
