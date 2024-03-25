import React from 'react'
import { useState } from 'react';
import supabase from '@/config/client';


const AnnouncementAdmin = () => {
    const [headline, setHeadline] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [receiver, setReceiver] = useState<string>("Student");
    const [formError, setFormError] = useState<any>(null);

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

  return (
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
  )
}

export default AnnouncementAdmin