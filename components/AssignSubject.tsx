import React, { useEffect, useState } from 'react';
import supabase from '@/config/client';

interface GradeEntry {
  subject: string;
  grade: string;
}

const AssignSubject: React.FC<{ user: any; onClose: () => void }> = ({ user, onClose }) => {
  const [teachingSubject, setTeachingSubject] = useState<string | null>(null);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    // Fetch teaching subject from user data
    if (user && user.teachingsubject) {
      setTeachingSubject(user.teachingsubject);
    }

    const userTable = supabase
    .channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'user_table' },
      (payload: { [key: string]: any }) => {
        setTeachingSubject(payload.new.teachingsubject);
      }
    )
    .subscribe();
    // Always fetch grades column
    fetchGradesColumn();
  }, [user]);

  // Function to fetch grades column
  const fetchGradesColumn = async () => {
    try {
      const { data, error } = await supabase
        .from('user_table')
        .select('grades');

      if (error) {
        throw error;
      }

      if (data) {
        // Filter out entries that contain objects
        const filteredGrades = data.filter((entry: any) => Array.isArray(entry.grades) && entry.grades.length > 0);

        // Assuming 'grades' is an array of objects containing subjects and grades
        const gradesData: GradeEntry[] = filteredGrades.flatMap((entry: any) => entry.grades);
        setGrades(gradesData);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  // Function to handle updating teachingSubject
  const updateTeachingSubject = async () => {
    try {
      if (selectedSubject && user && user.user_id) {
        // Fetch the current teaching subject from the database
        const { data: userData, error: userError } = await supabase
          .from('user_table')
          .select('teachingsubject')
          .eq('user_id', user.user_id)
          .single();

        if (userError) {
          throw userError;
        }

        // Concatenate the selected subject with the current teaching subject (if any)
        const currentTeachingSubject = userData?.teachingsubject || '';
        const updatedTeachingSubject = currentTeachingSubject ? `${currentTeachingSubject}, ${selectedSubject}` : selectedSubject;

        // Update the teaching subject column with the concatenated string
        const { error } = await supabase
          .from('user_table')
          .update({ teachingsubject: updatedTeachingSubject })
          .eq('user_id', user.user_id);

        if (error) {
          throw error;
        }

        console.log('Teaching subject updated successfully!');

        // Fetch the updated teaching subject from the database
        const { data: updatedUserData, error: updatedUserError } = await supabase
          .from('user_table')
          .select('teachingsubject')
          .eq('user_id', user.user_id)
          .single();

        if (updatedUserError) {
          throw updatedUserError;
        }

        // Update the teaching subject state with the fetched value
        setTeachingSubject(updatedUserData?.teachingsubject);
        console.log('lol', updatedUserData?.teachingsubject)
        // Close the modal after updating teaching subject
      }
    } catch (error) {
      console.error('Error updating teaching subject:', error);
    }
  };



  // Function to handle dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  // Function to handle form validation
  useEffect(() => {
    setIsFormValid(!!selectedSubject);
  }, [selectedSubject]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-800 rounded-t-lg">
          <h2 className="text-xl font-semibold text-white">Assign Subject</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Teaching Subject */}
          {teachingSubject && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Teaching Subject:</label>
              <div className="mt-1 text-gray-800">{teachingSubject}</div>
            </div>
          )}

          {/* Assign Subject Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Assign Subject:</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={selectedSubject}
              onChange={handleDropdownChange}
            >
              <option value="">Select a subject...</option>
              {/* Map through grades and filter out subjects already in teachingSubject */}
              {grades.map((entry, index) => {
                // Check if the subject is not in teachingSubject
                if (!teachingSubject || !teachingSubject.includes(entry.subject)) {
                  return <option key={index} value={entry.subject}>{entry.subject}</option>;
                } else {
                  return null; // Exclude subjects already in teachingSubject
                }
              })}
            </select>
          </div>

          {/* Update Button */}
          <button
            onClick={updateTeachingSubject}
            disabled={!isFormValid}
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!isFormValid && 'opacity-50 cursor-not-allowed'}`}
          >
            Update Teaching Subject
          </button>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="block w-full text-center py-2 bg-gray-200 hover:bg-gray-300 rounded-b-lg focus:outline-none">
          Close
        </button>
      </div>
    </div>
  );

};

export default AssignSubject;
