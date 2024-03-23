'use client'

import React, { useState, useEffect } from 'react';
import supabase from '@/config/client';
import Navbar from '@/components/NavBar';
import UpdateProfile from '@/components/UpdateProfile'
import ProfilePicUpdateModal from '@/components/UpdateProfilePic';
import Announcement from '@/components/Announcement';
import UpdateGrades from '@/components/UpdateGrades';

interface UserData {
  first_name: string;
  last_name: string;
  grade_level: string;
  role: string;
  profile_image: any;
  contact_number: number;
  address: string;
  grades: any;
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
  const [myGrades, setmyGrades] = useState<any>([]);
  const [isUpdateGradesOpen, setIsUpdateGradesOpen] = useState<boolean>(false);
  const [childData, setChildData] = useState<any>([]);


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
            setmyGrades(data.grades)
          }

          if (data.role === 'student') {
            getParent();
          }

          if (data.role === 'parent') {
            getChild(data.children);
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

    const getChild = async (ID: any) => {
      const { data, error } = await supabase
        .from('user_table')
        .select('*')
        .eq('user_id', ID)
        .single()

      if (data) {
        setChildData(data)
        console.log('child', data)
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

    fetchUserData();
  }, []);




  const handleProfileClick = () => {
    setSelectedInfo('profile'); // Set selectedInfo to 'profile' when profile is clicked
  };

  const handleGradesClick = () => {
    setSelectedInfo('grades');
  };

  const handleClassClick = () => {
    fetchStudentUsers();
    setSelectedInfo('class');
  };

  const handleAnnouncementClick = () => {
    setSelectedInfo('announcement');
  };

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true); // Open the modal
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false); // Close the modal
  };

  const handleOpenUpdateGrades = (user: any) => {
    setSelectedStudentData(user)
    setIsUpdateGradesOpen(true); // Open the modal
  };

  const handleCloseUpdateGrades = () => {
    setIsUpdateGradesOpen(false); // Close the modal
  };

  const handleOpenPicUpdateModal = () => {
    setIsPicUpdateOpen(true); // Open the modal
  };

  const handleClosePicUpdateModal = () => {
    setIsPicUpdateOpen(false); // Close the modal
  };



  const [studentUsers, setStudentUsers] = useState<any[]>([]);
  const [selectedStudentData, setSelectedStudentData] = useState(null);

  const fetchStudentUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_table')
        .select('*');
      if (error) {
        throw error;
      }
      if (data) {
        const students = data.filter((user: any) => user.role === 'student');
        setStudentUsers(students)
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  }



  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Main content */}
      <div className='flex-1'>
        {sessionCookie ? (
          userData ? (
            <div className='mb-10 text-center'>

              <Navbar
                profileButtonClick={handleProfileClick}
                gradesButtonClick={handleGradesClick}
                classButtonClick={handleClassClick}
                announcementButtonClick={handleAnnouncementClick}
              />

              {(userData.role === 'student' || userData.role === 'teacher') && selectedInfo === 'profile' && (
                <div className="flex p-6 pt-8">
                  {/* Profile Container */}
                  <div className="w-1/3 h-[1%] p-6 pb-[5rem] bg-white rounded-lg shadow-lg relative z-0">
                    {/* Image and ID */}
                    <div className="flex items-center mb-4">
                      <img
                        onClick={handleOpenPicUpdateModal}
                        src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${userData.profile_image}`}
                        alt="Profile Picture"
                        className="object-contain cursor-pointer rounded-full shadow-lg w-32 h-32 hover:opacity-75 transition-opacity duration-300 mr-4"
                      />
                      <div>
                        <p className="text-2xl font-semibold mb-1">ID: {sessionCookie}</p>
                        {/* Add any other ID-related info here */}
                      </div>
                    </div>
                    {/* Name */}
                    <div className="mb-4">
                      <p className="text-left text-2xl font-semibold">Name: {userData.first_name} {userData.last_name}</p>
                    </div>
                    {/* Address */}
                    <div className="mb-4">
                      <p className="text-left text-lg text-gray-600">Address: {userData.address}</p>
                    </div>
                    {/* Contact */}
                    <div className="mb-4">
                      <p className="text-left text-lg text-gray-600">Contact Number: {userData.contact_number}</p>
                    </div>
                    {/* Update Profile Button */}
                    <button
                      onClick={handleOpenProfileModal}
                      className="absolute bottom-6 left-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:bg-blue-600"
                    >
                      Update Profile
                    </button>
                  </div>
                  {/* Add your schedule component or content here with appropriate width */}
                  <div className="w-2/3 p-6 h-[87.5vh] bg-white rounded-lg shadow-lg ml-6">
                    {/* Schedule Component */}
                    {/* Add your schedule content here */}
                    Schedule
                  </div>
                  {/* Upload message */}
                  {uploadMessage && <p className="text-green-500">{uploadMessage}</p>}

                  {/* Profile update modal */}
                  {isProfileModalOpen && (
                    <UpdateProfile onClose={handleCloseProfileModal} userData={userData} />
                  )}

                  {isPicUpdateOpen && (
                    <ProfilePicUpdateModal onClose={handleClosePicUpdateModal} userData={userData} />
                  )}
                </div>)}

              {/* PArent */}
              {userData.role === 'parent' && selectedInfo === 'profile' && childData && (
                <div className="flex p-6 pt-8">
                  {/* Profile Container */}
                  <div className="w-1/3 h-[1%] p-6 pb-[5rem] bg-white rounded-lg shadow-lg relative z-0">
                    {/* Image and ID */}
                    <div className="flex items-center mb-4">
                      <img
                        onClick={handleOpenPicUpdateModal}
                        src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${userData.profile_image}`}
                        alt="Profile Picture"
                        className="object-contain cursor-pointer rounded-full shadow-lg w-32 h-32 hover:opacity-75 transition-opacity duration-300 mr-4"
                      />
                      <div>
                        <p className="text-2xl font-semibold mb-1">ID: {sessionCookie}</p>
                        {/* Add any other ID-related info here */}
                      </div>
                    </div>
                    {/* Name */}
                    <div className="mb-4">
                      <p className="text-left text-2xl font-semibold">Name: {userData.first_name} {userData.last_name}</p>
                    </div>
                    {/* Address */}
                    <div className="mb-4">
                      <p className="text-left text-lg text-gray-600">Address: {userData.address}</p>
                    </div>
                    {/* Contact */}
                    <div className="mb-4">
                      <p className="text-left text-lg text-gray-600">Contact Number: <b>{userData.contact_number}</b></p>
                    </div>
                    <div className="mb-4">
                      <p className="text-left text-lg text-gray-600">Child: <b>{childData.first_name}</b></p>
                    </div>
                    <div className="mb-4">
                      <p className="text-left text-lg text-gray-600">Child ID: <b>{childData.user_id}</b></p>
                    </div>
                    {/* Update Profile Button */}
                    <button
                      onClick={handleOpenProfileModal}
                      className="absolute bottom-6 left-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:bg-blue-600"
                    >
                      Update Profile
                    </button>
                  </div>
                  {/* Add your schedule component or content here with appropriate width */}
                  <div className="w-2/3 p-6 h-[87.5vh] bg-white rounded-lg shadow-lg ml-6">
                    {/* Schedule Component */}
                    {/* Add your schedule content here */}
                    {childData.first_name}'s Schedule
                  </div>
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

              {selectedInfo === 'grades' && userData.role === 'student' && (
                <div className="relative flex flex-col min-h-screen">
                  <div className="flex-grow">
                    {/* Your grid displaying grades */}
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px',  marginTop: '20px' }}>MY GRADES</p>
                    <div className="grid grid-cols-3 gap-4">
                      {myGrades.map((user: any) => (
                        <div key={user.subject} className="bg-gray-100 p-4 rounded-lg shadow-md">
                          <h2 className="text-lg font-semibold mb-2">{user.subject}</h2>
                          <p className="text-gray-600">Grade: {user.grade}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedInfo === 'grades' && userData.role === 'parent' && (
                <div className="relative flex flex-col min-h-screen">
                  <div className="flex-grow">
                    {/* Your grid displaying grades */}
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px',  marginTop: '20px' }}><b>{childData.first_name}'s</b> GRADES</p>
                    <div className="grid grid-cols-3 gap-4">
                      {childData.grades.map((user: any) => (
                        <div key={user.subject} className="bg-gray-100 p-4 rounded-lg shadow-md">
                          <h2 className="text-lg font-semibold mb-2">{user.subject}</h2>
                          <p className="text-gray-600">Grade: {user.grade}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Adviser's comment fixed at the bottom */}
                  <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md max-w-md mx-auto">
                    <div className="p-4">
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-0">Adviser's Comment</h3>
                        <p className="text-gray-600">{childData.comments || 'No comments available'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {selectedInfo === 'class' && (
                <div className="flex justify-center items-center h-full">
                  <div>
                    <table className="border-collapse border w-full" style={{ marginTop: '20px' }}>
                      <caption style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Student List</caption>

                      <thead>
                        <tr>
                          <th className="border p-2">ID</th>
                          <th className="border p-2">Name</th>
                          <th className="border p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentUsers && (
                          studentUsers.map((user: any, index: number) => (
                            <tr key={index}>
                              <td className="border p-2">{user.user_id}</td>
                              <td className="border p-2">{user.first_name} {user.last_name}</td>
                              <td className="border p-2">
                                <button onClick={() => handleOpenUpdateGrades(user)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                  Update Grades
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {isUpdateGradesOpen && (

                    <UpdateGrades onClose={handleCloseUpdateGrades} userData={selectedStudentData} />

                  )}

                </div>
              )}

              {selectedInfo === 'announcement' && (
                <div>
                  <Announcement />
                </div>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )
        ) : (
          <p className='text-red-500'>Error: Session cookie not found. Please log in.</p>
        )}
      </div>
    </div >
  );
};

export default StudentsPage;
