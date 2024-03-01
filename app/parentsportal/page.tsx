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
  const [childID, setChildID] = useState<any>(null);
  const [sessionCookie, setSessionCookie] = useState<string>('');

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
            setChildID(data.children);

            if (data.children) {
              fetchChildrenData(data.children);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    const fetchChildrenData = async (childID: any) => {
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
          console.error('Error fetching child data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  };

  const handleTest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log('Parent:', userData);
    console.log('Child ID:', childID);
    console.log('Child Data:', childData);
    console.log('Session Cookie:', sessionCookie);
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      {sessionCookie ? (
        userData && childData ? (
          <div className='p-8 bg-white rounded-lg shadow-md'>
            <p className='text-xl font-semibold mb-4'>Parent: {userData.first_name}</p>
            <p className='text-lg mb-2'>Child: {childData.first_name}</p>
            <div className='flex space-x-4'>
              <button className='px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 focus:outline-none' onClick={handleTest}>Test</button>
              <button className='px-4 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 focus:outline-none' onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <p className='text-red-500'>Error: Session cookie not found. Please log in.</p>
      )}
    </div>
  );
};

export default ParentPage;

