import React, { useState } from 'react';
import supabase from '@/config/client';

interface Props {
  onClose: () => void;
  userData: any;
}

const UpdateGrades: React.FC<Props> = ({ onClose, userData }) => {
  const [initialGrades, setInitialGrades] = useState<any>(userData.grades || []);
  const [comments, setComments] = useState<string>(userData.comments || '');

  const handleUpdateGrades = async () => {
    try {
      // Update the 'grades' and 'comments' columns in the 'user_table' using Supabase
      const { data, error } = await supabase
        .from("user_table")
        .update({ grades: initialGrades, comments: comments })
        .eq("user_id", userData.user_id)

      if (error) {
        console.log('Error updating grades:', error);
        return;
      }

      alert('Grades and comments updated in Supabase');
      onClose();

      // Update local state to reflect changes
      setInitialGrades(data); // Assuming data returned from Supabase is the updated grades
    } catch (error) {
      console.error('Error updating grades in Supabase:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex">
        <div className="mr-8">
          <h2 className="text-2xl font-semibold mb-4">{userData.first_name} {userData.last_name}'s Grades</h2>
          <table className="w-full mb-4">
            <caption className="text-lg font-semibold mb-2">Student List</caption>
            <thead>
              <tr>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {initialGrades.map((grade: any, index: number) => (
                <tr key={index}>
                  <td className="border p-2">{grade.subject}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={grade.grade || ''} // Ensure empty string if grade is null or undefined
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newGrades = [...initialGrades];
                        newGrades[index].grade = e.target.value;
                        setInitialGrades(newGrades);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-4">
          <h1 className="text-1xl font-semibold mb-1">Comments</h1>
            <textarea
              placeholder="Comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full h-20 border p-2"
            />
          </div>
          <div className="flex">
            <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-4">Cancel</button>
            <button onClick={handleUpdateGrades} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateGrades;