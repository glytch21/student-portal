'use client'
import { useState, useEffect } from "react"
import supabase from '@/config/client';

const Announcement = () => {
    const [announcement, setAnnouncement] = useState<any>([])

    const fetchAnnouncementData = async () => {
        const { data, error } = await supabase
            .from('announcements_table')
            .select('*')

            if (error) {
                console.log('FetchError:', error)
                return null
            }

            if (data) {
                setAnnouncement(data)
                console.log('data is', data)
                console.log('announcement is', announcement)
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
    <div className="flex flex-col p-16 overflow-auto w-[40%] h-[93vh] mx-auto">
    { announcement.length !== 0 ? (
        <>
            <div className="absolute top-[6rem] left-10 text-4xl font-bold">
                Announcement
            </div>
            { announcement.slice().reverse().map((data:any) => (
                <div className="flex flex-col gap-4 bg-white mt-10 p-10 shadow-lg border border-gray-200 rounded-lg">
                    <div className="font-semibold text-lg text-left">
                        {data.headline}
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