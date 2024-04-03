import React from 'react'

const StudentsForm = ({ handleAddUser, firstName, setFirstName, userID, setID, middleName, setMiddleName, password, setPassword, lastName, setLastName, gradeLevel, setGradeLevel, error }:any ) => {
  return (
    <>
        <form onSubmit={handleAddUser} className="mb-8 mt-4 ml-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-1">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-zinc-200 text-zinc-600 ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                />
              </div>
              <div>
                <label htmlFor="userID" className="block mb-1">
                  User ID:
                </label>
                <input
                  type="number"
                  id="userID"
                  value={userID}
                  onChange={(e) => setID(e.target.value)}
                  className="bg-zinc-200 text-zinc-600 ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                />
              </div>
              <div>
                <label htmlFor="middleName" className="block mb-1 ">
                  Middle Name:
                </label>
                <input
                  type="text"
                  id="middleName"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="bg-zinc-200  text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-200 text-zinc-600 ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block mb-1 ">
                  Last Name:
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-zinc-200  text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                />
              </div>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="bg-zinc-200 text-zinc-600 ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                style={{ width: '215px', height: '40px' }} // Adjust the width here
              >
                <option value="">Select Grade</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>

            </div>
            <div className="flex justify-between items-center mb-8">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
              >
                Add User
              </button>
              {error && <p className="text-red-600 mt-2">{error}</p>}

            </div>
        </form>
    </>
  )
}

export default StudentsForm