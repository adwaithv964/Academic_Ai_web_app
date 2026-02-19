import React from 'react';
import { format, isSameDay } from 'date-fns';
import Icon from '../../../components/AppIcon';

const AgendaView = ({ events, onEventClick }) => {
    
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

    
    const grouped = sortedEvents.reduce((acc, event) => {
        const monthKey = format(new Date(event.date), 'MMMM yyyy');
        if (!acc[monthKey]) acc[monthKey] = [];
        acc[monthKey].push(event);
        return acc;
    }, {});

    return (
        <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Agenda</h2>

            {Object.keys(grouped).length === 0 && (
                <div className="text-center text-gray-400 py-12">No upcoming events found.</div>
            )}

            {Object.entries(grouped).map(([month, monthEvents]) => (
                <div key={month} className="mb-8">
                    <div className="sticky top-0 bg-white/95 backdrop-blur py-2 z-10 border-b border-gray-100 mb-4">
                        <h3 className="text-lg font-bold text-gray-800">{month}</h3>
                    </div>

                    <div className="space-y-3">
                        {monthEvents.map((evt, idx) => (
                            <div key={idx} className="flex gap-4 group">
                                <div className="w-16 text-center pt-1">
                                    <div className="text-xs font-bold text-gray-400 uppercase">{format(new Date(evt.date), 'EEE')}</div>
                                    <div className="text-xl font-bold text-gray-900">{format(new Date(evt.date), 'd')}</div>
                                </div>
                                <div
                                    onClick={() => onEventClick && onEventClick(evt)}
                                    className={`flex-1 p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md cursor-pointer ${evt.color.replace('text-', 'bg-').replace('100', '50/50')}`}
                                >
                                    <h4 className="font-bold text-gray-900">{evt.title}</h4>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                        {evt.time && (
                                            <span className="flex items-center gap-1">
                                                <Icon name="Clock" size={14} /> {evt.time}
                                            </span>
                                        )}
                                        {evt.location && (
                                            <span className="flex items-center gap-1">
                                                <Icon name="MapPin" size={14} /> {evt.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AgendaView;
