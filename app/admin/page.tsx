'use client';
import React from 'react'
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const handleButton = async (e:any) => {
    router.push('/admin/students/')
  }
  return (
    <div>admin
      <button onClick={handleButton}>click </button>
    </div>
    
  )
}

export default page