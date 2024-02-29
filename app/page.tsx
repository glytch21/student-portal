"use client";

import React from 'react'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/config/client";
import bcrypt from 'bcryptjs';

const page = () => {
  const [id, setid] = useState<string>();
  const [password, setpassword] = useState<string>();
  const router = useRouter();

  const handleTry = async (e: any) => {
    e.preventDefault();
    router.push('/example/')
  }

  const handleLogin = async (e: any) => {
    e.preventDefault();

    // Fetch the data from supabase
    const { data, error } = await supabase
      .from('user_table')
      .select('user_id, user_password, role');

    // Check if there's any error fetching data
    if (error) {
      console.error('Error fetching data:', error.message);
      return;
    }

    // Check if the fetched data exists
    if (data && data.length > 0) {
      // Find the user with the entered username
      const user = data.find((user: any) => user.user_id === id);


      // If the user is found
      if (user) {
        // Check if the password matches
        const passwordMatch = await bcrypt.compare(password!, user.user_password);
        if (passwordMatch) {
          document.cookie = `session=${user.user_id}; Path=/`;
          // Redirect based on user's role
          if (user.role === 'student') {
            router.push('/studentportal/');
          } else if (user.role === 'teacher') {
            router.push('/teachersportal/');
          } else if (user.role === 'admin') {
            router.push('/admin/');
          } else if (user.role === 'parent') {
            router.push('/parentsportal/');
          } else {
            // Handle other roles if necessary
            alert('Invalid role');
          }
        } else {
          // Alert if password is incorrect
          alert('Wrong password');
        }
      } else {
        // Alert if username is not found
        alert('User not found');
      }
    } else {
      // Alert if no data is fetched
      alert('No data found');
    }
  }


  return (
    <div className='flex justify-center items-center h-screen'>
      <form onSubmit={handleLogin} className='bg-white rounded-lg shadow-md p-8'>
        <h2 className='text-2xl font-semibold mb-4'>Login</h2>
        <div className='mb-4'>
          <input
            type="text"
            placeholder="Username"
            value={id}
            onChange={(e) => setid(e.target.value)}
            className='w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500'
          />
        </div>
        <div className='mb-4'>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            className='w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500'
          />
        </div>
        <button type="submit" className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600'>Login</button>
      </form>
    </div>
  );
}

export default page