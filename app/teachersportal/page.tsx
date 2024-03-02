'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/config/client';

interface UserData {
  first_name: string;
}

const TeachersPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sessionCookie, setSessionCookie] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
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

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !sessionCookie) return;

    try {
      const fileName = `student_${sessionCookie}_${file.name}`;
      const { data: existingProfileData, error: existingProfileError } = await supabase
        .from('user_table')
        .select('profile_image')
        .eq('user_id', sessionCookie)
        .single();

      if (existingProfileError) {
        throw existingProfileError;
      }

      if (existingProfileData && existingProfileData.profile_image) {
        // Delete the existing profile image
        await supabase.storage
          .from('images')
          .remove([existingProfileData.profile_image]);
      }

      // Upload the new profile image
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      if (data) {
        // Update the user's profile with the uploaded image filename
        const profileImageName = fileName;
        console.log(profileImageName)
        const { error: profileUpdateError } = await supabase
          .from('user_table')
          .update({ profile_image: profileImageName }) // Update the profile_image field with the new filename
          .eq('user_id', sessionCookie);

        if (profileUpdateError) {
          throw profileUpdateError;
        }

        // Update the user data to reflect the profile image change
        setUserData(prevUserData => prevUserData ? { ...prevUserData, profile_image: profileImageName } : null);

        // Set upload message
        setUploadMessage('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      // Set error message if upload fails
      setUploadMessage('Error uploading image. Please try again.');
    }
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
              <p className='text-xl font-semibold mb-4'>Teacher {userData.first_name}</p>
              {/* File upload input */}
              <input type="file" onChange={handleFileChange} />
              <button onClick={handleUpload} className='px-2 py-1 bg-blue-500 text-white rounded mr-2 text-sm'>Upload Image</button>
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
      </div>
    </div>
  );
  
};

export default TeachersPage;

