import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
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

const Classes = () => {
    const { currentUser } = useAuth();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    const selectedColor = watch('color', COLORS[0].value);

    
    const fetchClasses = async () => {
        try {
            const data = await api.courses.list();
            setClasses(data);
        } catch (error) {
            console.error("Failed to fetch classes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchClasses();
        }
    }, [currentUser]);

    
    const openModal = (cls = null) => {
        setEditingClass(cls);
        if (cls) {
            setValue('name', cls.name);
            setValue('code', cls.code);
            setValue('instructor', cls.instructor || '');
            setValue('color', cls.color || COLORS[0].value);
            setValue('progress', cls.progress || 0);
        } else {
            reset({
                name: '',
                code: '',
                instructor: '',
                color: COLORS[0].value,
                progress: 0
            });
        }
        setIsModalOpen(true);
    };

    
    const onSubmit = async (data) => {
        try {
            if (editingClass) {
                await api.courses.update(editingClass._id, data);
            } else {
                await api.courses.create(data);
            }
            fetchClasses();
            setIsModalOpen(false);
            setEditingClass(null);
        } catch (error) {
            console.error("Failed to save class", error);
        }
    };

    
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this class?")) {
            try {
                await api.courses.delete(id);
                fetchClasses();
            } catch (error) {
                console.error("Failed to delete class", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
                    <p className="text-gray-500 text-sm">Manage your subjects and schedules</p>
                </div>
                <Button onClick={() => openModal()} iconName="Plus">Add Class</Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12 text-gray-400">Loading classes...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map(cls => (
                        <div key={cls._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center shadow-inner"
                                    style={{ backgroundColor: cls.color || '#E2E8F0' }}
                                >
                                    <Icon name="BookOpen" size={24} className="text-gray-800 opacity-70" />
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                        onClick={() => openModal(cls)}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        title="Edit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cls._id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 mb-1">{cls.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 font-medium mb-1">
                                <span className="uppercase tracking-wider mr-2 bg-gray-100 px-2 py-0.5 rounded text-xs">{cls.code}</span>
                            </div>
                            {cls.instructor && (
                                <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                                    <Icon name="User" size={14} /> {cls.instructor}
                                </p>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end gap-3 text-sm">
                                <span
                                    className="cursor-pointer text-gray-400 hover:text-blue-600 font-medium transition-colors"
                                    onClick={() => openModal(cls)}
                                >
                                    Edit
                                </span>
                                <span
                                    className="cursor-pointer text-gray-400 hover:text-red-600 font-medium transition-colors"
                                    onClick={() => handleDelete(cls._id)}
                                >
                                    Delete
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card (Empty State) */}
                    <button
                        onClick={() => openModal()}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors min-h-[200px]"
                    >
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <Icon name="Plus" size={24} />
                        </div>
                        <span className="font-medium">Add New Class</span>
                    </button>
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
                                    {editingClass ? 'Edit Class' : 'Add New Class'}
                                </h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <Input
                                        label="Class Name"
                                        placeholder="e.g. Advanced Mathematics"
                                        {...register('name', { required: 'Class name is required' })}
                                        error={errors.name?.message}
                                    />
                                    <Input
                                        label="Class Code (Optional)"
                                        placeholder="Optional code"
                                        {...register('code', { required: false })}
                                        error={errors.code?.message}
                                    />
                                    <Input
                                        label="Instructor (Optional)"
                                        placeholder="e.g. Dr. Sarah Smith"
                                        {...register('instructor')}
                                    />

                                    <Input
                                        label="Syllabus Progress (%)"
                                        type="number"
                                        min="0"
                                        max="100"
                                        placeholder="0-100"
                                        {...register('progress', { min: 0, max: 100 })}
                                    />

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
                                        <Button type="submit">Save Class</Button>
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

export default Classes;
