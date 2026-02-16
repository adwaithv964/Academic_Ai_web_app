import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Info, CheckCircle, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogs = () => {
    const { currentUser } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [currentUser]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = currentUser.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

            const { data } = await axios.get(`${baseURL}/admin/logs?limit=50`, config);
            setLogs(data);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (level) => {
        switch (level) {
            case 'ERROR': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'WARNING': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Security & System Logs</h1>
                    <p className="text-gray-500">Monitor application activity and health</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Refresh Logs"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-700 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Recent Activity
                    </h3>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading logs...</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {logs.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No logs found.</div>
                        ) : (
                            logs.map((log) => (
                                <div key={log._id} className="p-4 flex items-start hover:bg-gray-50 transition-colors">
                                    <div className="mt-1 mr-4">
                                        {getIcon(log.level)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{log.message}</p>
                                        <span className="text-xs text-gray-500">{formatTime(log.timestamp)}</span>
                                        {log.ip && <span className="text-xs text-gray-400 ml-2">IP: {log.ip}</span>}
                                        {log.userId && (
                                            <span className="text-xs text-gray-400 ml-2">
                                                User: {log.userId.email || log.userId}
                                            </span>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full 
                                            ${log.level === 'ERROR' ? 'bg-red-100 text-red-700' :
                                                log.level === 'WARNING' ? 'bg-orange-100 text-orange-700' :
                                                    log.level === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                                                        'bg-blue-100 text-blue-700'}`}>
                                            {log.level}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLogs;
