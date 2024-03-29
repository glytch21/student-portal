"use client";

import supabase from "@/config/client";
import bcrypt from 'bcryptjs';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const page = () => {
  const [id, setId] = useState<string>();
  const [password, setPassword] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const sessionCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('session='))
      ?.split('=')[1];

    if (sessionCookie) {
      const fetchUserData = async () => {
        try {
          const { data, error } = await supabase
            .from('user_table')
            .select('role')
            .eq('user_id', sessionCookie)
            .single();
          if (error) {
            throw error;
          }
          if (data) {
            // Redirect the user to the appropriate page based on their role
            if (data.role === 'student') {
              router.push('/studentportal');
            } else if (data.role === 'teacher') {
              router.push('/teachersportal');
            } else if (data.role === 'parent') {
              router.push('/parentsportal');
            } else if (data.role === 'admin') {
              router.push('/admin');
            } else {
              console.error('Unknown role:', data.role);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [router]);

  const handleTry = async (e: any) => {
    e.preventDefault();
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
    <div className='flex justify-center items-center h-screen' style={{ backgroundImage: "url('./img/schoolbg.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
  
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-opacity-75 bg-black">
        {/* Form */}
        <form onSubmit={handleLogin} className='bg-white rounded-lg shadow-md p-8 flex flex-col items-center' style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)' }}>
          <div className="mb-8">
            <img src="./img/school-logo.png" alt="school logo" className="w-40 h-50" />
          </div>
  
          <div className='mb-4'>
            <input
              type="text"
              placeholder="User ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className='w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500 bg-black bg-opacity-25 text-white'  
            />
          </div>
          <div className='mb-4 color-white'>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500 bg-black bg-opacity-25 text-white'
            />
          </div>
          <button type="submit" className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600'>Log In</button>
        </form>
      </div>
    </div>
  );
  
  
}

export default page