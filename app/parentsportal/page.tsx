'use client';
import React, { useEffect, useState } from 'react';
import supabase from '@/config/client';

interface UserData {
  first_name: string;
  profile_image: any;
}

interface ChildData {
  first_name: string;
}

const ParentPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [childData, setChildData] = useState<ChildData | null>(null);
  const [childID, setChildID] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [sessionCookie, setSessionCookie] = useState<string>('');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleTest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log('Parent:', userData);
    console.log('Child ID:', childID);
    console.log('Child Data:', childData);
    console.log('Session Cookie:', sessionCookie);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const handleUpload = async () => {
    if (!file || !sessionCookie) return;

    try {
      const fileName = `parent_${sessionCookie}_${file.name}`;

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
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className='w-64 bg-gray-200 p-4'>
          <p className='text-xl font-semibold mb-4'>Sidebar</p>
          <p className='mb-2'>Some sidebar content here...</p>
          <button onClick={toggleSidebar} className='bg-gray-500 text-white px-4 py-2 rounded'>Close Sidebar</button>
        </div>
      )}

      {/* Main content */}
      <div className='flex-1 p-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-semibold'>Parent Page</h1>
          <button onClick={toggleSidebar} className='bg-gray-500 text-white px-4 py-2 rounded'>Toggle Sidebar</button>
        </div>
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

      <div className='flex-1 p-8'>
        {/* Existing content */}
        {/* File upload input */}
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} className='px-2 py-1 bg-blue-500 text-white rounded mr-2 text-sm'>Upload Image</button>
        {/* Display uploaded image if exists */}
        {userData && userData.profile_image && (
          <div className="image-container" style={{ width: "2in", height: "2in", overflow: "hidden" }}>
            <img src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${userData.profile_image}`} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        {/* Upload message */}
        {uploadMessage && <p className="text-green-500">{uploadMessage}</p>}
      </div>
    </div>
  );
};

export default ParentPage;
