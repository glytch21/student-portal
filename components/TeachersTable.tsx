import React, { useState } from 'react';
import AssignSubject from './AssignSubject'; // Import the AssignSubject component

const TeachersTable = ({ teacherUsers }:any) => {
  const [showAssignSubject, setShowAssignSubject] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Function to toggle the AssignSubject component visibility
  const toggleAssignSubject = (user:any) => {
    setSelectedUser(user); // Set the selected user
    setShowAssignSubject(true); // Show the AssignSubject component
  };

  return (
    <div className="flex flex-col">
      <div className='text-2xl font-semibold'>
        Teachers' Table
      </div>
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-center text-sm font-light text-surface dark:text-black">
              <thead className="border-b border-neutral-200 bg-[#332D2D] font-medium text-white dark:border-white/10">
                <tr>
                  <th scope="col" className="px-6 py-4">#</th>
                  <th scope="col" className="px-6 py-4">User ID</th>
                  <th scope="col" className="px-6 py-4">First Name</th>
                  <th scope="col" className="px-6 py-4">Middle Name</th>
                  <th scope="col" className="px-6 py-4">Last Name</th>
                  <th scope="col" className="px-6 py-4">Assign Subject</th> {/* New column */}
                </tr>
              </thead>
              <tbody>
                {teacherUsers.map((user:any, index:any) => (
                  <tr key={user.user_id} className="border-b border-neutral-200 dark:border-white/10">
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                    <td className="whitespace-nowrap px-6 py-4">{user.user_id}</td>
                    <td className="whitespace-nowrap px-6 py-4">{user.first_name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{user.middle_name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{user.last_name}</td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {/* Button to open AssignSubject component */}
                      <button className="btn-action" onClick={() => toggleAssignSubject(user)}>Assign Subject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Conditional rendering of AssignSubject component */}
      {showAssignSubject && <AssignSubject user={selectedUser} onClose={() => setShowAssignSubject(false)} />}
    </div>
  );
};

export default TeachersTable;
