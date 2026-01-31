import React from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const CalendarSync = () => {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">Calendar Sync</h1>
            <p className="text-gray-500">Connect your external calendars to view everything in one place.</p>

            <div className="space-y-4 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center p-2">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Google Calendar</h3>
                            <p className="text-sm text-gray-500">Sync events from your Google account</p>
                        </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#0078d4] rounded-full flex items-center justify-center text-white">
                            <Icon name="Calendar" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Outlook Calendar</h3>
                            <p className="text-sm text-gray-500">Sync with Microsoft Outlook</p>
                        </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white">
                            <Icon name="Smartphone" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Apple Calendar</h3>
                            <p className="text-sm text-gray-500">Sync via iCloud</p>
                        </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                </div>
            </div>
        </div>
    );
};

export default CalendarSync;
