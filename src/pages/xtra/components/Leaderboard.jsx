import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import api from '../../../services/api';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.gamification.getLeaderboard()
            .then(data => setUsers(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Leaderboard...</div>;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Icon name="Trophy" className="text-yellow-500" />
                    Top Scholars
                </h3>
            </div>
            <div>
                {users.map((u, index) => (
                    <div key={u._id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${index !== users.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-200 text-gray-700' :
                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                    'text-gray-400'
                            }`}>
                            {index + 1}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                            {u.firstName?.[0] || 'U'}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{u.firstName} {u.lastName}</h4>
                            <p className="text-xs text-gray-500">{u.institution || 'Scholar'}</p>
                        </div>
                        <div className="font-bold text-indigo-600">
                            {u.points} pts
                        </div>
                    </div>
                ))}
                {users.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No active scholars yet. Be the first!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
