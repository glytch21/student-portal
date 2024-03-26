import React from 'react';

const TeachersTable = ({ teacherUsers }: any) => {
  return (
    <div className="flex flex-col">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
};

export default TeachersTable;
