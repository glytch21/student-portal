"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/config/client";
import bcrypt from "bcryptjs";
import TeachersTable from "@/components/TeachersTable";
import StudentsTable from "@/components/StudentsTable";
import ParentsTable from "@/components/ParentsTable";
import Announcement from "@/components/Announcement";
import AnnouncementAdmin from "./component/AnnouncementAdmin";

import { PiStudentFill as StudentIcon } from "react-icons/pi"
import { FaChalkboardTeacher as TeacherIcon, FaBook as SubjectIcon } from "react-icons/fa";
import { RiParentFill as ParentIcon } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import SchoolLogo from '@/public/img/school-logo.png'
import { MdAssignmentAdd as AddAnnouncementIcon } from "react-icons/md";

import { FaCircleArrowLeft as LeftArrow, FaCircleArrowRight as RightArrow, FaTable as UserTable, FaRegNewspaper as AnnouncementIcon } from "react-icons/fa6";

import Image from "next/image";
import AllUsersTable from "@/components/AllUsersTable";

import TeachersForm from "./component/TeachersForm";
import StudentsForm from "./component/StudentsForm";
import SubjectForm from "./component/SubjectForm";
import ParentsForm from "./component/ParentsForm";
import EditUserForm from "./component/EditUserForm";

interface UserData {
  first_name: string;
}

type studentMinibar = 'table' | 'student-form' | 'subject-form'

const AdminPage = () => {
  const [teacherUsers, setTeacherUsers] = useState<any[]>([]);
  const [studentUsers, setStudentUsers] = useState<any[]>([]);
  const [parentUsers, setParentUsers] = useState<any[]>([]);
  const [allUsers, setallUsers] = useState<any[]>([]);
  const [userID, setID] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [role, setRole] = useState("student");
  const [childID, setChildID] = useState("");
  const [error, setError] = useState("");

  const [showTeachers, setShowTeachers] = useState<boolean>(false);
  const [showDeleteUser, setShowDeleteUser] = useState<boolean>(false);
  const [showStudents, setShowStudents] = useState<boolean>(false);
  const [showParents, setShowParents] = useState<boolean>(false);
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(true)

  const [userData, setUserData] = useState<UserData | null>(null);
  const [sessionCookie, setSessionCookie] = useState("");
  const [deleteUserID, setDeleteUserID] = useState("");

  const [addSubjectStudent, setAddSubjectStudent] = useState('')
  const [subjectToAdd, setSubjectToAdd] = useState('')

  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false)
  const [teacherMinibar, setTeacherMinibar] = useState<boolean>(false)
  const [studentMinibar, setStudentMinibar] = useState<studentMinibar>('table')
  const [parentMinibar, setParentMinibar] = useState<boolean>(false)
  const [announcementMinibar, setAnnouncementMinibar] = useState<boolean>(false)

  const handleAddSubject = async () => {
    const { data: initial, error } = await supabase
      .from('user_table')
      .select('grades')
      .eq('user_id', addSubjectStudent);

    if (initial) {
      console.log('initial', initial);
      // Assuming grades is an array within each user's data
      let updatedGrades = [...initial[0].grades]; // Create a copy of the grades array

      // Push the new subject to the copied grades array
      updatedGrades.push({
        subject: subjectToAdd,
        grade: 'Not Yet Available'
      });

      // Update the user_table with the new grades data
      const { data: updatedData, error: updateError } = await supabase
        .from('user_table')
        .update({ grades: updatedGrades })
        .eq('user_id', addSubjectStudent);

      alert('Subject added successfully');

    } else {
      // Handle case where initial data is empty or undefined
      alert('Initial data not found or empty: ' + error.message);
    }
  };

  useEffect(() => {
    // Function to retrieve the value of the session cookie
    const getSessionCookie = () => {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session="))
        ?.split("=")[1];
      return cookie || "";
    };

    // Set the value of the session cookie in state
    const cookieValue = getSessionCookie();
    setSessionCookie(cookieValue);

    // Fetch user data from Supabase using the user_ID stored in the session cookie
    const fetchUserData = async () => {
      if (cookieValue) {
        try {
          const { data, error } = await supabase
            .from("user_table")
            .select("*")
            .eq("user_id", cookieValue)
            .single();
          if (error) {
            throw error;
          }
          if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    const userTable = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_table' },
        (payload: { [key: string]: any }) => {
          setUserData(payload.new);
        }
      )
      .subscribe();

    fetchUserData();
    fetchData();
  }, []);



  const handleLogout = () => {
    // Clear the session cookie by setting its expiration date to a past time
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  };

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from("user_table").select("*");
      if (error) {
        throw error;
      }
      if (data) {
        // Separate users into teacher, student, and parent arrays
        const teachers = data.filter((user: any) => user.role === "teacher");
        const students = data.filter((user: any) => user.role === "student");
        const parents = data.filter((user: any) => user.role === "parent");
        setallUsers(data);

        // Fetch child data for each parent
        const parentsWithChildren = await Promise.all(
          parents.map(async (parent: any) => {
            if (parent.children) {
              const childrenIds = parent.children
                .split(",")
                .map((id: string) => id.trim());
              const childrenData = await Promise.all(
                childrenIds.map(async (childId: string) => {
                  const { data: child, error: childError } = await supabase
                    .from("user_table")
                    .select("*")
                    .eq("user_id", childId)
                    .single();
                  if (childError) {
                    console.error(
                      `Error fetching child data for parent ${parent.user_id}:`,
                      childError
                    );
                  }
                  return child;
                })
              );
              return {
                ...parent,
                children: childrenData.filter(Boolean), // Filter out any undefined children
              };
            }
            return parent;
          })
        );

        setTeacherUsers(teachers);
        setStudentUsers(students);
        setParentUsers(parentsWithChildren);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleTest = async (e: any) => {
  //   e.preventDefault();
  //   console.log("all", allUsers);
  //   console.log("parent", parentUsers);
  //   console.log("student", studentUsers);
  // };

  const toggleTeachersTable = () => {
    setRole('teacher')
    setError('')
    setID("");
    setPassword("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setShowDeleteUser(false)
    setShowTeachers(true);
    setShowStudents(false); // Close students table
    setShowParents(false); // Close parents table
    setShowAnnouncement(false)
  };

  const toggleStudentsTable = () => {
    setRole('student')
    setError('')
    setID("");
    setPassword("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setShowDeleteUser(false)
    setShowStudents(true)
    setShowTeachers(false)
    setShowParents(false)
    setShowAnnouncement(false)
  };

  const toggleParentsTable = () => {
    setRole('parent')
    setError('')
    setID("");
    setPassword("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setShowDeleteUser(false)
    setShowParents(true)
    setShowTeachers(false)
    setShowStudents(false)
    setShowAnnouncement(false)
  };

  const toggleDeleteUserTable = () => {
    setRole('')
    setError('')
    setID("");
    setPassword("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setShowDeleteUser(true)
    setShowParents(false)
    setShowTeachers(false)
    setShowStudents(false)
    setShowAnnouncement(false)
  };

  const toggleAnnouncementPage = () => {
    setError('');
    setShowParents(false)
    setShowTeachers(false)
    setShowStudents(false)
    setShowAnnouncement(true)
    setShowDeleteUser(false)
  }
  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userID || !password || !firstName || !middleName || !lastName) {
      setError("Please provide all required information");
      return;
    }
    try {
      // Check if the user ID already exists
      const { data: existingUser, error } = await supabase
        .from("user_table")
        .select("user_id")
        .eq("user_id", userID)
        .single();
      if (existingUser) {
        setError("User ID already exists. Please choose a different one.");
        return;
      }
      // If role is parent, check if the child ID exists
      if (role === "parent") {
        const { data: childUser } = await supabase
          .from("user_table")
          .select("*")
          .eq("user_id", childID)
          .single();
        if (!childUser) {
          setError("Child user does not exist.");
          return;
        }
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error: insertionError } = await supabase
        .from("user_table")
        .insert([
          {
            user_id: userID,
            user_password: hashedPassword,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            role: role,
            children: childID,
            grade_level: gradeLevel
          },
        ]);
      if (insertionError) {
        throw insertionError;
      }
      alert("success");
      fetchData();
      // Clear the form fields after successful addition
      setID("");
      setPassword("");
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setRole("");
      setChildID("");
      setError("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const { data: userToDelete } = await supabase
        .from("user_table")
        .select("*")
        .eq("user_id", deleteUserID)
        .single();
      if (!userToDelete) {
        setError("User with given ID does not exist.");
        return;
      }
      // Prompt for confirmation before deleting
      const confirmation = window.confirm(
        `Are you sure you want to delete user ${deleteUserID}?`
      );
      if (confirmation) {
        // Check if the user has a profile image to delete
        if (userToDelete.profile_image && userToDelete.profile_image !== 'default_image.png') {
          // Remove profile image from Supabase storage
          const { error: imageError } = await supabase.storage
            .from("images")
            .remove([userToDelete.profile_image]);
          if (imageError) {
            throw imageError;
          }
        }
        // Delete the user from the user_table
        const { error } = await supabase
          .from("user_table")
          .delete()
          .eq("user_id", deleteUserID);

        if (error) {
          throw error;
        }
        alert("User deleted successfully");
        fetchData();
        setDeleteUserID("");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const newPassword = await bcrypt.hash(deleteUserID, 10);

      const { error } = await supabase
        .from("user_table")
        .update({ user_password: newPassword })
        .eq("user_id", deleteUserID);

      if (error) {
        throw error;
      }

      alert("Password reset successfully.");
    } catch (error) {
      alert("User doesn't exist");
    }
  };



  return (
    <body className="bg-gray-100">
      <nav className="bg-cyan-600 p-6 flex items-center gap-1 relative top-0 w-full justify-end">
        <div className="text-2xl font-semibold text-white flex gap-4 items-center drop-shadow-lg">
          Admin {sessionCookie && userData ? userData.first_name : '...'}
          {/* Admin Photo Here */}
        </div>
        <div className={`bg-cyan-600 fixed inset-y-0 left-0 ${toggleSidebar && 'w-[29vmin]'}`}>
          <div className="w-8 last:h-8 rounded-full bg-white absolute top-[50%] right-[-1.5vmin] cursor-pointer" onClick={() => setToggleSidebar(!toggleSidebar)}>
            {toggleSidebar ? (<LeftArrow className="w-full h-full text-cyan-700 hover:text-cyan-500" />) : (<RightArrow className="w-full h-full text-cyan-700 hover:text-cyan-500 transition-colors" />)}
          </div>
          <div className="p-4 flex justify-start items-center gap-4">
            <Image
              src={SchoolLogo}
              alt="School Logo"
              className="h-[3rem] w-[3rem] drop-shadow-md"
            />
            {toggleSidebar && showAnnouncement && (
              <h1 className="text-xl text-white font-bold drop-shadow-lg">Admin Dashboard</h1>
            )}
            {toggleSidebar && showTeachers && (
              <h1 className="text-xl text-white font-bold drop-shadow-lg">Teacher's Table</h1>
            )}
            {toggleSidebar && showStudents && (
              <h1 className="text-xl text-white font-bold drop-shadow-lg">Student's Table</h1>
            )}
            {toggleSidebar && showParents && (
              <h1 className="text-xl text-white font-bold drop-shadow-lg">Parent's Table</h1>
            )}
            {toggleSidebar && showDeleteUser && (
              <h1 className="text-xl text-white font-bold drop-shadow-lg">Edit User</h1>
            )}

          </div>
          <div className="w-full h-[1px] bg-white mb-3">
            {/* Line */}
          </div>
          <div className="flex flex-col text-white text-lg">
            <div onClick={toggleAnnouncementPage}>
              <div className={`flex gap-3 items-center ${!toggleSidebar && 'justify-center'} p-4 hover:cursor-pointer hover:bg-cyan-700 ${showAnnouncement && 'bg-cyan-700'}`}>
                <AnnouncementIcon className="text-2xl" />
                {toggleSidebar && 'Announcement'}
              </div>
            </div>
            <div onClick={toggleTeachersTable}>
              <div className={`flex gap-3 items-center ${!toggleSidebar && 'justify-center'} p-4 hover:cursor-pointer hover:bg-cyan-700 ${showTeachers && 'bg-cyan-700'}`}>
                <TeacherIcon className="text-2xl" />
                {toggleSidebar && 'Teachers'}
              </div>
            </div>
            <div onClick={toggleStudentsTable}>
              <div className={`flex gap-3 items-center ${!toggleSidebar && 'justify-center'} p-4 hover:cursor-pointer hover:bg-cyan-700 ${showStudents && 'bg-cyan-700'}`}>
                <StudentIcon className="text-2xl" />
                {toggleSidebar && 'Students'}
              </div>
            </div>
            <div onClick={toggleParentsTable}>
              <div className={`flex gap-3 items-center ${!toggleSidebar && 'justify-center'} p-4 hover:cursor-pointer hover:bg-cyan-700 ${showParents && 'bg-cyan-700'}`}>
                <ParentIcon className="text-2xl" />
                {toggleSidebar && 'Parents'}
              </div>
            </div>

            <div onClick={toggleDeleteUserTable}>
              <div className={`flex gap-3 items-center ${!toggleSidebar && 'justify-center'} p-4 hover:cursor-pointer hover:bg-cyan-700 ${showDeleteUser && 'bg-cyan-700'}`}>
                <FaUserEdit className="text-2xl" />
                {toggleSidebar && 'Edit User'}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {showAnnouncement && (
        <div className={`${toggleSidebar && 'ml-[20rem]'} flex items-center justify-center gap-4`}>
          <div className="flex items-center justify-between rounded-full w-[40vw] whitespace-nowrap md:text-xs xl:text-xl border-2 border-black duration-300 absolute bottom-[10%] left-[50%] translate-x-[-50%] translate-y-[50%] font-semibold shadow-2xl z-10">
            <div className={`flex items-center justify-center gap-4 w-[50%] h-full p-[1rem] ${!announcementMinibar && 'bg-[#332D2D] text-white'} hover:opacity-95 duration-100 rounded-s-full cursor-pointer`} onClick={() => setAnnouncementMinibar(false)}>
              <AnnouncementIcon className="text-2xl" />
              Announcements
            </div>
            <div className={`flex items-center justify-center gap-4 w-[50%] h-full p-[1rem] ${announcementMinibar && 'bg-[#332D2D] text-white'} hover:opacity-95 duration-100 rounded-e-full cursor-pointer`} onClick={() => setAnnouncementMinibar(true)}>
              <AddAnnouncementIcon className="text-2xl" />
              Add Announcements
            </div>
          </div>

          {!announcementMinibar ? (
            <Announcement role='admin' className='absolute top-[55%] left-[50%] translate-x-[-50%] translate-y-[-50%]' />
          ) : (
            <AnnouncementAdmin />
          )}
        </div>
      )}
      
      {showTeachers && (
        <div className={`${toggleSidebar && 'ml-[20rem]'} container mx-auto p-4`}>
          <div className="flex items-center justify-between rounded-full w-[40vw] whitespace-nowrap md:text-xs xl:text-xl border-2 border-black duration-300 absolute bottom-[10%] left-[50%] translate-x-[-50%] translate-y-[50%] font-semibold text-xl shadow-2xl">
            <div className={`flex items-center justify-center gap-4 w-[50%] h-full p-[1rem] ${!teacherMinibar && 'bg-[#332D2D] text-white'} hover:opacity-95 duration-100 rounded-s-full cursor-pointer`} onClick={() => setTeacherMinibar(false)}>
              <UserTable className="text-2xl" />
              Teachers' Table
            </div>
            <div className={`flex items-center justify-center gap-4 w-[50%] h-full p-[1rem] ${teacherMinibar && 'bg-[#332D2D] text-white'} hover:opacity-95 duration-100 rounded-e-full cursor-pointer`} onClick={() => setTeacherMinibar(true)}>
              <TeacherIcon className="text-2xl" />
              Add Teachers
            </div>
          </div>
          
          {!teacherMinibar ? (
              <TeachersTable teacherUsers={teacherUsers} />
          ) : (
              <TeachersForm handleAddUser={handleAddUser} firstName={firstName} setFirstName={setFirstName} userID={userID} setID={setID} middleName={middleName} setMiddleName={setMiddleName} password={password} setPassword={setPassword} lastName={lastName} setLastName={setLastName} error={error} />
          )}
        </div>
      )}

      {showStudents && (
        <div className={`${toggleSidebar && 'ml-[20rem]'} container mx-auto p-4`}>
          <div className="flex items-center justify-between rounded-full w-[65vw] whitespace-nowrap md:text-xs xl:text-xl border-2 border-black duration-300 absolute bottom-[10%] left-[50%] translate-x-[-50%] translate-y-[50%] font-semibold text-xl shadow-2xl">
            <div className={`flex items-center justify-center gap-4 w-[50%] h-full p-[1rem] ${studentMinibar === 'table' && 'bg-[#332D2D] text-white'} hover:opacity-95 duration-100 rounded-s-full cursor-pointer`} onClick={() => setStudentMinibar('table')}>
              <UserTable className="text-2xl" />
              Students' Table
            </div>
            <div className={`flex items-center justify-center gap-4 w-[50%] h-full p-[1rem] ${studentMinibar === 'student-form' && 'bg-[#332D2D] text-white'} hover:opacity-95 duration-100 cursor-pointer`} onClick={() => setStudentMinibar('student-form')}>
              <StudentIcon className="text-2xl" />
              Add Students
            </div>
            <div className={`flex items-center justify-center gap-4 w-[50%] h-full p-[1rem] ${studentMinibar === 'subject-form' && 'bg-[#332D2D] text-white'} hover:opacity-95 duration-100 rounded-e-full cursor-pointer`} onClick={() => setStudentMinibar('subject-form')}>
              <SubjectIcon className="text-2xl" />
              Add Subjects
            </div>
          </div>

          {studentMinibar === 'table' ? (
            <StudentsTable studentUsers={parentUsers} />
          ) : studentMinibar === 'student-form' ? (
            <StudentsForm handleAddUser={handleAddUser} firstName={firstName} setFirstName={setFirstName} userID={userID} setID={setID} middleName={middleName} setMiddleName={setMiddleName} password={password} setPassword={setPassword} lastName={lastName} setLastName={setLastName} gradeLevel={gradeLevel} setGradeLevel={setGradeLevel} error={error} />
          ) : (
            <SubjectForm addSubjectStudent={addSubjectStudent} setAddSubjectStudent={setAddSubjectStudent} subjectToAdd={subjectToAdd} setSubjectToAdd={setSubjectToAdd} handleAddSubject={handleAddSubject} />
          )}
        </div>
      )}

      {showParents && (
        <div className={`${toggleSidebar && 'ml-[20rem]'} container mx-auto p-4`}>
          <div className="flex items-center justify-between rounded-full w-[40vw] whitespace-nowrap md:text-xs xl:text-xl border-2 border-black duration-300 absolute bottom-[10%] left-[50%] translate-x-[-50%] translate-y-[50%] font-semibold text-xl shadow-2xl">
            <div className={`flex items-center justify-center gap-4 w-[50%] h-full p-[1rem] ${!parentMinibar && 'bg-[#332D2D] text-white'} hover:opacity-95 duration-100 rounded-s-full cursor-pointer`} onClick={() => setParentMinibar(false)}>
              <UserTable className="text-2xl" />
              Parents' Table
            </div>
            <div className={`flex items-center justify-center gap-4 w-[50%] h-full p-[1rem] ${parentMinibar && 'bg-[#332D2D] text-white'} hover:opacity-95 duration-100 rounded-e-full cursor-pointer`} onClick={() => setParentMinibar(true)}>
              <ParentIcon className="text-2xl" />
              Add Parents
            </div>
          </div>
          
          {!parentMinibar ? (
              <ParentsTable parentUsers={parentUsers} />
          ) : (
              <ParentsForm handleAddUser={handleAddUser} firstName={firstName} setFirstName={setFirstName} userID={userID} setID={setID} middleName={middleName} setMiddleName={setMiddleName} password={password} setPassword={setPassword} lastName={lastName} setLastName={setLastName} childID={childID} setChildID={setChildID} error={error} />
          )}
        </div>
      )}

      {showDeleteUser && (
        <div className={`${toggleSidebar && 'ml-[20rem]'} container mx-auto p-4`}>
          <AllUsersTable allUsers={allUsers} />
          <EditUserForm handleAddUser={handleAddUser} deleteUserID={deleteUserID} setDeleteUserID={setDeleteUserID} handleDeleteUser={handleDeleteUser} handleResetPassword={handleResetPassword} />
        </div>
      )}

      <button
        className="fixed bottom-4 right-4 border-none bg-red-500 rounded-md text-white uppercase font-semibold p-2 cursor-pointer bg-gradient-to-r from-[#EB3349] to-[#F45C43] px-6 py-2  shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-10px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] focus:shadow-[inset_-12px_-8px_40px_#46464620] transition-shadow"
        onClick={handleLogout}
      >
        Logout
      </button>
    </body>
  );
};
export default AdminPage;
