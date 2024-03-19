'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/config/client';
import UpdateProfile from '@/components/UpdateProfile';
import NavBar from '@/components/NavBar'

interface UserData {
  first_name: string;
  profile_image: any;
  contact_number: number;
}

const StudentsPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sessionCookie, setSessionCookie] = useState('');
  const [uploadMessage, setUploadMessage] = useState<string>('');

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


  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false); // State to control modal visibility

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true); // Open the modal
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false); // Close the modal
  };

  return (
    <div className='flex h-screen'>

      {/* Main content */}
      <div className='flex-1'>

        {sessionCookie ? (
          userData ? (
            <div className='mb-10 text-center'>
              <NavBar handleLogout={handleLogout} />
              <p className='text-xl font-semibold mb-4'>Student {userData.first_name}</p>
              <p className='text-xl font-semibold mb-4'>Contact Number {userData.contact_number}</p>
              {/* Display uploaded image if exists */}
              {userData.profile_image && (
                <div className="image-container" style={{ width: "2in", height: "2in", overflow: "hidden" }}>
                  <img src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${userData.profile_image}`} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              {/* Upload message */}
              {uploadMessage && <p className="text-green-500">{uploadMessage}</p>}
            </div>
          ) : (
            <p>Loading...</p>
          )
        ) : (
          <p className='text-red-500'>Error: Session cookie not found. Please log in.</p>
        )}
        
        {/* Profile update button */}
        <button onClick={handleOpenProfileModal} className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-4'>
          Update Profile
        </button>

        {/* Profile update modal */}
        {isProfileModalOpen && (
              <UpdateProfile onClose={handleCloseProfileModal} userData={userData}/>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
