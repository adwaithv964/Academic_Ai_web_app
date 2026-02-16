import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Perform Firebase Login
            const userCredential = await login(email, password);
            const user = userCredential.user;

            // 2. Verified Role Check (Backend Fetch)
            const token = await user.getIdToken();
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

            const response = await fetch(`${baseURL}/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to verify admin privileges');
            }

            const dbUser = await response.json();

            if (dbUser.role !== 'admin') {
                await logout();
                setError('Access Denied: You do not have administrator privileges.');
            } else {
                navigate('/admin/dashboard');
            }

        } catch (err) {
            console.error("Admin Login Error:", err);
            setError('Invalid credentials or system error.');
            // Ensure we don't leave a session open if it failed logic
            await logout();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden relative z-10"
            >
                <div className="p-8">
                    <div className="flex justify-center mb-8">
                        <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                            <Shield className="w-8 h-8 text-indigo-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-white mb-2">Developer Console</h2>
                    <p className="text-center text-slate-400 mb-8 text-sm">Restricted Access. Authorized Personnel Only.</p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-start space-x-3"
                        >
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Access ID</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="admin@system.internal"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Security Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="••••••••••••"
                                    required
                                />
                                <Lock className="absolute right-3 top-3.5 w-5 h-5 text-slate-600" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Authenticate"
                            )}
                        </button>
                    </form>
                </div>
                <div className="bg-slate-900/50 px-8 py-4 border-t border-slate-700 text-center">
                    <p className="text-xs text-slate-500 font-mono">System v2.4.0 • Secure Connection</p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
