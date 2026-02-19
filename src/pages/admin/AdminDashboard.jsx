import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Users,
    Activity,
    Clock,
    CheckSquare,
    TrendingUp,
    BarChart2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
        </div>
        <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {subtext && <span className="text-sm text-gray-500 mb-1">{subtext}</span>}
        </div>
    </div>
);

const AdminDashboard = () => {
    const { currentUser, token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentUser) {
            fetchStats();
        }
    }, [currentUser]);

    const fetchStats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };

            
            
            
            

            
            
            if (currentUser) {
                const token = currentUser.token;
                config.headers.Authorization = `Bearer ${token}`;

                const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';
                const { data } = await axios.get(`${baseURL}/admin/stats`, config);
                setStats(data);
            } else {
                
                setLoading(false);
            }
        } catch (err) {
            setError(`Failed to load dashboard stats: ${err.message || err}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, {currentUser.firstName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    color="bg-blue-500"
                    subtext="Registered students"
                />
                <StatCard
                    title="Active Users (24h)"
                    value={stats?.activeUsers || 0}
                    icon={Activity}
                    color="bg-green-500"
                    subtext="Online recently"
                />
                <StatCard
                    title="Total Study Hours"
                    value={stats?.totalStudyHours || 0}
                    icon={Clock}
                    color="bg-purple-500"
                    subtext="Combined focus time"
                />
                <StatCard
                    title="Tasks Created"
                    value={stats?.totalTasks || 0}
                    icon={CheckSquare}
                    color="bg-orange-500"
                    subtext="Across all users"
                />
            </div>

            {/* Placeholder for charts or more detailed widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">System Health</h3>
                        <BarChart2 className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <span className="text-gray-400">Chart Placeholder</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {/* Fake activity feed for demo */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">New user registration</span>
                            <span className="text-gray-400">2 mins ago</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">System backup completed</span>
                            <span className="text-gray-400">1 hour ago</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">High traffic alert resolved</span>
                            <span className="text-gray-400">3 hours ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
