import React from 'react';

const StudentsTable = ({ studentUsers }: any) => {
  return (
    <div className="mb-8">
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full border border-gray-200 shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Middle Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentUsers.map((user: any) => (
                <tr key={user.user_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.children[0].first_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.children[0].middle_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.children[0].last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.first_name} {user.middle_name} {user.last_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsTable;
