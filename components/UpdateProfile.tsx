import React, { useState } from 'react';
import supabase from '@/config/client';
import bcrypt from 'bcryptjs';

interface Props {
  onClose: () => void;
  userData: any;
}

const ProfileUpdateModal: React.FC<Props> = ({ onClose, userData }) => {
  const [contactNumber, setContactNumber] = useState<string>(userData.contact_number || '');
  const [address, setAddress] = useState<string>(userData.address || '');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [formValid, setFormValid] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [passwordError, setPasswordError] = useState<string>('');
  const [display, setDisplay] = useState<string>('initial');



  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContactNumber(value);

    // Validate contact number
    const isValidContactNumber = /^\d{0,11}$/.test(value);
    setFormValid(isValidContactNumber);
  };

  const handleChangePasswordDisplay = () => {
    setDisplay('second')
  }

  const handleInitialDisplay = () => {
    setDisplay('initial')
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
  };

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (newPassword && e.target.value !== newPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword) {
        alert('Please fill all fields and ensure the new passwords match.');
        return;
      }

      const passmatch = await bcrypt.compare(currentPassword, userData.user_password);

      if (!passmatch) {
        setPasswordError('Current password does not match')
        return;
      }
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password with a salt round of 10

      // Update the user's password in the database with the hashed password
      const { error: passwordUpdateError } = await supabase
        .from('user_table')
        .update({ user_password: hashedPassword })
        .eq('user_id', userData.user_id);

      if (passwordUpdateError) {
        throw passwordUpdateError;
      }

      alert('Password updated successfully.');
      onClose();
    } catch (error) {
      console.error('Error updating password:', error);
    }
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
          .update({ address: address }) // Update the contact_number field with the new value
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
      {display === 'initial' && (
        <div className="bg-white p-8 rounded-lg shadow-lg flex">
          <div className="mr-8">
            <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
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

              <label htmlFor="address" className="block text-gray-700 mb-1 mt-4">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter Address"
                className={`w-full border ${'border-gray-300'} rounded-lg p-2`}
              />
            </div>
            <div className="flex justify-end">
              <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-4">Cancel</button>
              <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
              <button onClick={handleChangePasswordDisplay} className="bg-blue-500 text-white px-4 py-2 rounded">Change Password</button>
            </div>
          </div>
        </div>
      )}
      {display === 'second' && (
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              placeholder="Enter Current Password"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />

            <label htmlFor="newPassword" className="block text-gray-700 mb-1 mt-4">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Enter New Password"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />

            <label htmlFor="confirmPassword" className="block text-gray-700 mb-1 mt-4">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm New Password"
              className={`w-full border ${passwordMatch ? 'border-gray-300' : 'border-red-500'} rounded-lg p-2 focus:outline-none focus:border-blue-500`}
            />
            {!passwordMatch && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>
            )}

            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button onClick={handleInitialDisplay} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-4">Back</button>
            <button onClick={handleChangePassword} className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:bg-blue-600 hover:bg-blue-600">Change Password</button>
          </div>
        </div>

      )}
    </div>
  );
};

export default ProfileUpdateModal;
