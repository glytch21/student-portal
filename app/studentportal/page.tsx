'use client'

import React, { useState, useEffect } from 'react';
import supabase from '@/config/client';
import Navbar from '@/components/NavBar';
import UpdateProfile from '@/components/UpdateProfile'
import ProfilePicUpdateModal from '@/components/UpdateProfilePic';

interface UserData {
  first_name: string;
  last_name: string;
  grade_level: string;
  role: string;
  profile_image: any;
  contact_number: number;
  address: string;
}

interface ParentData {
  first_name: string;
  last_name: string;
  grade_level: string;
  role: string;
  profile_image: any;
  contact_number: number;
  address: string;
}

const StudentsPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [parentData, setParentData] = useState<ParentData | null>(null);
  const [sessionCookie, setSessionCookie] = useState('');
  const [selectedInfo, setSelectedInfo] = useState('profile'); // State to control which info to display
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false); // State to control modal visibility
  const [isPicUpdateOpen, setIsPicUpdateOpen] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [searchResult, setSearchResult] = useState([]);


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

    const getParent = async () => {
      const { data, error } = await supabase
        .from('user_table')
        .select('*')
        .eq('children', cookieValue)
        .single()

      if (data) {
        setParentData(data)
      }
    }


    const userTable = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_table' },
        (payload: { [key: string]: any }) => {
          setUserData(payload.new);
        }
      )
      .subscribe();

    getParent();
    fetchUserData();
  }, []);



  const handleProfileClick = () => {
    setSelectedInfo('profile'); // Set selectedInfo to 'profile' when profile is clicked
  };

  const handleGradesClick = () => {
    setSelectedInfo('grades');
  };

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true); // Open the modal
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false); // Close the modal
  };

  const handleOpenPicUpdateModal = () => {
    setIsPicUpdateOpen(true); // Open the modal
  };

  const handleClosePicUpdateModal = () => {
    setIsPicUpdateOpen(false); // Close the modal
  };

  const handleSearchResultUpdate = (result: any) => {
    setSearchResult(result);
  };

  const handleTest = () => {
    console.log(searchResult)
  }

  return (
    <div className='flex h-screen'>
      {/* Main content */}
      <div className='flex-1'>
        {sessionCookie ? (
          userData ? (
            <div className='mb-10 text-center'>

              <Navbar
                firstButtonClick={handleProfileClick}
                secondButtonClick={handleGradesClick}
                role={userData.role}
              // searchResult={handleSearchResultUpdate}
              />

              {selectedInfo === 'profile' && (
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                  {/* Display uploaded image if exists */}
                  {userData.profile_image && (
                    <div className="mb-4 flex justify-center">
                      <img
                        onClick={handleOpenPicUpdateModal}
                        src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${userData.profile_image}`}
                        alt="Profile Picture"
                        className="object-contain cursor-pointer rounded-full shadow-lg w-32 h-32 hover:opacity-75 transition-opacity duration-300 mx-auto"
                      />
                    </div>
                  )}
                  <p className="text-2xl font-semibold mb-4">ID: {sessionCookie}</p>
                  <p className="text-2xl font-semibold mb-4">Name: {userData.first_name} {userData.last_name}</p>
                  {userData.role === 'student' && (
                    <p className="text-lg text-gray-600 mb-4">Grade {userData.grade_level}</p>
                  )}
                  <p className="text-lg text-gray-600 mb-4">Contact Number: {userData.contact_number}</p>
                  <p className="text-lg text-gray-600 mb-4">Address: {userData.address}</p>
                  {parentData && (
                    <p className="text-lg text-gray-600 mb-4">Parent: {parentData.first_name}</p>
                  )}
                  <button onClick={handleTest}> test</button>
                  {/* Profile update button */}
                  <button
                    onClick={handleOpenProfileModal}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:bg-blue-600 mb-4"
                  >
                    Update Profile
                  </button>

                  {/* Upload message */}
                  {uploadMessage && <p className="text-green-500">{uploadMessage}</p>}

                  {/* Profile update modal */}
                  {isProfileModalOpen && (
                    <UpdateProfile onClose={handleCloseProfileModal} userData={userData} />
                  )}

                  {isPicUpdateOpen && (
                    <ProfilePicUpdateModal onClose={handleClosePicUpdateModal} userData={userData} />
                  )}
                </div>
              )}

              {/* test */}
              {selectedInfo === 'grades' && (
                <div>
                  <p className='text-xl font-semibold mb-4'>grades {userData.contact_number}</p>
                </div>
              )}

              {selectedInfo === '' && (
                <p className='text-xl font-semibold mb-4'>grades {userData.contact_number}</p>
              )}
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

export default StudentsPage;
