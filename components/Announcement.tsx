'use client'
import { useState, useEffect } from "react"
import supabase from '@/config/client';

const Announcement = ({ role, className }:any) => {
    const [announcement, setAnnouncement] = useState<any>([])

    const capitalizeFirstLetter = (str:any) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const formatDateString = (timestamp:any) => {
        // Create a Date object from the timestamp string
        const dateObj = new Date(timestamp);
      
        // Options for formatting the date
        const options:any = { 
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
      
        // Format the date using Intl.DateTimeFormat
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);
        
        return formattedDate;
      }

    const updateAnnouncement = () => {
        fetchAnnouncementData()
    }

    const fetchAnnouncementData = async () => {
        if (role === 'admin') {
            const { data, error } = await supabase
                .from('announcements_table')
                .select('*')
    
                if (error) {
                    console.log('FetchError:', error)
                    return null
                }
    
                if (data) {
                    setAnnouncement(data)
                }
        } else {
            const { data, error } = await supabase
                .from('announcements_table')
                .select('*')
                .eq('receiver', role)
    
                if (error) {
                    console.log('FetchError:', error)
                    return null
                }
    
                if (data) {
                    setAnnouncement(data)
                }
        }
    }

    // const addRow = async () => {
    //     const { data, error } = await supabase
    //         .from('announcements_table')
    //         .insert([
    //             { headline: 'Valorant', content: 'Valorant VCT is upcoming', receiver: 'student' }
    //         ])
    //         .select()

    //         if (error) {
    //             console.log(error)
    //             return null
    //         }

    //         if (data) {
    //             setAnnouncement(data)
    //             console.log(data[0].headline)
    //         }
    // }

    const dummyData = [
        {
            headline: 'Valorant',
            content: 'VCT is upcoming. Stay tuned for more updates! Do not forget to like and subscribe to stay updated for our latest videoooooooooooooooooooooos! OOOOOOOOOOOOOOOOOOOOH (moredecai and rigby sounds)'
        }, 
        {
            headline: 'ValorantASDAS',
            content: 'VCT is upcoming. SDADAtay tuned for more updates! Do not forget to like and subscribe to stay updated for our latest videoooooooooooooooooooooos! OOOOOOOOOOOOOOOOOOOOH (moredecai and rigby sounds)'
        }, 
        {
            headline: 'ValorantHAHAHA',
            content: 'Lorem ipsum dolor'
        }, 
        {
            headline: 'ValorantEDIWOW',
            content: 'VCT is upcoming. Stay tuned for more updates! Do not forget to like and subscribe to stay updated for our latest videoooooooooooooooooooooos! OOOOOOOOOOOOOOOOOOOOH (moredecai and rigby sounds)'
        }, 
        {
            headline: 'Lorem Ipsum Dummy Data',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam nostrum facilis quae, dicta perferendis, tempora natus veritatis ducimus doloremque fuga maiores saepe veniam culpa dolores accusantium. Ipsa saepe accusamus suscipit.'
        }
    ]

    useEffect(() => {
        fetchAnnouncementData()
    }, [])
    
    return (
    <div className={`${className} flex flex-col p-16 overflow-auto w-[40%] h-[90vh] mx-auto`}>
    { announcement.length !== 0 ? (
        <>
            {role === 'admin' && (
            <div className="flex flex-col items-center justify-between top-[6rem] left-[6rem] text-4xl font-bold">
                <div className="text-base font-normal text-white p-4 bg-cyan-600 rounded-md cursor-pointer hover:bg-cyan-500" onClick={updateAnnouncement}>
                    Update Announcement
                </div>
            </div>
            )}
            { announcement.slice().reverse().map((data:any) => (
                <div className="flex flex-col gap-4 bg-white mt-10 p-10 shadow-lg border border-gray-200 rounded-lg">
                    <div className="font-semibold text-lg text-left">
                        <div className="flex items-center justify-between">
                            {data.headline}
                            {role === 'admin' && (
                            <div className="text-gray-500">
                                {capitalizeFirstLetter(data.receiver)}
                            </div>
                            )}
                            <div className="text-gray-400 text-sm font-normal">
                                {formatDateString(data.created_at)}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-300 h-[1px] w-[100%]">
                        {/* Horizontal Line */}
                    </div>
                    <div className="text-left">
                        {data.content}
                    </div>
                </div>
            ))}
        </>
    ) : (
        <div>
            No announcements!
        </div>
    )}
    </div>
  )
}

export default Announcement