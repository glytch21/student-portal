'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/config/client';

const LoginPage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [sessionCookie, setSessionCookie] = useState<any>('');

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
    const cookieValue:any = getSessionCookie();
    setSessionCookie(cookieValue);

    // Fetch user data from Supabase using the user_ID stored in the session cookie
    const fetchUserData = async () => {
      if (cookieValue) {
        try {
          const { data, error }:any = await supabase
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
  }, []); // Run only once on component mount

  const handleTest= async (e: any) => {
    e.preventDefault();
    console.log('hehe', userData);
  }

  return (
    <div className='flex justify-center items-center h-screen'>

        {userData && (
          <div className='mb-[10px]'>
            <p>Hi {userData.first_name}</p>
          </div>
        )}

        <button onClick={handleTest}>test</button>

    </div>
  );
};

export default LoginPage;
