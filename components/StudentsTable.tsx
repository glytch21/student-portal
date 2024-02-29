import React from 'react';

const StudentsTable = ({ studentUsers }:any) => {
  return (
    <div className='mb-[20px]'>
      <table className='border border-black border-collapse mb-[20px] w-full'>
        <thead>
          <tr>
            <th className='border border-black p-[8px]'>User ID</th>
            <th className='border border-black p-[8px]'>First Name</th>
            <th className='border border-black p-[8px]'>Middle Name</th>
            <th className='border border-black p-[8px]'>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {studentUsers.map((user:any) => (
            <tr key={user.user_id}>
              <td className='border border-black p-[8px]'>{user.user_id}</td>
              <td className='border border-black p-[8px]'>{user.first_name}</td>
              <td className='border border-black p-[8px]'>{user.middle_name}</td>
              <td className='border border-black p-[8px]'>{user.last_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
