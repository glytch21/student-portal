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


  role: string;
}

const Navbar: React.FC<NavbarProps> = ({ profileButtonClick, gradesButtonClick, classButtonClick, announcementButtonClick, role }) => {

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
    <nav className="flex justify-between items-center h-60px p-3 bg-cyan-600 text-white px-4">

      {/* Left Side - Navigation Links */}
      <ul className="flex list-none space-x-4">
        {role === 'student' && (
          <>
            <li>
              <p className="font-bold text-lg">Student Portal</p>
            </li>
            <li>
              <button onClick={profileButtonClick} className="nav-button">Profile</button>
            </li>
            <li>
              <button onClick={gradesButtonClick} className="nav-button">Grades</button>
            </li>
            <li>
              <button onClick={announcementButtonClick} className="nav-button">Announcements</button>
            </li>
          </>
        )}

        {role === 'teacher' && (
          <>
            <li>
              <p className="font-bold text-lg">Teachers Portal</p>
            </li>
            <li>
              <button onClick={profileButtonClick} className="nav-button">Profile</button>
            </li>
            <li>
              <button onClick={classButtonClick} className="nav-button">Class</button>
            </li>
            {/* Add more teacher-specific navigation items here */}
          </>
        )}

        {/* Uncomment and modify as needed for parent navigation */}
        {/* {role === 'parent' && (
      <>
        <li>
          <p className="font-bold text-lg">Parent Portal</p>
        </li>
        <li>
          <button onClick={firstButtonClick} className="nav-button">Profile</button>
        </li>
        <li>
          <button onClick={secondButtonClick} className="nav-button">Announcements</button>
        </li>
        {/* Add more parent-specific navigation items here *\/}
      </>
    )} */}
      </ul>

      {/* Right Side - Search Bar and Logout Button */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
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
            className="bg-zinc-200 text-zinc-600  ring-1  ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400 mr-2"
          />
          {isSearching && (
            <div className="absolute top-full left-0 w-full bg-white text-black p-2 rounded-md mt-1 z-10 border border-black border-b">
              {/* Display search results */}
                <div>
                  {resultUsers.map((user: any) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => handleOpenModal(user)}
                    >
                      <img
                        src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${user.profile_image}`}
                        alt="Profile Picture"
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{user.first_name} {user.last_name}</span>
                    </div>
                  ))}
                </div>
       
              {/* Display message if no search results */}
              {/* {resultUsers.length === 0 && <div>No results found.</div>} */}

              {profileInfoModal && (
                <ProfileInfo user={profileInfo} onClose={handleCloseModal} />
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="nav-button p-2 bg-red-500 rounded-md text-white uppercase font-semibold p-2 cursor-pointer bg-gradient-to-r from-[#EB3349] to-[#F45C43] px-6 py-2  shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-10px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] focus:shadow-[inset_-12px_-8px_40px_#46464620] transition-shadow">Logout</button>
      </div>

    </nav>


  );
};

export default Navbar;
