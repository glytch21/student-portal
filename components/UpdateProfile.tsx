import React, { useState } from 'react';
import supabase from '@/config/client';

interface Props {
  onClose: () => void;
  userData: any;
}

const ProfileUpdateModal: React.FC<Props> = ({ onClose, userData }) => {
  const [contactNumber, setContactNumber] = useState<string>(userData.contact_number || '');
  const [address, setAddress] = useState<string>(userData.address || '');
  const [formValid, setFormValid] = useState<boolean>(false);


  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContactNumber(value);

    // Validate contact number
    const isValidContactNumber = /^\d{0,11}$/.test(value);
    setFormValid(isValidContactNumber);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
  };

  const handleUpload = async () => {
    try {
      // Check form validity before submission
      if (!formValid) {
        alert('Form is not valid');
        return;
      }


      if (contactNumber) {
        const { error: contactUpdateError } = await supabase
          .from('user_table')
          .update({ contact_number: contactNumber }) // Update the contact_number field with the new value
          .eq('user_id', userData.user_id);

        if (contactUpdateError) {
          throw contactUpdateError;
        }
      }

      if (address) {
        const { error: addressUpdateError } = await supabase
          .from('user_table')
          .update({ address: address}) // Update the contact_number field with the new value
          .eq('user_id', userData.user_id);

        if (addressUpdateError) {
          throw addressUpdateError;
        }
      }

      // Close the modal after successful upload
      alert('Success')
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
        {/* Contact number input */}
        <div className="mb-4">
          <label htmlFor="contactNumber" className="block text-gray-700 mb-1">Contact Number</label>
          <input
            type="text"
            id="contactNumber"
            value={contactNumber}
            onChange={handleContactNumberChange}
            placeholder="Enter Contact Number"
            className={`w-full border ${/^\d{0,11}$/.test(contactNumber) ? 'border-gray-300' : 'border-red-500'} rounded-lg p-2`}
          />
          {!/^\d{0,11}$/.test(contactNumber) && (
            <p className="text-red-500 text-xs mt-1">Please enter a valid number.</p>
          )}

          <label htmlFor="contactNumber" className="block text-gray-700 mb-1">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter Address"
            className={`w-full border 'border-gray-300' rounded-lg p-2`}
          />

        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-4">Cancel</button>
          <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
        </div>
      </div>
    </div>
  );

};

export default ProfileUpdateModal;
