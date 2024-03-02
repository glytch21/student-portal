'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/config/client';

interface UserData {
  first_name: string;
}

const TeachersPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sessionCookie, setSessionCookie] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar visibility
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null); // State to store selected subject

  useEffect(() => {
    const getSessionCookie = () => {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];
      return cookie || '';
    };

    const cookieValue = getSessionCookie();
    setSessionCookie(cookieValue);

    const fetchUserData = async () => {
      if (cookieValue) {
        try {
          const { data, error } = await supabase
            .from('user_table')
            .select('*')
            .eq('user_id', cookieValue)
            .single();
          if (error) {
            throw error;
          }
          if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  };

  const handleTest = async (e: any) => {
    e.preventDefault();
    console.log('hehe', userData);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
  };

  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className='bg-gray-200 h-full w-20 flex flex-col justify-between items-center'>
          <div>
            <p className='text-center text-gray-700 font-semibold mt-2'>Profile</p>
            <button onClick={() => handleSubjectClick('Subject 1')} className='py-1 px-2 my-2 bg-gray-400 rounded text-sm'>Subject 1</button>
            <button onClick={() => handleSubjectClick('Subject 2')} className='py-1 px-2 my-2 bg-gray-400 rounded text-sm'>Subject 2</button>
          </div>
          {/* Logout button */}
          <button onClick={handleLogout} className='py-1 px-2 bg-red-500 text-white rounded text-sm mt-auto'>
            Logout
          </button>
        </div>
      )}
  
      {/* Main content */}
      <div className='flex-1'>
        {/* Toggle button for the sidebar */}
        <button onClick={toggleSidebar} className='bg-gray-200 px-4 py-2 text-sm'>
          {isSidebarOpen ? '<<<' : '>>>'}
        </button>
  
        {/* Display selected subject */}
        {selectedSubject && (
          <p className='text-center mt-4'>{selectedSubject}</p>
        )}
  
        {sessionCookie ? (
          userData ? (
            <div className='mb-10 text-center'>
              <p className='text-xl font-semibold mb-4'>Student {userData.first_name}</p>
              <button onClick={handleTest} className='px-2 py-1 bg-blue-500 text-white rounded mr-2 text-sm'>Test</button>
            </div>
          ) : (
            <p>Loading...</p>
          )
        ) : (
          <p className='text-red-500'>Error: Session cookie not found. Please log in.</p>
        )}
      </div>
    </div>
  );
  
};

export default TeachersPage;











