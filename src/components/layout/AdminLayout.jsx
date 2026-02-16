import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu as MenuIcon,
    X,
    Shield,
    BookOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'User Management' },
        { path: '/admin/content', icon: BookOpen, label: 'Content Management' },
        { path: '/admin/settings', icon: Settings, label: 'System Settings' },
        { path: '/admin/logs', icon: Shield, label: 'Security Logs' },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:relative md:translate-x-0
                `}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center space-x-2">
                        <Shield className="w-8 h-8 text-indigo-400" />
                        <span className="text-xl font-bold tracking-tight">Admin<span className="text-indigo-400">Panel</span></span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                                ${location.pathname === item.path
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                            `}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header for Mobile */}
                <header className="bg-white shadow-sm p-4 flex items-center justify-between md:hidden z-10">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-indigo-600">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-gray-800">Admin Panel</span>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
