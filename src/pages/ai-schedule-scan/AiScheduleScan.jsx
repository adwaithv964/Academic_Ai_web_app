import React, { useState, useRef } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { events as eventsApi } from '../../services/api';

const AiScheduleScan = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);
    const { addNotification } = useNotificationContext();

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
            setEvents([]);
            setSaved(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
            setEvents([]);
            setSaved(false);
        }
    };

    const processFile = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/ai-scan', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to process file');
            }

            if (data.events) {
                setEvents(data.events);
                addNotification({
                    id: `ai-scan-${Date.now()}`,
                    type: 'AI_SCAN',
                    title: '🤖 AI Scan Complete!',
                    message: `Found ${data.events.length} event${data.events.length !== 1 ? 's' : ''} in your schedule. Review and save them to your calendar.`,
                    timestamp: Date.now(),
                    unread: true,
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveToCalendar = async () => {
        try {
            const savePromises = events.map(event =>
                eventsApi.create(event)
            );

            await Promise.all(savePromises);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            addNotification({
                id: `ai-scan-saved-${Date.now()}`,
                type: 'CALENDAR',
                title: '📆 Events Added to Calendar',
                message: `${events.length} event${events.length !== 1 ? 's' : ''} from your schedule scan have been saved to your calendar.`,
                timestamp: Date.now(),
                unread: true,
            });
        } catch (err) {
            console.error("Failed to save to calendar", err);
            setError("Failed to save to calendar. Please try again.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center max-w-4xl mx-auto py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                    <Icon name="Camera" size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Schedule Scan</h1>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Upload a photo or screenshot of your class schedule, exam timetable, or syllabus. Our AI will automatically detect dates and events to populate your calendar.
                </p>

                {/* Upload Area */}
                <div
                    className={`border-2 border-dashed rounded-2xl p-12 transition-colors cursor-pointer relative ${file ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,.pdf"
                    />

                    {file ? (
                        <div className="flex flex-col items-center">
                            {file.type.startsWith('image/') ? (
                                <img src={preview} alt="Preview" className="h-48 object-contain rounded-lg mb-4 shadow-sm" />
                            ) : (
                                <Icon name="FileText" size={64} className="text-primary mb-4" />
                            )}
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <Button
                                onClick={(e) => { e.stopPropagation(); processFile(); }}
                                disabled={loading}
                                className="w-full max-w-xs"
                            >
                                {loading ? 'Processing...' : 'Analyze Schedule'}
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Icon name="UploadCloud" size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="font-bold text-gray-800">Drag & Drop or Click to Upload</h3>
                            <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, PDF</p>
                            <Button className="mt-6" variant="outline" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>Select File</Button>
                        </>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg max-w-2xl mx-auto">
                        {error}
                    </div>
                )}

                {/* Results Section */}
                <AnimatePresence>
                    {events.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 text-left"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Detected Events ({events.length})</h2>
                                <Button onClick={saveToCalendar} disabled={saved}>
                                    {saved ? 'Saved to Calendar!' : 'Add All to Calendar'}
                                </Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {events.map((event, index) => (
                                    <div key={index} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{event.title}</h3>
                                                <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                                                {event.description && <p className="text-sm text-gray-600 mt-2">{event.description}</p>}
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium 
                                                ${event.type === 'exam' ? 'bg-red-100 text-red-700' :
                                                    event.type === 'deadline' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-blue-100 text-blue-700'}`}>
                                                {event.type || 'Event'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AiScheduleScan;
