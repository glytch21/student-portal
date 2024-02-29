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
        const teachers = data.filter((user: any) => user.role === 'teacher');
        const students = data.filter((user: any) => user.role === 'student');
        setTeacherUsers(teachers);
        setStudentUsers(students);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
      const { data: existingUser, error } = await supabase
        .from('user_table')
        .select('user_id')
        .eq('user_id', userID)
        .single();
      if (existingUser) {
        setError('User ID already exists. Please choose a different one.');
        return;
      }
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
    <div className="max-w-4xl mx-auto p-6">
      <div className='mb-6 text-3xl font-semibold'>Admin</div>
      <form onSubmit={handleAddUser} className='mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div>
            <label htmlFor="userID" className="block mb-1">User ID:</label>
            <input
              type="text"
              id="userID"
              value={userID}
              onChange={(e) => setID(e.target.value)}
              className='w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500'
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500'
            />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label htmlFor="firstName" className="block mb-1">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className='w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500'
            />
          </div>
          <div>
            <label htmlFor="middleName" className="block mb-1">Middle Name:</label>
            <input
              type="text"
              id="middleName"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className='w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500'
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-1">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className='w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500'
            />
          </div>
        </div>
        <div className='mb-4'>
          <label htmlFor="role" className="block mb-1">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className='w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500'
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        <button type="submit" className='px-4 py-2 bg-blue-500 text-white rounded cursor-pointer'>Add User</button>
        {error && <p className='text-red-600 mt-2'>{error}</p>}
      </form>

      <div className='mb-8'>
        <button onClick={toggleTeachersTable} className='px-4 py-2 bg-blue-500 text-white rounded cursor-pointer'>
          {showTeachers ? 'Hide Teachers Table' : 'Show Teachers Table'}
        </button>
        {showTeachers && (
          <table className='border border-black border-collapse mt-4 w-full'>
            <TeachersTable teacherUsers={teacherUsers} />
          </table>
        )}
      </div>

      <div>
        <button onClick={toggleStudentsTable} className='px-4 py-2 bg-blue-500 text-white rounded cursor-pointer'>
          {showStudents ? 'Hide Students Table' : 'Show Students Table'}
        </button>
        {showStudents && (
          <table className='border border-black border-collapse mt-4 w-full'>
            <StudentsTable studentUsers={studentUsers} />
          </table>
        )}
      </div>

    </div>
  );
};

export default AdminPage;
