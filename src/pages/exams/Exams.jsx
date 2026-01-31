import React from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Exams = () => {
    const exams = [
        { id: 1, subject: 'Math Midterm', date: '2023-10-15', time: '10:00 AM', location: 'Hall A' },
        { id: 2, subject: 'Physics Final', date: '2023-12-10', time: '02:00 PM', location: 'Lab 3' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
                    <p className="text-gray-500 text-sm">Upcoming assessments and tests</p>
                </div>
                <Button iconName="Plus">Add Exam</Button>
            </div>

            <div className="space-y-3">
                {exams.map(exam => (
                    <div key={exam.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center min-w-[60px]">
                                <span className="block text-xs font-bold uppercase">{new Date(exam.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="block text-xl font-bold">{new Date(exam.date).getDate()}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{exam.subject}</h3>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1"><Icon name="Clock" size={12} /> {exam.time}</span>
                                    <span className="flex items-center gap-1"><Icon name="MapPin" size={12} /> {exam.location}</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
                    </div>
                ))}
                {exams.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Icon name="FileText" size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No upcoming exams</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Exams;
