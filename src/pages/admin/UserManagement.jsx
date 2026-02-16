import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Search,
    MoreVertical,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    User as UserIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pages, setPages] = useState(1);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            fetchUsers();
        }
    }, [pageNumber, keyword, currentUser]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';
            let token = '';
            if (currentUser) {
                token = currentUser.token;
            }
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const { data } = await axios.get(
                `${baseURL}/admin/users?pageNumber=${pageNumber}&keyword=${keyword}`,
                config
            );

            setUsers(data.users);
            setPages(data.pages);
            setPageNumber(data.page);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPageNumber(1);
        fetchUsers();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Manage and monitor students</p>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                    />
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                                <th className="p-4 font-medium">Student</th>
                                <th className="p-4 font-medium">Institution</th>
                                <th className="p-4 font-medium">Level</th>
                                <th className="p-4 font-medium">Points</th>
                                <th className="p-4 font-medium">Joined</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                {user.firstName ? user.firstName[0] : <UserIcon className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{user.institution || '-'}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-600">
                                            Lvl {user.level || 1}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm font-mono text-gray-600">{user.points || 0} XP</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => navigate(`/admin/users/${user._id}`)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                                                        const deleteUser = async () => {
                                                            try {
                                                                const token = currentUser.token;
                                                                const config = { headers: { Authorization: `Bearer ${token}` } };
                                                                const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';
                                                                await axios.delete(`${baseURL}/admin/users/${user._id}`, config);
                                                                setUsers(users.filter(u => u._id !== user._id));
                                                            } catch (error) {
                                                                console.error("Failed to delete user", error);
                                                                alert("Failed to delete user");
                                                            }
                                                        };
                                                        deleteUser();
                                                    }
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">
                        No users found.
                    </div>
                )}

                {/* Pagination */}
                {pages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                            disabled={pageNumber === 1}
                            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {pageNumber} of {pages}
                        </span>
                        <button
                            disabled={pageNumber === pages}
                            onClick={() => setPageNumber(prev => Math.min(pages, prev + 1))}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
