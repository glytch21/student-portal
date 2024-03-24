"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/config/client";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import TeachersTable from "@/components/TeachersTable";
import StudentsTable from "@/components/StudentsTable";
import ParentsTable from "@/components/ParentsTable";
import Announcement from "@/components/Announcement";

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
  const [showTeachers, setShowTeachers] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showParents, setShowParents] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sessionCookie, setSessionCookie] = useState("");
  const [deleteUserID, setDeleteUserID] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [headline, setHeadline] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("Student");
  const [formError, setFormError] = useState<any>(null);

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!headline || !content || !receiver) {
      setFormError("Please fill in all the fields correctly.");
      return;
    }

    const { data, error } = await supabase
      .from("announcements_table")
      .insert({ headline: headline, content: content, receiver: receiver })
      .select();

    if (error) {
      console.log(error);
      return null;
    }

    if (data) {
      setFormError(null);
    }

    setHeadline("");
    setContent("");
    setReceiver("Student");
  };

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

  const handleTest = async (e: any) => {
    e.preventDefault();
    console.log("all", allUsers);
    console.log("parent", parentUsers);
    console.log("student", studentUsers);
  };

  const toggleTeachersTable = () => {
    setShowTeachers(!showTeachers);
    setShowStudents(false); // Close students table
    setShowParents(false); // Close parents table
  };

  const toggleStudentsTable = () => {
    setShowStudents(!showStudents);
    setShowTeachers(false); // Close teachers table
    setShowParents(false); // Close parents table
  };

  const toggleParentsTable = () => {
    setShowParents(!showParents);
    setShowTeachers(false); // Close teachers table
    setShowStudents(false); // Close students table
  };
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
    <body className="bg-zinc-100">
      <nav className="bg-cyan-600 px-4 py-3 flex justify-between items-center fixed top-0 w-full  ">
        <img src="school-logo.png" className="h-8 mr-2" />
        <div className="mx-auto p-6">
          {sessionCookie && userData ? (
            <div className="absolute top-5 right-5 mb-6 text-2xl font-semibold text-white">
              Admin {userData.first_name}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </nav>
      <div className="w-64 bg-cyan-600 fixed h-full px-4 py-2">
        <div className="my-2 mb-4 flex justify-center">
          <h1 className="text-2x text-white font-bold"> Admin Dashboard</h1>
        </div>
        <hr />
        <ul className="mt-3 text-white font-bold">
          <li className="w-full px-4 py-2 mb-4 mt-2  text-white rounded cursor-pointer flex items-center justify-center transition duration-300 ease-in-out hover:bg-cyan-700 focus:bg-cyan-700">
            <button onClick={toggleTeachersTable}>
              {showTeachers ? "Teachers" : "Teachers"}
            </button>
          </li>
          <li className="w-full px-4 py-2 mb-4 mt-2  text-white rounded cursor-pointer flex items-center justify-center transition duration-300 ease-in-out hover:bg-cyan-700 focus:bg-cyan-700">
            <button onClick={toggleStudentsTable}>
              {showStudents ? "Students" : "Students"}
            </button>
          </li>
          <li className="w-full px-4 py-2 mb-4 mt-2  text-white rounded cursor-pointer flex items-center justify-center transition duration-300 ease-in-out hover:bg-cyan-700 focus:bg-cyan-700">
            <button onClick={toggleParentsTable}>
              {showParents ? "Parents" : "Parents"}
            </button>
          </li>
        </ul>
      </div>
      <div className="flex justify-center mt-16">
        <div className="w-1/2 p-6 mt-16">
          {showTeachers && (
            <div className="border border-black border-collapse w-full">
              <TeachersTable teacherUsers={teacherUsers} />
            </div>
          )}
          {showTeachers && (
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
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-1/2 p-6 mt-16">
          {showStudents && (
            <div className="border border-black border-collapse w-full">
              <StudentsTable studentUsers={parentUsers} />
            </div>
          )}
          {showStudents && (
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
          )}
        </div>
        <div className="flex justify-center">
          <div className="w-3/4 p-6">
            {showParents && (
              <div className="border border-black border-collapse w-full">
                <ParentsTable parentUsers={parentUsers} />
              </div>
            )}
            {showParents && (
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
            )}
          </div>
        </div>
      </div>
      <button
        className="fixed bottom-4 right-4 border-none bg-red-500 rounded-md text-white uppercase font-semibold p-2 cursor-pointer bg-gradient-to-r from-[#EB3349] to-[#F45C43] px-6 py-2  shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-10px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] focus:shadow-[inset_-12px_-8px_40px_#46464620] transition-shadow"
        onClick={handleLogout}
      >
        Logout
      </button>
      <button onClick={handleTest}>test</button>

      <div>
        <div className="flex items-center justify-center mb-3 text-3xl font-semibold">
          Announcement
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-1/4vw lg:max-w-xl mx-auto p-4 border rounded-lg shadow-md bg-white"
        >
          <div className="mb-4">
            <label
              htmlFor="headline"
              className="block text-sm font-medium text-gray-700"
            >
              Headline:
            </label>
            <input
              type="text"
              id="headline"
              name="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Enter headline"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content:
            </label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content"
              rows={4}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="receiver"
              className="block text-sm font-medium text-gray-700"
            >
              Receiver:
            </label>
            <select
              id="receiver"
              name="receiver"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit
          </button>
        </form>
      </div>
    </body>
  );
};
export default AdminPage;
