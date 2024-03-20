'use client'
import { useState } from 'react'

import { Calendar, dateFnsLocalizer } from "react-big-calendar"

import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'

import 'react-big-calendar/lib/css/react-big-calendar.css'

import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"


const locales = {
  "en-US": enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

const events = [
  {
    title: "Big Meeting",
    start: new Date(2024, 2, 17, 4, 0),
    end: new Date(2024, 2, 17, 6, 0)
  },
  {
    title: "Vacation",
    start: new Date(2024, 2, 17, 10, 0),
    end: new Date(2024, 2, 17, 12, 0)
  },
  {
    title: "Conference",
    start: new Date(2024, 2, 17, 13, 0),
    end: new Date(2024, 2, 17, 15, 0)
  }
]

type View = "week" | "day" | "agenda" // Custom type for views

const CalendarPage = () => {
  const [newEvent, setNewEvent] = useState<View>("week")
  const [allEvents, setAllEvents] = useState<any>(events)

  const handleAddEvent = () => {
    setAllEvents([...allEvents, newEvent])
  }

  const [view, setView] = useState<any>("week")
  const [date, setDate] = useState(new Date())

  return (
    <div>
      <h1>Calendar</h1>
      <h2>Add New Event</h2>
      {/* <div>
        <input type="text" placeholder="Add Title" className="w-[20%] mr-[10px]" 
          value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <DatePicker placeholderText="Start Date" className="mr-[10px]"
        selected={newEvent.start} onChange={(start) => setNewEvent({...newEvent, start })} />
        <DatePicker placeholderText="End Date"
        selected={newEvent.end} onChange={(end) => setNewEvent({...newEvent, end })} />
        <button className="mt-[10px]" onClick={handleAddEvent}>
          Add Event
        </button>
      </div> */}
      <Calendar 
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800, margin: "100px" }}
        views={["week", "day", "agenda"]} // Use string literals directly
        defaultView={view}
        view={view} // Include the view prop
        date={date} // Include the date prop
        onView={(view) => setView(view as View)}
        onNavigate={(date) => {
          setDate(new Date(date))
        }}
        formats={{
          dayFormat: 'eee', // Display abbreviated day names (Sun, Mon, Tue, etc.)
        }}
      />
    </div>
  )
}

export default CalendarPage