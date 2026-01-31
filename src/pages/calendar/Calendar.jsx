import React, { useState, useEffect } from 'react';
import {
    format,
    addMonths,
    subMonths,
    addYears,
    subYears,
    addWeeks,
    subWeeks,
    addDays,
    subDays
} from 'date-fns';
import Button from '../../components/ui/Button';
import FloatingNav from './components/FloatingNav';
import YearView from './views/YearView';
import MonthView from './views/MonthView';
import WeekView from './views/WeekView';
import DayView from './views/DayView';
import AgendaView from './views/AgendaView';
import MultiWeekView from './views/MultiWeekView';
import MultiDayView from './views/MultiDayView';
import AddEventModal from './components/AddEventModal';
import axios from 'axios';

const Calendar = () => {
    const [view, setView] = useState('month'); // year, month, multi-week, week, multi-day, day, agenda
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Navigation Logic
    const next = () => {
        if (view === 'year') setCurrentDate(addYears(currentDate, 1));
        if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
        if (view === 'multi-week') setCurrentDate(addWeeks(currentDate, 2));
        if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
        if (view === 'multi-day') setCurrentDate(addDays(currentDate, 3));
        if (view === 'day') setCurrentDate(addDays(currentDate, 1));
        if (view === 'agenda') setCurrentDate(addMonths(currentDate, 1));
    };

    const prev = () => {
        if (view === 'year') setCurrentDate(subYears(currentDate, 1));
        if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
        if (view === 'multi-week') setCurrentDate(subWeeks(currentDate, 2));
        if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
        if (view === 'multi-day') setCurrentDate(subDays(currentDate, 3));
        if (view === 'day') setCurrentDate(subDays(currentDate, 1));
        if (view === 'agenda') setCurrentDate(subMonths(currentDate, 1));
    };

    const jumpToToday = () => setCurrentDate(new Date());

    const fetchEvents = async () => {
        setLoading(true);
        try {
            // Fetch from our APIs
            const [examsRes, vacationsRes, eventsRes] = await Promise.all([
                fetch('http://localhost:5002/api/exams').then(r => r.json()).catch(() => []),
                fetch('http://localhost:5002/api/vacations').then(r => r.json()).catch(() => []),
                fetch('http://localhost:5002/api/events').then(r => r.json()).catch(() => []),
            ]);

            // Normalize events with pastel colors for "Kanban" look
            const normalizedEvents = [
                ...examsRes.map(e => ({
                    ...e,
                    type: 'exam',
                    date: new Date(e.date),
                    title: e.subject,
                    // Pastel Red/Pink
                    color: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200'
                })),
                ...vacationsRes.map(v => ({
                    ...v,
                    type: 'vacation',
                    date: new Date(v.startDate),
                    title: v.name,
                    // Pastel Cyan/Blue
                    color: 'bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200'
                })),
                ...eventsRes.map(e => ({
                    ...e,
                    type: 'generic',
                    date: new Date(e.date),
                    // Use saved color or default
                    color: e.color || 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
                })),
                // MOCK EVENTS FOR DEMO
                { _id: 'm1', title: 'Jogging', time: '07:00 AM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 2), color: '#FFB7B2', type: 'generic' },
                { _id: 'm2', title: 'Marketing Strategy', time: '09:00 AM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 2), color: '#AEC6CF', type: 'generic' },
                { _id: 'm3', title: 'Product Review', time: '01:00 PM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 2), color: '#B9E4C9', type: 'generic' },
                { _id: 'm4', title: 'Coffee Break', time: '10:30 AM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 5), color: '#FDFD96', type: 'generic' },
                { _id: 'm5', title: 'Team Meeting', time: '02:00 PM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 5), color: '#C3B1E1', type: 'generic' },
                { _id: 'm6', title: 'Client Call', time: '11:00 AM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 8), color: '#E6E6FA', type: 'generic' },
                { _id: 'm7', title: 'Project Planning', time: '09:00 AM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 12), color: '#FFDAC1', type: 'generic' },
                { _id: 'm8', title: 'Design Review', time: '01:00 PM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 12), color: '#FFD1DC', type: 'generic' },
                { _id: 'm9', title: 'Workshop', time: '10:00 AM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 15), color: '#B9E4C9', type: 'generic' },
                { _id: 'm10', title: 'Lunch with Sarah', time: '12:30 PM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 18), color: '#AEC6CF', type: 'generic' },
                { _id: 'm11', title: 'Gym Session', time: '06:00 PM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 20), color: '#FFB7B2', type: 'generic' },
                { _id: 'm12', title: 'Reading Club', time: '08:00 PM', date: new Date(new Date().getFullYear(), new Date().getMonth(), 25), color: '#C3B1E1', type: 'generic' }
            ];

            setEvents(normalizedEvents);
        } catch (error) {
            console.error("Failed to fetch calendar events", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    const handleDateClick = (date) => {
        setCurrentDate(date);
        if (view === 'year') setView('month');
        else if (view === 'month') {
            // Optional: clicking a day could open modal to add event?
            // For now just drills down
            setView('day');
        }
    };

    const handleEventClick = (event) => {
        if (event.type === 'generic') {
            setSelectedEvent(event);
            setIsModalOpen(true);
        }
    };

    const handleSaveEvent = async (eventData) => {
        try {
            if (eventData._id) {
                await axios.put(`http://localhost:5002/api/events/${eventData._id}`, eventData);
            } else {
                await axios.post('http://localhost:5002/api/events', eventData);
            }
            fetchEvents();
            setIsModalOpen(false);
            setSelectedEvent(null);
        } catch (error) {
            console.error("Failed to save event", error);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (confirm("Are you sure you want to delete this event?")) {
            try {
                await axios.delete(`http://localhost:5002/api/events/${id}`);
                fetchEvents();
                setIsModalOpen(false);
                setSelectedEvent(null);
            } catch (error) {
                console.error("Failed to delete event", error);
            }
        }
    };

    const openAddModal = () => {
        setSelectedEvent(null);
        setIsModalOpen(true);
    };

    const getHeaderLabel = () => {
        if (view === 'year') return format(currentDate, 'yyyy');
        if (view === 'day') return format(currentDate, 'MMMM d, yyyy');
        return format(currentDate, 'MMMM yyyy');
    };

    return (
        <div className="h-full flex flex-col relative bg-gray-50/50">
            {/* Top Header */}
            <div className="flex items-center justify-between p-6 pb-2">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">{getHeaderLabel()}</h1>
                    <div className="flex gap-1 ml-4 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                        <button onClick={prev} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button onClick={jumpToToday} className="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded text-gray-700">
                            Today
                        </button>
                        <button onClick={next} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>
                <Button iconName="Plus" onClick={openAddModal}>Add Event</Button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden p-6 pt-4 pb-20">
                {view === 'year' && <YearView currentDate={currentDate} events={events} onMonthClick={(d) => { setCurrentDate(d); setView('month'); }} />}
                {view === 'month' && <MonthView currentDate={currentDate} events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />}
                {view === 'multi-week' && <MultiWeekView currentDate={currentDate} events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />}
                {view === 'week' && <WeekView currentDate={currentDate} events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />}
                {view === 'multi-day' && <MultiDayView currentDate={currentDate} events={events} onEventClick={handleEventClick} />}
                {view === 'day' && <DayView currentDate={currentDate} events={events} onEventClick={handleEventClick} />}
                {view === 'agenda' && <AgendaView events={events} onEventClick={handleEventClick} />}
            </div>

            {/* Floating Navigation */}
            <FloatingNav currentView={view} onViewChange={setView} />

            {/* Add/Edit Event Modal */}
            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                eventToEdit={selectedEvent}
            />
        </div>
    );
};

export default Calendar;
