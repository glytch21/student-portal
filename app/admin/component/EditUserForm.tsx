import React from 'react'

const EditUserForm = ({ handleAddUser, deleteUserID, setDeleteUserID, handleDeleteUser, handleResetPassword }:any) => {
  return (
    <form onSubmit={handleAddUser} className="mb-8 mt-4 ml-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="">
                <input
                    type="text"
                    placeholder="Enter User ID"
                    value={deleteUserID}
                    onChange={(e) => setDeleteUserID(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDeleteUser}
                        className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer mt-2"
                    >
                        Delete
                    </button>
                    <button
                        onClick={handleResetPassword}
                        className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer mt-2"
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    </form>
  )
}

export default EditUserForm