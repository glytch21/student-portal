'use client'

import React from 'react';
import supabase from '@/config/client';
import { useState, useEffect } from 'react';
import ProfileInfo from '@/components/ProfileInfo'

interface NavbarProps {
  firstButtonClick: () => void;
  secondButtonClick: () => void;
  thirdButtonClick?: () => void;
  fourthButtonClick?: () => void;
 
  role: string;
}

const Navbar: React.FC<NavbarProps> = ({ firstButtonClick, secondButtonClick, thirdButtonClick, fourthButtonClick, role }) => {

  const [searchValue, setSearchValue] = useState('');
  const [resultUsers, setResultUsers] = useState<any>([])
  const [lastnameResults, setlastnamResults] = useState<any>([])
  const [isSearching, setIsSearching] = useState(false);
  const [profileInfo, setProfileInfo] = useState(null);
  const [profileInfoModal, setProfileInfoModal] = useState(false);

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

      {role === 'student' && (
        <ul style={{ display: 'flex', listStyleType: 'none', height: '100%', alignItems: 'center' }}>
          <li style={{ marginRight: '50px', marginLeft: '10px' }}>
            <p className='font-bold text-lg'>Student Portal</p>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={firstButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Profile</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={secondButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Grades</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={thirdButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Announcements</button>
          </li>
          <li className="relative">
            <input
              type="text"
              id="searchValue"
              value={searchValue}
              onChange={handleSearchValue}
              placeholder="Search User..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
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

      {role === 'teacher' && (
        <ul style={{ display: 'flex', listStyleType: 'none', height: '100%', alignItems: 'center' }}>
          <li style={{ marginRight: '50px', marginLeft: '10px' }}>
            <p className='font-bold text-lg'>Teachers Portal</p>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={firstButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Profile</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={secondButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Grades</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={thirdButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Announcements</button>
          </li>
          <li className="relative">
            <input
              type="text"
              id="searchValue"
              value={searchValue}
              onChange={handleSearchValue}
              placeholder="Search User..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
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

      {role === 'parent' && (
        <ul style={{ display: 'flex', listStyleType: 'none', height: '100%', alignItems: 'center' }}>
          <li style={{ marginRight: '50px', marginLeft: '10px' }}>
            <p className='font-bold text-lg'>Parent Portal</p>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={firstButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Profile</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={secondButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Announcements</button>
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
