import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const UpcomingEvents = () => {
    const events = [
        { id: 1, title: 'Calculus Midterm', date: 'Tomorrow, 9:00 AM', type: 'exam', color: 'bg-destructive/10 text-destructive' },
        { id: 2, title: 'Physics Lab Report', date: 'In 2 days', type: 'assignment', color: 'bg-warning/10 text-warning' },
        { id: 3, title: 'Study Group', date: 'Fri, 2:00 PM', type: 'meeting', color: 'bg-secondary/10 text-secondary' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-6 shadow-sm"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Upcoming</h3>
                <button className="text-xs font-medium text-primary hover:underline">View Calendar</button>
            </div>

            <div className="space-y-4">
                {events.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${event.color}`}>
                            <Icon name={event.type === 'exam' ? 'AlertCircle' : event.type === 'assignment' ? 'FileText' : 'Users'} size={18} />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-sm">{event.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{event.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default UpcomingEvents;
