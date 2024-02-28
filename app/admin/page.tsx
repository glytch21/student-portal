'use client';
import React, { useState, useEffect } from 'react';
import supabase from '@/config/client';
import bcrypt from 'bcryptjs';
import { useRouter } from "next/navigation";
import TeachersTable from "@/components/TeachersTable";
import StudentsTable from '@/components/StudentsTable';

const AdminPage = () => {
  const [teacherUsers, setTeacherUsers] = useState<any[]>([]);
  const [studentUsers, setStudentUsers] = useState<any[]>([]);
  const [userID, setID] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [showTeachers, setShowTeachers] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_table')
        .select('*');
      if (error) {
        throw error;
      }
      if (data) {
        // Separate users into teacher and student arrays
        const teachers = data.filter((user: any) => user.role === 'teacher');
        const students = data.filter((user: any) => user.role === 'student');
        setTeacherUsers(teachers);
        setStudentUsers(students);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTest = async (e: any) => {
    e.preventDefault();
    router.push('/admin/students/')
  }

  const toggleTeachersTable = () => {
    setShowTeachers(!showTeachers);
  };

  const toggleStudentsTable = () => {
    setShowStudents(!showStudents);
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userID || !password || !firstName || !middleName || !lastName) {
      setError('Please provide all required information');
      return;
    }
    try {
      // Check if the user ID already exists
      const { data: existingUser, error } = await supabase
        .from('user_table')
        .select('user_id')
        .eq('user_id', userID)
        .single();
      if (existingUser) {
        setError('User ID already exists. Please choose a different one.');
        return;
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error: insertionError } = await supabase
        .from('user_table')
        .insert([
          {
            user_id: userID,
            user_password: hashedPassword,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            role: role
          }
        ]);
      if (insertionError) {
        throw insertionError;
      }
      alert('success')
      fetchData();
      // Clear the form fields after successful addition
      setID('');
      setPassword('');
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setRole('student');
      setError('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px', fontSize: '1.5em' }}>Admin</div>
      <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="userID">User ID:</label>
          <input
            type="text"
            id="userID"
            value={userID}
            onChange={(e) => setID(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="middleName">Middle Name:</label>
          <input
            type="text"
            id="middleName"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        <button type="submit" style={{ marginLeft: '10px', padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add User</button>
        {error && <p style={{ color: 'red', marginLeft: '10px', marginTop: '5px' }}>{error}</p>}
      </form>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={toggleTeachersTable} style={{ marginBottom: '10px', padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {showTeachers ? 'Hide Teachers Table' : 'Show Teachers Table'}
        </button>
        {showTeachers && (
          <table style={{ border: '1px solid black', borderCollapse: 'collapse', marginBottom: '20px', width: '100%' }}>
            <TeachersTable teacherUsers={teacherUsers} />
          </table>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={toggleStudentsTable} style={{ marginBottom: '10px', padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {showStudents ? 'Hide Students Table' : 'Show Students Table'}
        </button>
        {showStudents && (
          <table style={{ border: '1px solid black', borderCollapse: 'collapse', marginBottom: '20px', width: '100%' }}>
            <StudentsTable studentUsers={studentUsers} />
          </table>
        )}
      </div>

    </div>
  );
};

export default AdminPage;
