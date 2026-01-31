import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = [
    { value: '#AEC6CF', label: 'Pastel Blue' },
    { value: '#FFB7B2', label: 'Pastel Pink' },
    { value: '#FDFD96', label: 'Pastel Yellow' },
    { value: '#B9E4C9', label: 'Pastel Green' },
    { value: '#C3B1E1', label: 'Pastel Purple' },
    { value: '#FFD1DC', label: 'Pastel Rose' },
    { value: '#E6E6FA', label: 'Lavender' },
    { value: '#FFDAC1', label: 'Peach' },
];

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    const selectedColor = watch('color', COLORS[0].value);

    // Fetch Exams
    const fetchExams = async () => {
        try {
            const res = await axios.get('http://localhost:5002/api/exams');
            setExams(res.data);
        } catch (error) {
            console.error("Failed to fetch exams", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    // Open Modal
    const openModal = (exam = null) => {
        setEditingExam(exam);
        if (exam) {
            setValue('subject', exam.subject);
            setValue('date', exam.date ? new Date(exam.date).toISOString().split('T')[0] : '');
            setValue('time', exam.time);
            setValue('note', exam.note || '');
            setValue('period', exam.period || '');
            setValue('color', exam.color || COLORS[0].value);
        } else {
            reset({
                subject: '',
                date: '',
                time: '',
                note: '',
                period: '',
                color: COLORS[0].value
            });
        }
        setIsModalOpen(true);
    };

    // Save Exam (Create/Update)
    const onSubmit = async (data) => {
        try {
            if (editingExam) {
                await axios.put(`http://localhost:5002/api/exams/${editingExam._id}`, data);
            } else {
                await axios.post('http://localhost:5002/api/exams', data);
            }
            fetchExams();
            setIsModalOpen(false);
            setEditingExam(null);
        } catch (error) {
            console.error("Failed to save exam", error);
        }
    };

    // Delete Exam
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this exam?")) {
            try {
                await axios.delete(`http://localhost:5002/api/exams/${id}`);
                fetchExams();
            } catch (error) {
                console.error("Failed to delete exam", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
                    <p className="text-gray-500 text-sm">Upcoming assessments and tests</p>
                </div>
                <Button onClick={() => openModal()} iconName="Plus">Add Exam</Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12 text-gray-400">Loading exams...</div>
            ) : (
                <div className="space-y-4">
                    {exams.length > 0 ? exams.map(exam => (
                        <div
                            key={exam._id}
                            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group relative overflow-hidden"
                            style={{ backgroundColor: exam.color || '#fff' }}
                        >
                            {/* Darker left border for emphasis if colored */}
                            {exam.color && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/10"></div>
                            )}

                            <div className="flex items-center gap-5 pl-2">
                                <div className={`p-3 rounded-xl text-center min-w-[70px] border ${exam.color ? 'bg-white/40 border-black/5' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    <span className="block text-xs font-bold uppercase tracking-wider opacity-80">{new Date(exam.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="block text-2xl font-bold">{new Date(exam.date).getDate()}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{exam.subject}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-700 mt-1 font-medium opacity-80">
                                        {exam.time && <span className="flex items-center gap-1.5"><Icon name="Clock" size={14} /> {exam.time}</span>}
                                        {exam.period && <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs ${exam.color ? 'bg-white/40' : 'bg-gray-100 text-gray-600'}`}>Period {exam.period}</span>}
                                        {exam.note && <span className="flex items-center gap-1.5 italic opacity-80">"{exam.note}"</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openModal(exam)}
                                    className="p-2 text-gray-600 hover:text-blue-700 hover:bg-white/40 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(exam._id)}
                                    className="p-2 text-gray-600 hover:text-red-700 hover:bg-white/40 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon name="FileText" size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">No exams scheduled</h3>
                            <p className="text-gray-500 mt-1">Add your upcoming assessments to track them here.</p>
                            <Button className="mt-6" onClick={() => openModal()} iconName="Plus">Add First Exam</Button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                            className="fixed left-1/2 top-1/2 w-full max-w-lg bg-white rounded-2xl shadow-xl z-[70] overflow-hidden"
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-6 text-gray-900">
                                    {editingExam ? 'Edit Exam' : 'Add New Exam'}
                                </h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <Input
                                        label="Subject / Exam Name"
                                        placeholder="e.g. Physics Midterm"
                                        {...register('subject', { required: 'Subject is required' })}
                                        error={errors.subject?.message}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Date"
                                            type="date"
                                            {...register('date', { required: 'Date is required' })}
                                            error={errors.date?.message}
                                        />
                                        <Input
                                            label="Time (Optional)"
                                            type="time"
                                            {...register('time', { required: false })}
                                            error={errors.time?.message}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Period (Optional)"
                                            type="number"
                                            placeholder="e.g. 1"
                                            {...register('period', { required: false })}
                                        />
                                        <Input
                                            label="Small Note (Optional)"
                                            placeholder="e.g. Bring calculator"
                                            {...register('note', { required: false })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Color Tag</label>
                                        <div className="flex flex-wrap gap-3">
                                            {COLORS.map((color) => (
                                                <button
                                                    key={color.label}
                                                    type="button"
                                                    onClick={() => setValue('color', color.value)}
                                                    className={`
                                                        w-8 h-8 rounded-full transition-all relative flex items-center justify-center border border-gray-100
                                                        ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'}
                                                    `}
                                                    style={{ backgroundColor: color.value }}
                                                    title={color.label}
                                                >
                                                    {selectedColor === color.value && <div className="w-2 h-2 bg-white/50 rounded-full" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-50">
                                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                        <Button type="submit">Save Exam</Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Exams;
