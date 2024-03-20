import React, { useState } from 'react';
import supabase from '@/config/client';

interface Props {
  user: any;
  onClose: () => void;
}

const ProfilePicUpdateModal: React.FC<Props> = ({ user, onClose }) => {

  const handleTest = () => {
    console.log(user)
  }
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex items-start w-96">
        <img
          src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${user.profile_image}`}
          alt="Profile Picture"
          className="object-cover rounded-lg shadow-lg w-32 h-32 mr-4"
        />
        <div>
          <p className="text-2xl font-semibold text-black">{user.first_name} {user.last_name}</p>
          <p className="text-lg text-gray-600">{user.grade_level}</p>
        </div>
        <button onClick={onClose} className="ml-auto mt-1 text-gray-600 hover:text-gray-800 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

};

export default ProfilePicUpdateModal;
