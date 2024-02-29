'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/config/client';

interface UserData {
  first_name: string;
}
interface ChildData {
  first_name: string;
}


const ParentPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [childData, setChildData] = useState<ChildData | null>(null);
  const [childID, setChildID] = useState(null);
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
            setChildID(data.children);

            if (data.children){
              fetchChildrenData(data.children);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:');
        }
      }
    };
    const fetchChildrenData = async (childID:any) => {
      if (cookieValue && childID) {
        try {
          const { data, error } = await supabase
            .from('user_table')
            .select('*')
            .eq('user_id', childID)
            .single();
          if (error) {
            throw error;
          }
          if (data) {
            setChildData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:');
        }
      }
    }

    
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
    console.log('child', childID);
    console.log('data', childData);
    console.log('cookie', sessionCookie);
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      {sessionCookie ? (
        userData && childData ? (
          <div className='mb-[10px]'>
            <p>Parent {userData.first_name}</p>
            <p>Child {childData.first_name}</p>
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

export default ParentPage;

