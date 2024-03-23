'use client'

import React from 'react';
import supabase from '@/config/client';
import { useState, useEffect } from 'react';
import ProfileInfo from '@/components/ProfileInfo'

interface NavbarProps {
  profileButtonClick: () => void;
  gradesButtonClick?: () => void;
  classButtonClick?: () => void;
  announcementButtonClick?: () => void;

}
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

const Navbar: React.FC<NavbarProps> = ({ profileButtonClick, gradesButtonClick, classButtonClick, announcementButtonClick }) => {

  const [searchValue, setSearchValue] = useState('');
  const [resultUsers, setResultUsers] = useState<any>([])
  const [lastnameResults, setlastnamResults] = useState<any>([])
  const [isSearching, setIsSearching] = useState(false);
  const [profileInfo, setProfileInfo] = useState(null);
  const [profileInfoModal, setProfileInfoModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const getSessionCookie = () => {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];
      return cookie || '';
    };

    const cookieValue = getSessionCookie();

    const fetchUserData = async () => {
      if (cookieValue) {
        try {
          const { data, error } = await supabase
            .from('user_table')
            .select('*')
            .eq('user_id', cookieValue)
            .single();

          setCurrentUser(data)

          if (error) {
            throw error;
          }


        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSearch = async () => {

    try {
      const { data: firstname, error: firstnameError } = await supabase
        .from('user_table')
        .select('*')
        .ilike(
          'first_name',
          `%${searchValue}%`
        );

      const { data: lastname, error: lastnameError } = await supabase
        .from('user_table')
        .select('*')
        .ilike(
          'last_name',
          `%${searchValue}%`
        );

      setResultUsers(firstname);
      setlastnamResults(lastname);
      setIsSearching(true);
    } catch (error) {
      console.log('Error searching:');
    }
  };


  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsSearching(false);
    }, 250);
  };

  const handleLogout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  };

  const handleOpenModal = (user: any) => {
    setProfileInfoModal(true)
    setProfileInfo(user)
  };

  const handleCloseModal = () => {
    setProfileInfoModal(false)
    setProfileInfo(null)
  };

  return (
    <nav style={{ height: '60px', backgroundColor: '#333', color: '#fff' }}>

      {/* nav for students */}

      {currentUser && currentUser.role === 'student' && (
        <ul style={{ display: 'flex', listStyleType: 'none', height: '100%', alignItems: 'center' }}>
          <li style={{ marginRight: '50px', marginLeft: '10px' }}>
            <p className='font-bold text-lg'>Student Portal</p>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={profileButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Profile</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={gradesButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Grades</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={announcementButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Announcements</button>
          </li>
          <li className="relative">
            <input
              type="text"
              id="searchValue"
              value={searchValue}
              onChange={handleSearchValue}
              placeholder="Search User..."
              onKeyPress={(e) => {
                handleSearch()
              }}
              onBlur={handleInputBlur}
              className="w-full border border-gray-300 rounded-lg p-2 text-black"
            />
            {isSearching && (
              <div className="absolute top-full left-0 w-full bg-white text-black p-2 rounded-md mt-1 z-10 border border-black border-b">
                <div>
                  {resultUsers.map((user: any) => (
                    <div
                      key={user.id}
                      className="bg-white text-black p-2 rounded-md border border-black cursor-pointer flex items-center"
                      onClick={() => handleOpenModal(user)}
                    >
                      <img
                        src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${user.profile_image}`}
                        alt="Profile Picture"
                        className="object-contain rounded-full shadow-lg w-10 h-10 mr-4"
                        style={{ fontSize: '1.5em' }}
                      />
                      <div>
                        <div className="mb-1" style={{ fontSize: '13px' }}>{user.first_name} {user.last_name}</div>
                      </div>
                    </div>
                  ))}

                  {lastnameResults.map((user: any) => (
                    <div
                      key={user.id}
                      className="bg-white text-black p-2 rounded-md border border-black cursor-pointer flex items-center"
                      onClick={() => handleOpenModal(user)}
                    >
                      <img
                        src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${user.profile_image}`}
                        alt="Profile Picture"
                        className="object-contain rounded-full shadow-lg w-10 h-10 mr-4"
                        style={{ fontSize: '1.5em' }}
                      />
                      <div>
                        <div className="mb-1" style={{ fontSize: '13px' }}>{user.first_name} {user.last_name}</div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            )}
          </li>

          {profileInfoModal && (
            <ProfileInfo user={profileInfo} onClose={handleCloseModal} />
          )}

          <li>
            <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Logout</button>
          </li>

        </ul>
      )}

      {/* nav for teachers */}

      {currentUser && currentUser.role === 'teacher' && (
        <ul style={{ display: 'flex', listStyleType: 'none', height: '100%', alignItems: 'center' }}>
          <li style={{ marginRight: '50px', marginLeft: '10px' }}>
            <p className='font-bold text-lg'>Teachers Portal</p>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={profileButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Profile</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={classButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Class</button>
          </li>

          <li className="relative">
            <input
              type="text"
              id="searchValue"
              value={searchValue}
              onChange={handleSearchValue}
              placeholder="Search User..."
              onKeyPress={(e) => {
                handleSearch()
              }}
              onBlur={handleInputBlur}
              className="w-full border border-gray-300 rounded-lg p-2 text-black"
            />
            {isSearching && (
              <div className="absolute top-full left-0 w-full bg-white text-black p-2 rounded-md mt-1 z-10 border border-black border-b">
                <div>
                  {resultUsers.map((user: any) => (
                    <div
                      key={user.id}
                      className="bg-white text-black p-2 rounded-md border border-black cursor-pointer flex items-center"
                      onClick={() => handleOpenModal(user)}
                    >
                      <img
                        src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${user.profile_image}`}
                        alt="Profile Picture"
                        className="object-contain rounded-full shadow-lg w-10 h-10 mr-4"
                        style={{ fontSize: '1.5em' }}
                      />
                      <div>
                        <div className="mb-1" style={{ fontSize: '13px' }}>{user.first_name} {user.last_name}</div>
                      </div>
                    </div>
                  ))}

                  {lastnameResults.map((user: any) => (
                    <div
                      key={user.id}
                      className="bg-white text-black p-2 rounded-md border border-black cursor-pointer flex items-center"
                      onClick={() => handleOpenModal(user)}
                    >
                      <img
                        src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${user.profile_image}`}
                        alt="Profile Picture"
                        className="object-contain rounded-full shadow-lg w-10 h-10 mr-4"
                        style={{ fontSize: '1.5em' }}
                      />
                      <div>
                        <div className="mb-1" style={{ fontSize: '13px' }}>{user.first_name} {user.last_name}</div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            )}
          </li>

          {profileInfoModal && (
            <ProfileInfo user={profileInfo} onClose={handleCloseModal} />
          )}

          <li>
            <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Logout</button>
          </li>

        </ul>
      )}

      {/* nav for parents */}

      {currentUser && currentUser.role === 'parent' && (
        <ul style={{ display: 'flex', listStyleType: 'none', height: '100%', alignItems: 'center' }}>
          <li style={{ marginRight: '50px', marginLeft: '10px' }}>
            <p className='font-bold text-lg'>Parent Portal</p>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={profileButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Profile</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={gradesButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Report Card</button>
          </li>



          <li>
            <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Logout</button>
          </li>
        </ul>
      )}
    </nav>


  );
};

export default Navbar;
