import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    User,
    BookOpen,
    CheckSquare,
    Clock,
    Award,
    ArrowLeft,
    Calendar,
    Briefcase,
    Zap,
    Database,
    FileText,
    Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (currentUser) {
            fetchUserDetails();
        }
    }, [id, currentUser]);

    const fetchUserDetails = async () => {
        try {
            let token = '';
            if (currentUser) {
                token = currentUser.token;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';
            const { data } = await axios.get(`${baseURL}/admin/users/${id}`, config);
            setUserData(data);
        } catch (error) {
            console.error("Failed to load user details", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading user details...</div>;
    if (!userData) return <div className="p-8 text-center text-red-500">User not found</div>;

    const { user, stats, recentData } = userData;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'academic', label: 'Academic', icon: BookOpen },
        { id: 'productivity', label: 'Productivity', icon: CheckSquare },
        { id: 'dataroom', label: 'Data Room', icon: Database },
        { id: 'gamification', label: 'Gamification', icon: Award },
    ];

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
            </button>

            {/* Header Profile */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold">
                    {user.firstName?.[0]}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                    <p className="text-gray-500">{user.email}</p>
                    <div className="flex items-center justify-center md:justify-start space-x-4 mt-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                            {user.institution || 'No Institution'}
                        </span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                            Level {user.level}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">{stats.tasksCount}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Tasks</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">{stats.sessionsCount}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Sessions</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-gray-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center px-4 py-3 font-medium text-sm border-b-2 transition-colors
                            ${activeTab === tab.id
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                        `}
                    >
                        <tab.icon className="w-4 h-4 mr-2" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Personal Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Major</span>
                                    <span className="font-medium">{user.major || '-'}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Graduation Year</span>
                                    <span className="font-medium">{user.graduationYear || '-'}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Phone</span>
                                    <span className="font-medium">{user.phone || '-'}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Address</span>
                                    <span className="font-medium">{user.address || '-'}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Account Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Last Active</span>
                                    <span className="font-medium">
                                        {user.lastActiveDate ? new Date(user.lastActiveDate).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Role</span>
                                    <span className="font-medium capitalize">{user.role}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'academic' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Enrolled Courses</h3>
                            {recentData.courses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {recentData.courses.map(course => (
                                        <div key={course._id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                                            <span className="font-medium text-gray-900">{course.name}</span>
                                            <span className="text-sm text-gray-500">{course.code}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500">No courses found.</p>}
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-4">Upcoming Exams</h3>
                            {recentData.exams.length > 0 ? (
                                <div className="space-y-2">
                                    {recentData.exams.map(exam => (
                                        <div key={exam._id} className="p-3 border border-gray-100 rounded-lg flex justify-between">
                                            <span>{exam.courseName} - {exam.name}</span>
                                            <span className="text-gray-500 text-sm">{new Date(exam.date).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500">No exams found.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'productivity' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                                Recent Study Sessions
                            </h3>
                            {recentData.sessions.length > 0 ? (
                                <div className="space-y-3">
                                    {recentData.sessions.map((session, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{session.subject}</span>
                                                <span className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</span>
                                            </div>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded font-medium">
                                                {session.duration} hrs
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500">No sessions recorded.</p>}
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <CheckSquare className="w-5 h-5 mr-2 text-indigo-500" />
                                Recent Tasks
                            </h3>
                            {recentData.tasks.length > 0 ? (
                                <div className="space-y-2">
                                    {recentData.tasks.map(task => (
                                        <div key={task._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                                            <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            <span className={`flex-1 ${task.completed ? 'opacity-50 line-through' : ''}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500">No tasks found.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'dataroom' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                                Documents ({stats.documentsCount})
                            </h3>
                            {recentData.documents && recentData.documents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recentData.documents.map(doc => (
                                        <div key={doc._id} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <FileText className="w-5 h-5 text-indigo-500" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h4 className="font-medium text-gray-900 truncate" title={doc.name}>{doc.name}</h4>
                                                    <p className="text-xs text-gray-500">{doc.subject}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                                                <span className="bg-gray-200 px-2 py-1 rounded text-gray-600">{doc.type}</span>
                                                <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500">No documents uploaded.</p>}
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <LinkIcon className="w-5 h-5 mr-2 text-indigo-500" />
                                Web References ({stats.webRefsCount})
                            </h3>
                            {recentData.webRefs && recentData.webRefs.length > 0 ? (
                                <div className="space-y-2">
                                    {recentData.webRefs.map(ref => (
                                        <div key={ref._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center space-x-3 overflow-hidden">
                                                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                                    <LinkIcon className="w-4 h-4" />
                                                </div>
                                                <div className="truncate">
                                                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 hover:text-indigo-600 block truncate">
                                                        {ref.title || ref.url}
                                                    </a>
                                                    <p className="text-xs text-gray-500 capitalize">{ref.type} • {ref.subject}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                                {new Date(ref.dateAdded).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500">No web references saved.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'gamification' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Progression</h3>
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-bold text-2xl">Lvl {user.level}</span>
                                    <span>{user.xp} XP</span>
                                </div>
                                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-white" style={{ width: `${(user.xp % 100)}%` }} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-4">Garden Status</h3>
                            {user.garden && user.garden.plants.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {user.garden.plants.map((plant, idx) => (
                                        <div key={idx} className="bg-green-50 p-2 rounded text-center">
                                            <div className="text-2xl">🌱</div>
                                            <div className="text-xs text-green-800 mt-1 capitalize">{plant.type || 'Plant'}</div>
                                            <div className="text-[10px] text-gray-500">Stage {plant.stage}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500">No plants in garden.</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetail;
