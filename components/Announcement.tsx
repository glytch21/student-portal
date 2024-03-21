'use client'
import { useState, useEffect } from "react"
import supabase from '@/config/client';

const Announcement = () => {
    const [announcement, setAnnouncement] = useState<any>([{headline: 'VCT'}])

    const addRow = async () => {
        const { data, error } = await supabase
            .from('announcements_table')
            .insert([
                { headline: 'Valorant', content: 'Valorant VCT is upcoming', receiver: 'student' }
            ])
            .select()

            if (error) {
                console.log(error)
                return null
            }

            if (data) {
                setAnnouncement(data)
                console.log(data[0].headline)
            }
    }

    useEffect(() => {
        addRow()
    }, [])
    
    return (
    <div>
        <button onClick={addRow}>YEYE</button>
        {announcement.map((news:any, index:any) => (
            <div key={index}>
                {news.headline //only the object. 
                }
            </div>
        ))}
    </div>
  )
}

export default Announcement