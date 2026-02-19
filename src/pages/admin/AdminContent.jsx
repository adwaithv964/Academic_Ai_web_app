import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash, Search, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const AdminContent = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        credits: 3,
        description: '',
        department: 'General'
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCourses();
    }, [currentUser]);

    const fetchCourses = async () => {
        try {
            const token = currentUser.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

            const url = searchTerm
                ? `${baseURL}/admin/content/courses?keyword=${searchTerm}`
                : `${baseURL}/admin/content/courses`;

            const { data } = await axios.get(url, config);
            setCourses(data);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentUser) fetchCourses();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, currentUser]);

    const handleOpenModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
            setFormData({
                code: course.code,
                name: course.name,
                credits: course.credits,
                description: course.description || '',
                department: course.department || 'General'
            });
        } else {
            setEditingCourse(null);
            setFormData({
                code: '',
                name: '',
                credits: 3,
                description: '',
                department: 'General'
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            const token = currentUser.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

            await axios.delete(`${baseURL}/admin/content/courses/${id}`, config);
            setMessage({ type: 'success', text: 'Course deleted successfully' });
            fetchCourses();
        } catch (error) {
            console.error("Failed to delete course:", error);
            setMessage({ type: 'error', text: 'Failed to delete course' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = currentUser.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

            if (editingCourse) {
                await axios.put(`${baseURL}/admin/content/courses/${editingCourse._id}`, formData, config);
                setMessage({ type: 'success', text: 'Course updated successfully' });
            } else {
                await axios.post(`${baseURL}/admin/content/courses`, formData, config);
                setMessage({ type: 'success', text: 'Course added successfully' });
            }

            setIsModalOpen(false);
            fetchCourses();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Failed to save course:", error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save course' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
                    <p className="text-gray-500">Manage global course catalog</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course
                </button>
            </div>

            {message && (
                <div className={`px-4 py-2 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">All Courses</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading courses...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="text-xs text-gray-500 bg-gray-50 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Course Code</th>
                                <th className="px-6 py-3">Course Name</th>
                                <th className="px-6 py-3">Credits</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No courses found. Add some to get started!
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{course.code}</td>
                                        <td className="px-6 py-4 text-gray-600">{course.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{course.credits}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                                                {course.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(course)}
                                                className="text-blue-500 hover:text-blue-700 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course._id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingCourse ? 'Edit Course' : 'Add New Course'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 uppercase placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="CS101"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="20"
                                        value={formData.credits}
                                        onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Introduction to Programming"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="General">General</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Arts">Apps</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Brief course overview..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    {editingCourse ? 'Update Course' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContent;
