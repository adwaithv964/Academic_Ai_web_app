import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const COLORS = [
    { value: 'bg-rose-100 text-rose-700 border-rose-200', label: 'Pastel Red', picker: 'bg-rose-400' },
    { value: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Pastel Orange', picker: 'bg-orange-400' },
    { value: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Pastel Yellow', picker: 'bg-amber-400' },
    { value: 'bg-lime-100 text-lime-700 border-lime-200', label: 'Pastel Lime', picker: 'bg-lime-400' },
    { value: 'bg-green-100 text-green-700 border-green-200', label: 'Pastel Green', picker: 'bg-green-400' },
    { value: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Pastel Emerald', picker: 'bg-emerald-400' },
    { value: 'bg-teal-100 text-teal-700 border-teal-200', label: 'Pastel Teal', picker: 'bg-teal-400' },
    { value: 'bg-cyan-100 text-cyan-700 border-cyan-200', label: 'Pastel Cyan', picker: 'bg-cyan-400' },
    { value: 'bg-sky-100 text-sky-700 border-sky-200', label: 'Pastel Sky', picker: 'bg-sky-400' },
    { value: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Pastel Blue', picker: 'bg-blue-400' },
    { value: 'bg-indigo-100 text-indigo-700 border-indigo-200', label: 'Pastel Indigo', picker: 'bg-indigo-400' },
    { value: 'bg-violet-100 text-violet-700 border-violet-200', label: 'Pastel Violet', picker: 'bg-violet-400' },
    { value: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Pastel Purple', picker: 'bg-purple-400' },
    { value: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200', label: 'Pastel Fuchsia', picker: 'bg-fuchsia-400' },
    { value: 'bg-pink-100 text-pink-700 border-pink-200', label: 'Pastel Pink', picker: 'bg-pink-400' },
    { value: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Pastel Gray', picker: 'bg-gray-400' },
];

const AddEventModal = ({ isOpen, onClose, onSave, eventToEdit, onDelete }) => {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    const selectedColor = watch('color');

    useEffect(() => {
        if (isOpen) {
            if (eventToEdit) {
                setValue('title', eventToEdit.title);
                setValue('date', eventToEdit.date instanceof Date ? eventToEdit.date.toISOString().split('T')[0] : eventToEdit.date?.split('T')[0]);
                setValue('time', eventToEdit.time || '');
                setValue('description', eventToEdit.description || '');
                setValue('color', eventToEdit.color || COLORS[9].value); // Default Blue
            } else {
                reset({
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    time: '',
                    description: '',
                    color: COLORS[9].value
                });
            }
        }
    }, [isOpen, eventToEdit, setValue, reset]);

    const onSubmit = (data) => {
        onSave({ ...data, _id: eventToEdit?._id });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        className="fixed left-1/2 top-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {eventToEdit ? 'Edit Event' : 'New Event'}
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <Input
                                        label="Title"
                                        {...register('title', { required: 'Title is required' })}
                                        error={errors.title?.message}
                                        placeholder="e.g., Marketing Strategy Meeting"
                                        className="text-lg"
                                        autoFocus
                                    />

                                    <div className="grid grid-cols-2 gap-6">
                                        <Input
                                            label="Date"
                                            type="date"
                                            {...register('date', { required: 'Date is required' })}
                                            error={errors.date?.message}
                                        />
                                        <Input
                                            label="Time (Optional)"
                                            type="time"
                                            {...register('time')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Color Code</label>
                                        <div className="flex flex-wrap gap-3">
                                            {COLORS.map((color) => (
                                                <button
                                                    key={color.label}
                                                    type="button"
                                                    onClick={() => setValue('color', color.value)}
                                                    className={`
                                                        w-10 h-10 rounded-full transition-all relative flex items-center justify-center
                                                        ${color.picker}
                                                        ${selectedColor === color.value ? 'ring-4 ring-offset-2 ring-gray-200 scale-110' : 'hover:scale-110 hover:shadow-md'}
                                                    `}
                                                    title={color.label}
                                                >
                                                    {selectedColor === color.value && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Input
                                        label="Notes"
                                        {...register('description')}
                                        placeholder="Add description, location, or agenda..."
                                        textarea
                                        rows={3}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-8">
                                    {eventToEdit ? (
                                        <button
                                            type="button"
                                            onClick={() => { onDelete(eventToEdit._id); onClose(); }}
                                            className="px-4 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            Delete Event
                                        </button>
                                    ) : <div></div>}

                                    <div className="flex gap-3">
                                        <Button type="button" variant="secondary" onClick={onClose}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            {eventToEdit ? 'Save Changes' : 'Create Event'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddEventModal;
