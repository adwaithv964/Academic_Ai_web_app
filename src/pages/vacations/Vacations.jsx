import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';

const Vacations = () => {
    const [vacations, setVacations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchVacations();
    }, []);

    const fetchVacations = async () => {
        try {
            const res = await fetch('http://localhost:5002/api/vacations');
            if (res.ok) {
                const data = await res.json();
                setVacations(data);
            }
        } catch (error) {
            console.error("Failed to fetch vacations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1; // Include start date
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.startDate || !formData.endDate) return;

        const days = calculateDays(formData.startDate, formData.endDate);
        const payload = { ...formData, days };

        try {
            const res = await fetch('http://localhost:5002/api/vacations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const newVacation = await res.json();
                setVacations([...vacations, newVacation]);
                setIsModalOpen(false);
                setFormData({ name: '', startDate: '', endDate: '' });
            }
        } catch (error) {
            console.error("Failed to add vacation:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vacation?")) return;

        try {
            const res = await fetch(`http://localhost:5002/api/vacations/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setVacations(vacations.filter(v => v._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete vacation:", error);
        }
    };

    const colorPalettes = [
        {
            gradient: "from-cyan-50 to-blue-50",
            border: "border-cyan-100",
            iconColor: "text-cyan-600",
            chipBg: "bg-cyan-100",
            chipText: "text-cyan-700",
            trashHover: "text-cyan-400"
        },
        {
            gradient: "from-rose-50 to-pink-50",
            border: "border-rose-100",
            iconColor: "text-rose-600",
            chipBg: "bg-rose-100",
            chipText: "text-rose-700",
            trashHover: "text-rose-400"
        },
        {
            gradient: "from-violet-50 to-purple-50",
            border: "border-violet-100",
            iconColor: "text-violet-600",
            chipBg: "bg-violet-100",
            chipText: "text-violet-700",
            trashHover: "text-violet-400"
        },
        {
            gradient: "from-amber-50 to-orange-50",
            border: "border-amber-100",
            iconColor: "text-amber-600",
            chipBg: "bg-amber-100",
            chipText: "text-amber-700",
            trashHover: "text-amber-400"
        },
        {
            gradient: "from-emerald-50 to-teal-50",
            border: "border-emerald-100",
            iconColor: "text-emerald-600",
            chipBg: "bg-emerald-100",
            chipText: "text-emerald-700",
            trashHover: "text-emerald-400"
        }
    ];

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vacations & Holidays</h1>
                    <p className="text-gray-500 text-sm">Plan your breaks and time off</p>
                </div>
                <Button iconName="Plus" onClick={() => setIsModalOpen(true)}>Add Holiday</Button>
            </div>

            {isLoading ? (
                <p className="text-gray-500">Loading vacations...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vacations.length === 0 ? (
                        <p className="text-gray-500 col-span-2 text-center py-8">No vacations planned yet. Add one!</p>
                    ) : (
                        vacations.map((vacation, index) => {
                            const palette = colorPalettes[index % colorPalettes.length];
                            return (
                                <div key={vacation._id} className={`bg-gradient-to-br ${palette.gradient} p-6 rounded-xl border ${palette.border} relative group`}>
                                    <button
                                        onClick={() => handleDelete(vacation._id)}
                                        className={`absolute top-4 right-4 ${palette.trashHover} hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity`}
                                    >
                                        <Icon name="Trash2" size={18} />
                                    </button>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-white/80 p-2 rounded-lg shadow-sm">
                                            <Icon name="Palmtree" className={palette.iconColor} size={24} />
                                        </div>
                                        <span className={`${palette.chipBg} ${palette.chipText} text-xs px-2 py-1 rounded-full font-medium`}>{vacation.days} days</span>
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-1">{vacation.name}</h3>
                                    <p className="text-gray-600 text-sm flex items-center gap-2">
                                        <Icon name="Calendar" size={14} />
                                        {formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add New Holiday</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="X" size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Holiday Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Summer Break"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Start Date"
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Input
                                    label="End Date"
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Add Holiday
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vacations;
