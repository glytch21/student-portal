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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <input
          type="text"
          placeholder="Username"
          value={id}
          onChange={(e) => setid(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Login</button>
      </form>
      <button onClick={handleTry}> test</button>
    </div>
  )
}

export default page