import React from 'react'

const SubjectForm = ({ addSubjectStudent, setAddSubjectStudent, subjectToAdd, setSubjectToAdd, handleAddSubject }:any ) => {
  return (
    <div className="">
        <input
            type="text"
            id="studentID"
            name="studentID"
            value={addSubjectStudent}
            onChange={(e) => setAddSubjectStudent(e.target.value)}
            placeholder="Enter StudentID"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        />

        <input
            type="text"
            id="subjectToAdd"
            name="subjectToAdd"
            value={subjectToAdd}
            onChange={(e) => setSubjectToAdd(e.target.value)}
            placeholder="Enter Subject"
            className="mt-2 mb-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <button className="border-none bg-red-500 rounded-md text-white uppercase font-semibold p-2" onClick={handleAddSubject}>Add Subject</button>
    </div>
  )
}

export default SubjectForm