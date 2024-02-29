'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/config/client';

interface UserData {
  first_name: string;
  // Add other properties here based on your user data structure
}

const TeachersPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sessionCookie, setSessionCookie] = useState('');

  useEffect(() => {
    // Function to retrieve the value of the session cookie
    const getSessionCookie = () => {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];
      return cookie || '';
    };

    // Set the value of the session cookie in state
    const cookieValue = getSessionCookie();
    setSessionCookie(cookieValue);

    // Fetch user data from Supabase using the user_ID stored in the session cookie
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
          console.error('Error fetching user data:');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Clear the session cookie by setting its expiration date to a past time
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Reload the page to redirect the user to the login page
    window.location.href = '/';
  };

  const handleTest = async (e: any) => {
    e.preventDefault();
    console.log('hehe', userData);
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      {sessionCookie ? (
        userData ? (
          <div className='mb-[10px]'>
            <p>Teacher {userData.first_name}</p>
            <button onClick={handleTest}>Test</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <p>Error: Session cookie not found. Please log in.</p>
      )}
    </div>
  );
};

export default TeachersPage;

