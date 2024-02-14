"use client";

import React from 'react'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/config/client";

const page = () => {
  const [username, setusername] = useState<string>();
  const [password, setpassword] = useState<string>();
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    // Fetch the data from supabase
    const { data, error } = await supabase
      .from('user_table')
      .select('user_name, user_password, role');
  
    // Check if there's any error fetching data
    if (error) {
      console.error('Error fetching data:', error.message);
      return;
    }
  
    // Check if the fetched data exists
    if (data && data.length > 0) {
      // Find the user with the entered username
      const user = data.find((user: any) => user.user_name === username);
  
      // If the user is found
      if (user) {
        // Check if the password matches
        if (user.user_password === password) {
          // Redirect based on user's role
          if (user.role === 'student') {
            router.push('/studentportal/');
          } else if (user.role === 'teacher') {
            router.push('/teachersportal/');
          } else if (user.role === 'admin') {
            router.push('/admin/');
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
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <button>Login</button>
      </form>
    </div >
  )
}

export default page