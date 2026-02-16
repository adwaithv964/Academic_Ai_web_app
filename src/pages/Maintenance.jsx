import React from 'react';
import { PenTool, Lock } from 'lucide-react';
import axios from 'axios';

const Maintenance = () => {
    const [email, setEmail] = React.useState('');

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';
                const { data } = await axios.get(`${baseURL}/public/status`);
                if (data.systemEmail) setEmail(data.systemEmail);
            } catch (e) {
                console.error("Failed to fetch settings", e);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <PenTool className="w-12 h-12 text-indigo-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900">Under Maintenance</h1>

                <p className="text-gray-600 text-lg">
                    We're currently improving our system to serve you better.
                    Please check back later.
                </p>

                {email && (
                    <div className="text-sm text-gray-500">
                        Contact Support: <a href={`mailto:${email}`} className="text-indigo-600 hover:underline">{email}</a>
                    </div>
                )}

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-indigo-500" />
                        Admin Access
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Administrators can still access the dashboard directly.
                    </p>
                    <a
                        href="/admin/login"
                        className="block w-full py-2 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Admin Login
                    </a>
                </div>

                <div className="text-xs text-gray-400">
                    Expected downtime: Unknown
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
