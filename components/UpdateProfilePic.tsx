import React, { useState } from 'react';
import supabase from '@/config/client';

interface Props {
  onClose: () => void;
  userData: any;
}

const ProfilePicUpdateModal: React.FC<Props> = ({ onClose, userData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileName = e.target.files?.[0]?.name;

    if (e.target.files)
      setFile(e.target.files?.[0]);

    if (fileName) {
      document.getElementById('file-name')!.textContent = fileName;
    }
  };


  const handleReset = async () => {
    try {
      // Delete the old image from the storage bucket
      if (userData.profile_image !== 'default_image.png') {
        await supabase.storage
          .from('images')
          .remove([userData.profile_image]);
      }

      // Update the user's profile with the default image filename
      const { error: profileUpdateError } = await supabase
        .from('user_table')
        .update({ profile_image: 'default_image.png' }) // Update the profile_image field with the default filename
        .eq('user_id', userData.user_id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

    } catch (error) {
      console.error('Error resetting profile picture:', error);
      // Handle error
    }
  };


  const handleUpload = async () => {
    try {
      // Form validation
      if (!file) {
        setError('Please choose an image to upload.');
        return;
      }

      // Delete the old image from the storage bucket if it's not the default image
      if (userData.profile_image !== 'default_image.png') {
        await supabase.storage
          .from('images')
          .remove([userData.profile_image]);
      }

      // Upload the new image
      const fileName = `${userData.user_id}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Update the user's profile with the uploaded image filename
      const { error: profileUpdateError } = await supabase
        .from('user_table')
        .update({ profile_image: fileName }) // Update the profile_image field with the new filename
        .eq('user_id', userData.user_id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      // Close the modal after successful upload
    } catch (error) {
      alert('Error updating profile:');
    }
  };


  
return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Update Profile Picture</h2>
        {/* File upload input */}
        <div className="mb-4 flex justify-center">
          <img
            src={`https://tfvmclypbhyhkgxjmuid.supabase.co/storage/v1/object/public/images/${userData.profile_image}`}
            alt="Profile Picture"
            className="object-contain rounded-full shadow-lg w-40 h-40 mx-auto"
          />
        </div>

        <label htmlFor="file-upload" className="mb-2 mt-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg inline-block">
          Upload File
        </label>
        <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
        <span id="file-name" className="block text-sm text-gray-600"></span>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">Close</button>
          <button onClick={handleReset} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">Reset</button>
          <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicUpdateModal;
