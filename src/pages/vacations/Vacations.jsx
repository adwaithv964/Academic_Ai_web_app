import React from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Vacations = () => {
    const vacations = [
        { id: 1, name: 'Summer Break', start: '2023-06-15', end: '2023-08-30', days: 76 },
        { id: 2, name: 'Winter Holidays', start: '2023-12-20', end: '2024-01-05', days: 16 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vacations & Holidays</h1>
                    <p className="text-gray-500 text-sm">Plan your breaks and time off</p>
                </div>
                <Button iconName="Plus">Add Holiday</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vacations.map(vacation => (
                    <div key={vacation.id} className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-white/80 p-2 rounded-lg shadow-sm">
                                <Icon name="Palmtree" className="text-cyan-600" size={24} />
                            </div>
                            <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded-full font-medium">{vacation.days} days</span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-800 mb-1">{vacation.name}</h3>
                        <p className="text-gray-600 text-sm flex items-center gap-2">
                            <Icon name="Calendar" size={14} />
                            {vacation.start} - {vacation.end}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vacations;
