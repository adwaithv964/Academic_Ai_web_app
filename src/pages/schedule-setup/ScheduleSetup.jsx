import React from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const ScheduleSetup = () => {
    const termOptions = [
        { value: 'fall2023', label: 'Fall 2023' },
        { value: 'spring2024', label: 'Spring 2024' },
    ];

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Schedule Setup</h1>
                <p className="text-gray-500">Configure your academic term details</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <Select label="Current Academic Term" options={termOptions} placeholder="Select Term" />

                <div className="grid grid-cols-2 gap-4">
                    <Input type="date" label="Term Start Date" />
                    <Input type="date" label="Term End Date" />
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Default Class Duration</h3>
                    <div className="flex gap-4">
                        <button className="flex-1 py-2 px-4 border border-blue-500 bg-blue-50 text-blue-700 rounded-lg font-medium">45 mins</button>
                        <button className="flex-1 py-2 px-4 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50">60 mins</button>
                        <button className="flex-1 py-2 px-4 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50">90 mins</button>
                    </div>
                </div>

                <div className="pt-4">
                    <Button fullWidth>Save Configuration</Button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleSetup;
