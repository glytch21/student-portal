"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/config/client";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import TeachersTable from "@/components/TeachersTable";
import StudentsTable from "@/components/StudentsTable";
import ParentsTable from "@/components/ParentsTable";
import Announcement from "@/components/Announcement";
import AnnouncementAdmin from "./component/AnnouncementAdmin";

import { PiStudentFill as StudentIcon } from "react-icons/pi"
import { FaChalkboardTeacher as TeacherIcon } from "react-icons/fa";
import { RiParentFill as ParentIcon } from "react-icons/ri";
import { MdAnnouncement as AnnouncementIcon } from "react-icons/md";
import SchoolLogo from '@/public/img/school-logo.png'

import { FaCircleArrowLeft as LeftArrow, FaCircleArrowRight as RightArrow } from "react-icons/fa6";

import Image from "next/image";

interface UserData {
  first_name: string;
}

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
  const [role, setRole] = useState("student");
  const [childID, setChildID] = useState("");
  const [error, setError] = useState("");

  const [showTeachers, setShowTeachers] = useState<boolean>(false);
  const [showStudents, setShowStudents] = useState<boolean>(false);
  const [showParents, setShowParents] = useState<boolean>(false);
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(true)

  const [userData, setUserData] = useState<UserData | null>(null);
  const [sessionCookie, setSessionCookie] = useState("");
  const [deleteUserID, setDeleteUserID] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [addSubjectStudent, setAddSubjectStudent] = useState('')
  const [subjectToAdd, setSubjectToAdd] = useState('')

  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false)




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
    setShowTeachers(true);
    setShowStudents(false); // Close students table
    setShowParents(false); // Close parents table
    setShowAnnouncement(false)
  };

  const toggleStudentsTable = () => {
    setShowStudents(true)
    setShowTeachers(false)
    setShowParents(false)
    setShowAnnouncement(false)
  };

  const toggleParentsTable = () => {
    setShowParents(true)
    setShowTeachers(false)
    setShowStudents(false)
    setShowAnnouncement(false)
  };

  const toggleAnnouncementPage = () => {
    setShowParents(false)
    setShowTeachers(false)
    setShowStudents(false)
    setShowAnnouncement(true)
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
      setRole("student");
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
        if (userToDelete.profile_image) {
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
        setShowDeleteModal(false);
        setDeleteUserID("");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <body className="bg-gray-100">
      <nav className="bg-cyan-600 p-6 flex items-center gap-1 relative top-0 w-full justify-end">
        <div className="text-2xl font-semibold text-white flex gap-4 items-center drop-shadow-lg">
            Admin {sessionCookie && userData ? userData.first_name : '...'}
            {/* Admin Photo Here */}
        </div>
        <div className="bg-cyan-600 fixed inset-y-0 left-0">
          <div className="w-8 last:h-8 rounded-full bg-white absolute top-[50%] right-[-1.5vmin] cursor-pointer" onClick={() => setToggleSidebar(!toggleSidebar)}>
              {toggleSidebar ? ( <LeftArrow className="w-full h-full text-cyan-700 hover:text-cyan-500" /> ) : ( <RightArrow className="w-full h-full text-cyan-700 hover:text-cyan-500 transition-colors"/> ) }
          </div>
          <div className="p-4 flex justify-center items-center gap-4">
            <Image
              src={SchoolLogo}
              alt="School Logo"
              className="h-[3rem] w-[3rem] drop-shadow-md"
            />
            {toggleSidebar && (
              <h1 className="text-xl text-white font-bold drop-shadow-lg">Admin Dashboard</h1>
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
          </div>
        </div>
      </nav>
      {showTeachers && (
        <div className={`${toggleSidebar && 'ml-[20rem]'} container mx-auto p-4`}>
          <TeachersTable teacherUsers={teacherUsers} />
          <form onSubmit={handleAddUser} className="mb-8 mt-4 ml-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="userID" className="block mb-1">
                  User ID:
                </label>
                <input
                  type="text"
                  id="userID"
                  value={userID}
                  onChange={(e) => setID(e.target.value)}
                  className="bg-zinc-200 text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
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
                  className="bg-zinc-200 text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-1">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-zinc-200 text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
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
                  className="bg-zinc-200 text-zinc-600   ring-1  ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400 mr-2"
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
                  className="bg-zinc-200 text-zinc-600   ring-1  ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400 mr-2"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mb-8">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
              >
                Add User
              </button>
              {error && <p className="text-red-600 mt-2">{error}</p>}
              <div className="">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
                >
                  Delete User
                </button>
              </div>

              {showDeleteModal && (
                <div className="">
                  <input
                    type="text"
                    placeholder="Enter User ID"
                    value={deleteUserID}
                    onChange={(e) => setDeleteUserID(e.target.value)}
                    className="bg-zinc-200 text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-rose-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-rose-400 mr-2"
                  />
                  <button
                    onClick={handleDeleteUser}
                    className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer mt-2"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
      {showStudents && (
        <div className={`${toggleSidebar && 'ml-[20rem]'} container mx-auto p-4`}>
          <StudentsTable studentUsers={parentUsers} />
          <form onSubmit={handleAddUser} className="mb-8 mt-4 ml-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="userID" className="block mb-1">
                  User ID:
                </label>
                <input
                  type="text"
                  id="userID"
                  value={userID}
                  onChange={(e) => setID(e.target.value)}
                  className="bg-zinc-200 text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
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
                  className="bg-zinc-200 text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-1">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-zinc-200 text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
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
            </div>
            <div className="flex justify-between items-center mb-8">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
              >
                Add User
              </button>
              {error && <p className="text-red-600 mt-2">{error}</p>}
              <div className="">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
                >
                  Delete User
                </button>
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
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button className="border-none bg-red-500 rounded-md text-white uppercase font-semibold p-2" onClick={handleAddSubject}>Add Subject</button>
              </div>
              {showDeleteModal && (
                <div className="">
                  <input
                    type="text"
                    placeholder="Enter User ID"
                    value={deleteUserID}
                    onChange={(e) => setDeleteUserID(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleDeleteUser}
                    className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer mt-2"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
      {showParents && (
        <div className={`${toggleSidebar && 'ml-[20rem]'} container mx-auto p-4`}>
          <ParentsTable parentUsers={parentUsers} />
          <form onSubmit={handleAddUser} className="mb-8 mt-4 ml-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="userID" className="block mb-1">
                  User ID:
                </label>
                <input
                  type="text"
                  id="userID"
                  value={userID}
                  onChange={(e) => setID(e.target.value)}
                  className="bg-zinc-200 text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
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
                  className="bg-zinc-200 text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-1">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-zinc-200 text-zinc-600   ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                />
              </div>
              <div>
                <label htmlFor="middleName" className="block mb-1 ml-5">
                  Middle Name:
                </label>
                <input
                  type="text"
                  id="middleName"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="bg-zinc-200 text-zinc-600 ml-5 ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1 ml-9">
                  Last Name:
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-zinc-200 text-zinc-600 ml-9 ring-1 ring-zinc-400 focus:ring-2 focus:ring-cyan-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-cyan-400"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mb-8">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
              >
                Add User
              </button>
              {error && <p className="text-red-600 mt-2">{error}</p>}
              <div className="">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
                >
                  Delete User
                </button>
              </div>
              {showDeleteModal && (
                <div className="">
                  <input
                    type="text"
                    placeholder="Enter User ID"
                    value={deleteUserID}
                    onChange={(e) => setDeleteUserID(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleDeleteUser}
                    className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer mt-2"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
      {showAnnouncement && (
        <div className={`${toggleSidebar && 'ml-[20rem]'} flex items-center justify-center gap-4`}>
          <AnnouncementAdmin />
          <Announcement role={'admin'} className={'absolute right-[10rem] bottom-0'} />
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
