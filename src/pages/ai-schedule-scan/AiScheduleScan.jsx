import React from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const AiScheduleScan = () => {
    return (
        <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                    <Icon name="Camera" size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Schedule Scan</h1>
                <p className="text-gray-600 mb-8">
                    Upload a photo or screenshot of your class schedule, exam timetable, or syllabus. Our AI will automatically detect dates and events to populate your calendar.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <Icon name="UploadCloud" size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="font-bold text-gray-800">Drag & Drop or Click to Upload</h3>
                    <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, PDF</p>
                    <Button className="mt-6" variant="outline">Select File</Button>
                </div>
            </div>
        </div>
    );
};

export default AiScheduleScan;
