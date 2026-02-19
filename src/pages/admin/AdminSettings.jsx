import React, { useState, useEffect } from 'react';
import { Save, Bell, Shield, Power } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const AdminSettings = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [allowRegistration, setAllowRegistration] = useState(true);
    const [systemEmail, setSystemEmail] = useState('admin@academicpredictor.com');

    useEffect(() => {
        if (currentUser) {
            fetchSettings();
        }
    }, [currentUser]);

    const fetchSettings = async () => {
        try {
            const token = currentUser.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

            const { data } = await axios.get(`${baseURL}/admin/settings`, config);

            setMaintenanceMode(data.maintenanceMode);
            setAllowRegistration(data.allowRegistration);
            setSystemEmail(data.systemEmail);
        } catch (error) {
            console.error("Failed to load settings:", error);
            setMessage({ type: 'error', text: 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const token = currentUser.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

            await axios.put(`${baseURL}/admin/settings`, {
                maintenanceMode,
                allowRegistration,
                systemEmail
            }, config);

            setMessage({ type: 'success', text: 'Settings saved successfully!' });

            
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                    <p className="text-gray-500">Global application configuration</p>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">
                {/* General Settings */}
                <div>
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <Power className="w-5 h-5 mr-2 text-indigo-500" />
                        System Control
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <span className="block font-medium text-gray-900">Maintenance Mode</span>
                                <span className="text-sm text-gray-500">Disable access for all non-admin users</span>
                            </div>
                            <button
                                onClick={() => setMaintenanceMode(!maintenanceMode)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${maintenanceMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <span className="block font-medium text-gray-900">Allow New Registrations</span>
                                <span className="text-sm text-gray-500">Temporarily stop new users from signing up</span>
                            </div>
                            <button
                                onClick={() => setAllowRegistration(!allowRegistration)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${allowRegistration ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${allowRegistration ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div>
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <Bell className="w-5 h-5 mr-2 text-indigo-500" />
                        Notifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">System Email Address</label>
                            <input
                                type="email"
                                value={systemEmail}
                                onChange={(e) => setSystemEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
