import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import { sessions as sessionsApi } from '../../../services/api';

import { useAuth } from '../../../contexts/AuthContext';

const WeeklyStudyFlowWidget = () => {
    const { currentUser } = useAuth();
    const [data, setData] = useState([
        { name: 'Mon', hours: 0 },
        { name: 'Tue', hours: 0 },
        { name: 'Wed', hours: 0 },
        { name: 'Thu', hours: 0 },
        { name: 'Fri', hours: 0 },
        { name: 'Sat', hours: 0 },
        { name: 'Sun', hours: 0 },
    ]);
    const [totalHours, setTotalHours] = useState("0h 0m");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            try {
                const allSessions = await sessionsApi.list() || [];

                // Get current week's start (Monday) and end (Sunday)
                const now = new Date();
                const dayOfWeek = now.getDay(); // 0 is Sunday
                const diffToMon = (dayOfWeek + 6) % 7; // Days to subtract to get Monday
                const monday = new Date(now);
                monday.setDate(now.getDate() - diffToMon);
                monday.setHours(0, 0, 0, 0);

                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                sunday.setHours(23, 59, 59, 999);

                // Initialize days
                const daysMap = {
                    'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
                };
                const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                let totalMinutes = 0;

                allSessions.forEach(session => {
                    const sessionDate = new Date(session.date || session.createdAt);
                    if (sessionDate >= monday && sessionDate <= sunday) {
                        const dayName = dayKeys[sessionDate.getDay()];
                        let hours = 0;
                        if (typeof session.duration === 'number') {
                            hours = session.duration;
                        } else if (typeof session.duration === 'string') {
                            // Attempt to parse string durations if they exist (e.g. "2h" or "120")
                            // Assuming simple number in string for now as per likely API usage or fallback to 0
                            hours = parseFloat(session.duration) || 0;
                        }

                        daysMap[dayName] += hours;
                        totalMinutes += hours * 60;
                    }
                });

                // Format data for Recharts
                const formattedData = [
                    { name: 'Mon', hours: daysMap['Mon'] },
                    { name: 'Tue', hours: daysMap['Tue'] },
                    { name: 'Wed', hours: daysMap['Wed'] },
                    { name: 'Thu', hours: daysMap['Thu'] },
                    { name: 'Fri', hours: daysMap['Fri'] },
                    { name: 'Sat', hours: daysMap['Sat'] },
                    { name: 'Sun', hours: daysMap['Sun'] },
                ];

                setData(formattedData);

                // Format total string
                const h = Math.floor(totalMinutes / 60);
                const m = Math.round(totalMinutes % 60);
                setTotalHours(`${h}h ${m}m`);

            } catch (error) {
                console.error("Failed to load study sessions", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        window.addEventListener('session-created', fetchData);
        return () => window.removeEventListener('session-created', fetchData);
    }, [currentUser]);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <Icon name="Activity" size={14} className="text-blue-500" />
                        Weekly Study Flow
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalHours}</p>
                    <p className="text-xs text-gray-400">Total Focus Time</p>
                </div>
            </div>

            <div className="flex-1 min-h-[100px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 0,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}
                            labelStyle={{ fontSize: '10px', color: '#6b7280' }}
                            formatter={(value) => [`${value.toFixed(1)}h`, 'Focus']}
                        />
                        <Area
                            type="monotone"
                            dataKey="hours"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorHours)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WeeklyStudyFlowWidget;
