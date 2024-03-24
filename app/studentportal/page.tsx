'use client'

import React, { useState, useEffect } from 'react';
import supabase from '@/config/client';
import Navbar from '@/components/NavBar';
import UpdateProfile from '@/components/UpdateProfile'
import ProfilePicUpdateModal from '@/components/UpdateProfilePic';
import Announcement from '@/components/Announcement';
import Grade12Sched from '@/public/img/Grade-12.png'
import Grade11Sched from '@/public/img/Grade-11.png'
import Image from 'next/image';

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
  const [gradeLevel, setGradeLevel] = useState<any>()


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
            console.log('hey', data.grades)
            setmyGrades(data.grades)
            setGradeLevel(data.grade_level)
          }

          if (data.role === 'student') {
            getParent();
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

    fetchUserData();
  }, []);



  const handleProfileClick = () => {
    setSelectedInfo('profile'); // Set selectedInfo to 'profile' when profile is clicked
  };

  const handleGradesClick = () => {
    setSelectedInfo('grades');
  };

  const handleClassClick = () => {
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

  const handleOpenPicUpdateModal = () => {
    setIsPicUpdateOpen(true); // Open the modal
  };

  const handleClosePicUpdateModal = () => {
    setIsPicUpdateOpen(false); // Close the modal
  };


  const [initialGrades, setInitialGrades] = useState<any>([]);
  const [subjectToUpdate, setSubjectToUpdate] = useState<any>('')
  const [newGrade, setNewGrade] = useState<string>('')
  const [studentToGrade, setStudentToGrade] = useState<any>('')

  const handleTest = async () => {
    const { data, error } = await supabase
      .from("user_table")
      .select("*")
      .eq("user_id", studentToGrade)


    if (data) {
      setInitialGrades(data![0].grades)
      console.log(data![0].grades)
    }

  }

  const handleTest2 = async (subjectToUpdate: any, newGrade: string, studentToGrade: any) => {
    // Find the index of the subject to update in the initialGrades array
    const index = initialGrades.findIndex((item: { subject: string; grade: string; }) => item.subject === subjectToUpdate);

    if (index !== -1) {
      // Update the grade locally
      initialGrades[index].grade = newGrade;
      console.log(`Grade of ${subjectToUpdate} updated to ${newGrade}`);

      try {


        // Update the 'grades' column in the 'user_table' using Supabase
        const { data, error } = await supabase
          .from("user_table")
          .update({ grades: initialGrades })
          .eq("user_id", studentToGrade)
          .select("grades");

        if (error) {
          throw error;
        }

        console.log('Grades updated in Supabase:', data);
      } catch (error) {
        console.error('Error updating grades in Supabase:', error);
      }
    } else {
      console.log(`Subject ${subjectToUpdate} not found`);
    }
  }

  const handleTest3 = () => {
    handleTest2(subjectToUpdate, newGrade, studentToGrade)
  }

  const updatestudent = (e: any) => {
    const value = e.target.value

    setStudentToGrade(value)
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
                role={userData.role}
              />

              {selectedInfo === 'profile' && (
              <div className="flex p-6 pt-8">
                {/* Profile Container */}
                <div className="flex-1 h-[1%] p-6 pb-[5rem] bg-white rounded-lg shadow-lg relative">
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
                <div className="p-3 h-[87vh] bg-white rounded-lg shadow-lg ml-6 overflow-auto">
                  {/* Schedule Component */}
                  {/* Add your schedule content here */}
                  {gradeLevel === '12' ? (
                    <Image
                      src={Grade12Sched}
                      alt="Grade 12 Schedule"
                    />
                  ) : gradeLevel === '11' ? (
                    <Image
                      src={Grade11Sched}
                      alt="Grade 11 Schedule"
                    />
                  ) : (
                    <div>
                      No schedule
                    </div>
                  )}
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

              {/* test */}
              {selectedInfo === 'grades' && (
                <div className="grid grid-cols-2 gap-4">
                  {myGrades.map((user: any) => (
                    <div key={user.subject} className="bg-gray-100 p-4 rounded-lg shadow-md">
                      <h2 className="text-lg font-semibold mb-2">{user.subject}</h2>
                      <p className="text-gray-600">Grade: {user.grade}</p>
                    </div>
                  ))}
                </div>

              )}

              {selectedInfo === 'class' && (
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    id="studentToGrade"
                    value={studentToGrade}
                    onChange={updatestudent}
                    placeholder="Enter Student ID"
                    className="w-48 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <select
                    id="subjectToUpdate"
                    value={subjectToUpdate}
                    onChange={(e) => setSubjectToUpdate(e.target.value)}
                    className="w-48 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Subject</option>
                    {initialGrades.map((user: any) => (
                      <option key={user.subject} value={user.subject}>{user.subject}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    id="newGrade"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    placeholder="Enter New Grade"
                    className="w-48 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex">
                    <button onClick={handleTest} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Fetch</button>
                    <button onClick={handleTest3} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update</button>
                  </div>
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
    </div>
  );
};

export default StudentsPage;
