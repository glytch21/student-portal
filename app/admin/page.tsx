'use client';
import React, { useState, useEffect } from 'react';
import supabase from '@/config/client';
import bcrypt from 'bcryptjs';

const AdminPage = () => {
  const [teacherUsers, setTeacherUsers] = useState<any[]>([]);
  const [studentUsers, setStudentUsers] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('user_table').select('*');
      if (error) {
        throw error;
      }
      if (data) {
        // Separate users into teacher and student arrays
        const teachers = data.filter((user:any) => user.role === 'teacher');
        const students = data.filter((user:any) => user.role === 'student');
        setTeacherUsers(teachers);
        setStudentUsers(students);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userName || !password || !role) {
      setError('Please provide a username, password, and select a role.');
      return;
    }
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error } = await supabase.from('user_table').insert([
        { user_name: userName, user_password: hashedPassword, role: role }
      ]);
      if (error) {
        throw error;
      }
      if (data) {
        fetchData(); // Refresh the user list after adding a new user
        // Clear the form fields after successful addition
        setUserName('');
        setPassword('');
        setRole('student'); // Reset role to default 'student'
        setError('');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div>
      <div>Admin</div>
      <form onSubmit={handleAddUser}>
        <label htmlFor="userName">User Name:</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button type="submit">Add User</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <div>
        <h2>Teachers</h2>
        <table style={{ border: '1px solid black', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>User ID</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>User Name</th>
            </tr>
          </thead>
          <tbody>
            {teacherUsers.map((user) => (
              <tr key={user.user_id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{user.user_id}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{user.user_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Students</h2>
        <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>User ID</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>User Name</th>
            </tr>
          </thead>
          <tbody>
            {studentUsers.map((user) => (
              <tr key={user.user_id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{user.user_id}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{user.user_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
