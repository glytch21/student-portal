'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/config/client';

const LoginPage = () => {
  const [userData, setUserData] = useState(null);
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
          console.error('Error fetching user data:', error.message);
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

        {userData && (
          <div style={{ marginBottom: '10px' }}>
            <p>Hi {userData.first_name}</p>
          </div>
        )}

        <button onClick={handleTest}>test</button>

    </div>
  );
};

export default LoginPage;
