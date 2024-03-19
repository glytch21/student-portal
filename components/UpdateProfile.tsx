import React, { useState } from 'react';
import supabase from '@/config/client';

interface Props {
  onClose: () => void;
  userData: any;
}

const ProfileUpdateModal: React.FC<Props> = ({ onClose, userData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [contactNumber, setContactNumber] = useState<string>(userData.contact_number || '');
  const [formValid, setFormValid] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContactNumber(value);

    // Validate contact number
    const isValidContactNumber = /^\d{0,11}$/.test(value);
    setFormValid(isValidContactNumber);
  };

  const handleUpload = async () => {
    try {
      // Check form validity before submission
      if (!formValid) {
        console.error('Form is not valid');
        return;
      }

      // Update contact number if provided
      if (contactNumber !== userData.contact_number) {
        const { error: contactUpdateError } = await supabase
          .from('user_table')
          .update({ contact_number: contactNumber }) // Update the contact_number field with the new value
          .eq('user_id', userData.user_id);

        if (contactUpdateError) {
          throw contactUpdateError;
        }
      }

      // Upload image if selected
      if (file) {
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
      }

      // Close the modal after successful upload
      alert('Success')
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
        {/* File upload input */}
        <input type="file" onChange={handleFileChange} />
        {/* Contact number input */}
        <input
          type="text"
          value={contactNumber}
          onChange={handleContactNumberChange}
          placeholder="Enter Contact Number"
          className={`mt-4 p-2 border ${/^\d{0,11}$/.test(contactNumber) ? 'border-gray-300' : 'border-red-500'} rounded`}
        />
        {!/^\d{0,11}$/.test(contactNumber) && (
          <p className="text-red-500 text-xs mt-1">Please enter a valid number.</p>
        )}
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mt-4" disabled={!formValid}>Update</button>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;
