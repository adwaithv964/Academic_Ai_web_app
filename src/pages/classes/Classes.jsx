import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';

const Classes = () => {
    const [classes, setClasses] = useState([
        { id: 1, name: 'Advanced Mathematics', code: 'MATH301', color: 'bg-blue-100 text-blue-700' },
        { id: 2, name: 'Physics', code: 'PHY201', color: 'bg-green-100 text-green-700' },
        { id: 3, name: 'Computer Science', code: 'CS102', color: 'bg-indigo-100 text-indigo-700' },
    ]);
    const [showAdd, setShowAdd] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
                    <p className="text-gray-500 text-sm">Manage your subjects and schedules</p>
                </div>
                <Button onClick={() => setShowAdd(!showAdd)} iconName="Plus">Add Class</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map(cls => (
                    <div key={cls.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 ${cls.color} rounded-lg flex items-center justify-center mb-4`}>
                            <Icon name="BookOpen" size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{cls.name}</h3>
                        <p className="text-gray-500">{cls.code}</p>
                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end gap-2">
                            <button className="text-sm text-gray-500 hover:text-blue-600">Edit</button>
                            <button className="text-sm text-gray-500 hover:text-red-600">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Class</h2>
                        <div className="space-y-4">
                            <Input label="Class Name" placeholder="e.g. Biology" />
                            <Input label="Class Code" placeholder="e.g. BIO101" />
                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                                <Button onClick={() => setShowAdd(false)}>Save Class</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Classes;
