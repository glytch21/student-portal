"use client";

import React from 'react'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/config/client";

const page = () => {
  const [username, setusername] = useState<string>();
  const [password, setpassword] = useState<string>();
  const router = useRouter();

  const handleLogin = async (e:any) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'admin') {

      const { data, error } = await supabase
      .from("administrator_table")
      .upsert([{ student_id: username}])
      
      alert('nice')

    } else {
      alert('wrong username or password')
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