import React from 'react';

const StudentsTable = ({ studentUsers }:any) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <table style={{ border: '1px solid black', borderCollapse: 'collapse', marginBottom: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>User ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>First Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Middle Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {studentUsers.map((user:any) => (
            <tr key={user.user_id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.user_id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.first_name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.middle_name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.last_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
