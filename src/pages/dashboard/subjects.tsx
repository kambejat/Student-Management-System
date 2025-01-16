import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import Modal from "../../ui/component/Modal";
import AddForm from "../../ui/component/subjects/AddForm";
import { AddIcon } from "../../ui/icon/icons";
import AddSubjectForm from "../../ui/component/subjects/AddSubjectForm";
import { Teacher } from "../../types/Teacher";
interface Subject {
  subject_id: number;
  name: string;
  grade_level: string;
  teacher?: string;
}

const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] =
    useState<boolean>(false); // For Add Subject Modal

  // Update selected subject and teacher
  const filteredSubject = subjects.filter((subject) =>
    `${subject.name}`.toLowerCase().includes(searchTerm)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get<Subject[]>("/api/subjects");
        setSubjects(response.data);
      } catch {
        setError("Failed to fetch subjects. Please try again later.");
      }
    };
    fetchSubjects();
  }, []);

  // Fetch teachers from the API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get<Teacher[]>("/api/teachers");
        setTeachers(response.data);
      } catch {
        setError("Failed to fetch teachers. Please try again later.");
      }
    };
    fetchTeachers();
  }, []);

  // Handle form submission
  const handleAddTeacher = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedSubject || !selectedTeacher) {
      setError("Please select a subject and a teacher.");
      return;
    }

    try {
      await axios.put(`/api/subjects/${selectedSubject}`, {
        teacher: selectedTeacher,
      });
      setSubjects((prev) =>
        prev.map((subject) =>
          subject.subject_id === selectedSubject
            ? { ...subject, teacher: selectedTeacher }
            : subject
        )
      );
      setSelectedTeacher("");
      setSelectedSubject(null);
      setError("");
    } catch {
      setError("Failed to update the subject. Please try again.");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseAddSubjectModal = () => {
    setIsAddSubjectModalOpen(false);
  };

  return (
    <div className="flex flex-col p-2">
      <div className="sm:flex">
        <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
          <form action="GET">
            <label className="sr-only">Search</label>
            <div className="relative mt-1 lg:w-64 xl:w-96">
              <input
                type="text"
                name="subject"
                id="users-search"
                value={searchTerm}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search for subject name"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            data-modal-target="add-user-modal"
            data-modal-toggle="add-user-modal"
            className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-[#311fb7] focus:ring-4 focus:ring-[#98a5ff] sm:w-auto dark:bg-primary-600 dark:hover:bg-[#3b22e0] dark:focus:ring-[#311fb7]"
          >
            <AddIcon className="mr-2 -ml-1 h-5 w-5" />
            Add Teacher to Subject
          </button>
          <button
            onClick={() => setIsAddSubjectModalOpen(true)}
            type="button"
            data-modal-target="add-user-modal"
            data-modal-toggle="add-user-modal"
            className="inline-flex items-center ml-2 justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-[#311fb7] focus:ring-4 focus:ring-[#98a5ff] sm:w-auto dark:bg-primary-600 dark:hover:bg-[#3b22e0] dark:focus:ring-[#311fb7]"
          >
            <AddIcon className="mr-2 -ml-1 h-5 w-5" />
            New Subject
          </button>
        </div>
      </div>
      <div className="flex flex-col pt-2">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              {error && <div className="text-red-600 mb-4">{error}</div>}

              <table className="table-auto w-full border border-gray-200 shadow-md mb-6">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      ID
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Name
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Grade Level
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Teacher
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubject.map((subject) => (
                    <tr
                      key={subject.subject_id}
                      className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                    >
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {subject.subject_id}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {subject.name}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {subject.grade_level}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {subject.teacher || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          Content={
            <AddForm
              subjects={subjects}
              teachers={teachers}
              selectedSubject={selectedSubject}
              selectedTeacher={selectedTeacher}
              setSelectedSubject={setSelectedSubject}
              setSelectedTeacher={setSelectedTeacher}
              handleAddTeacher={handleAddTeacher}
              error={error}
            />
          }
          toggleModal={handleClose}
        />
      )}
      {isAddSubjectModalOpen && (
        <Modal
          isOpen={isAddSubjectModalOpen}
          toggleModal={handleCloseAddSubjectModal}
          Content={
            <AddSubjectForm
              setError={setError}
              setSubjects={setSubjects}
              toggleModal={handleCloseAddSubjectModal}
              teachers={teachers}
            />
          }
        />
      )}
    </div>
  );
};

export default SubjectsPage;
