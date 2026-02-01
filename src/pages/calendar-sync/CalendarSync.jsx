import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const CalendarSync = () => {
    const [connections, setConnections] = useState({
        google: false,
        outlook: false,
        apple: false
    });

    const [loading, setLoading] = useState({
        google: false,
        outlook: false,
        apple: false
    });

    useEffect(() => {
        // Load state from local storage on mount
        const saved = localStorage.getItem('calendar_sync_connections');
        if (saved) {
            setConnections(JSON.parse(saved));
        }
    }, []);

    const saveState = (newState) => {
        setConnections(newState);
        localStorage.setItem('calendar_sync_connections', JSON.stringify(newState));
    };

    const handleConnect = async (provider) => {
        if (connections[provider]) {
            // Disconnect logic
            saveState({ ...connections, [provider]: false });
            return;
        }

        if (provider === 'google') {
            // REAL AUTH FLOW
            window.location.href = 'http://localhost:5002/api/auth/google';
            return;
        }

        // Keep mock for others for now
        setLoading(prev => ({ ...prev, [provider]: true }));
        await new Promise(resolve => setTimeout(resolve, 1500));
        await generateMockEvents(provider);
        setLoading(prev => ({ ...prev, [provider]: false }));
        saveState({ ...connections, [provider]: true });
    };

    const generateMockEvents = async (provider) => {
        const today = new Date();
        const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

        const mockEvents = [
            {
                title: `${providerName} Calendar Sync: Team Meeting`,
                date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
                time: "10:00",
                description: `Imported from ${providerName} Calendar`,
                type: 'other' // default blue
            },
            {
                title: `${providerName} Calendar Sync: Project Deadline`,
                date: new Date(today.getTime() + 48 * 60 * 60 * 1000).toISOString(),
                time: "17:00",
                description: `Imported from ${providerName} Calendar`,
                type: 'deadline' // orange
            },
            {
                title: `${providerName} Calendar Sync: Study Session`,
                date: new Date(today.getTime() + 72 * 60 * 60 * 1000).toISOString(),
                time: "14:00-16:00",
                description: `Imported from ${providerName} Calendar`,
                type: 'class' // will be blue/purple usually
            }
        ];

        try {
            const savePromises = mockEvents.map(event =>
                fetch('/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(event)
                })
            );
            await Promise.all(savePromises);
        } catch (error) {
            console.error("Failed to sync events", error);
        }
    };

    const renderProvider = (id, name, description, iconSrc, iconName, iconBg) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {iconSrc ? (
                    <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center p-2">
                        <img src={iconSrc} alt={name} />
                    </div>
                ) : (
                    <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center text-white`}>
                        <Icon name={iconName} size={24} />
                    </div>
                )}
                <div>
                    <h3 className="font-bold text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
            <Button
                variant={connections[id] ? "solid" : "outline"}
                className={connections[id] ? "!bg-green-600 !border-green-600 hover:!bg-green-700" : ""}
                onClick={() => handleConnect(id)}
                disabled={loading[id]}
            >
                {loading[id] ? 'Connecting...' : connections[id] ? 'Connected' : 'Connect'}
            </Button>
        </div>
    );

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">Calendar Sync</h1>
            <p className="text-gray-500">Connect your external calendars to view everything in one place.</p>

            {/* Added for clarity in Demo */}
            {Object.values(connections).some(Boolean) && (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm border border-blue-100">
                    <strong className="font-semibold">Demo Mode:</strong> Events from connected calendars have been simulated and added to your main Calendar.
                </div>
            )}

            <div className="space-y-4 mt-8">
                {renderProvider(
                    'google',
                    'Google Calendar',
                    'Sync events from your Google account',
                    'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
                    null,
                    null
                )}

                {renderProvider(
                    'outlook',
                    'Outlook Calendar',
                    'Sync with Microsoft Outlook',
                    null,
                    'Calendar',
                    'bg-[#0078d4]'
                )}

                {renderProvider(
                    'apple',
                    'Apple Calendar',
                    'Sync via iCloud',
                    null,
                    'Smartphone',
                    'bg-gray-900'
                )}
            </div>
        </div>
    );
};

export default CalendarSync;
