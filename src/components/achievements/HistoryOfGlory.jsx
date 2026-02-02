import React, { useState, useEffect } from 'react';
import { History, Trophy, Flame, Star, CheckCircle } from 'lucide-react';
import axios from 'axios';

const HistoryItem = ({ item, isLast }) => {
    const { type, title, description, timestamp } = item;

    // Icon Logic
    const getIcon = () => {
        switch (type) {
            case 'achievement': return <Trophy className="w-4 h-4 text-yellow-500" />;
            case 'streak': return <Flame className="w-4 h-4 text-orange-500" />;
            case 'level_up': return <Star className="w-4 h-4 text-purple-500" />;
            default: return <CheckCircle className="w-4 h-4 text-blue-500" />;
        }
    };

    const dateStr = new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const timeStr = new Date(timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center z-10">
                    {getIcon()}
                </div>
                {!isLast && <div className="w-0.5 flex-1 bg-gray-800 my-1"></div>}
            </div>
            <div className="pb-8 flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-200 text-sm">{title}</h4>
                    <span className="text-xs text-gray-500">{dateStr}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[90%]">{description}</p>
            </div>
        </div>
    );
};

const HistoryOfGlory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/api/history');
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
                // Mock data fallback if empty or error
                if (history.length === 0) {
                    setHistory([
                        { _id: 1, type: 'achievement', title: 'Unlocked: Marathoner', description: 'Studied for 4 hours in a single day.', timestamp: new Date() },
                        { _id: 2, type: 'streak', title: '7 Day Streak!', description: 'You are on fire! Keep it up.', timestamp: new Date(Date.now() - 86400000) },
                        { _id: 3, type: 'level_up', title: 'Reached Level 5', description: 'You are now a Scholar.', timestamp: new Date(Date.now() - 172800000) }
                    ]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 h-full min-h-[400px]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <History className="w-5 h-5 text-gray-400" />
                History of Glory
            </h3>

            <div className="space-y-1">
                {loading ? (
                    <p className="text-gray-500 text-center py-8">Loading history...</p>
                ) : history.length > 0 ? (
                    history.map((item, index) => (
                        <HistoryItem
                            key={item._id || index}
                            item={item}
                            isLast={index === history.length - 1}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-8">No glory yet. Start studying!</p>
                )}
            </div>
        </div>
    );
};

export default HistoryOfGlory;
