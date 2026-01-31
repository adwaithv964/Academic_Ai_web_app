import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TaskModal from './components/TaskModal';
import KanbanView from './components/KanbanView';
import ListView from './components/ListView';
import PomodoroTimer from './components/PomodoroTimer';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // list or kanban
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('all'); // all, active, completed

    // Load and migrate tasks
    useEffect(() => {
        const savedTasks = localStorage.getItem('todoTasks');
        if (savedTasks) {
            try {
                let parsedTasks = JSON.parse(savedTasks);
                // Migration logic for old format
                parsedTasks = parsedTasks.map(t => {
                    if (t.status) return t; // Already migrated
                    return {
                        id: t.id,
                        title: t.text || 'Untitled Task',
                        status: t.completed ? 'done' : 'todo',
                        priority: 'medium',
                        dueDate: '',
                        description: '',
                        tags: []
                    };
                });
                setTasks(parsedTasks);
            } catch (e) {
                console.error("Failed to parse tasks", e);
            }
        }
    }, []);

    // Save tasks
    useEffect(() => {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleCreateTask = (taskData) => {
        if (editingTask) {
            setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
        } else {
            setTasks([...tasks, { ...taskData, id: Date.now() }]);
        }
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleDeleteTask = (id) => {
        if (confirm('Delete this task?')) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'all') return true;
        if (filter === 'active') return t.status !== 'done';
        if (filter === 'completed') return t.status === 'done';
        return true;
    });

    return (
        <div className="h-full bg-background/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                            <Icon name="CheckSquare" className="text-primary" />
                            Task Management
                        </h1>
                        <p className="text-muted-foreground">Manage your assignments, exams, and daily to-dos.</p>
                    </div>

                    <div className="flex items-center gap-3 bg-card border border-border p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Icon name="List" size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Icon name="LayoutGrid" size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
                    {/* Main Task Area */}
                    <div className="lg:col-span-2 flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                            <div className="flex gap-2">
                                {['all', 'active', 'completed'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${filter === f ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <Button onClick={openCreateModal} iconName="Plus" size="sm">
                                New Task
                            </Button>
                        </div>

                        <div className="items-start p-4 flex-1 h-full overflow-hidden">
                            {/* Scroll container logic handled inside views if needed, or here */}
                            <div className="h-full overflow-y-auto px-2 custom-scrollbar">
                                {viewMode === 'list' ? (
                                    <ListView
                                        tasks={filteredTasks}
                                        onStatusChange={handleStatusChange}
                                        onEdit={openEditModal}
                                        onDelete={handleDeleteTask}
                                    />
                                ) : (
                                    <KanbanView
                                        tasks={filteredTasks}
                                        onStatusChange={handleStatusChange}
                                        onEdit={openEditModal}
                                        onDelete={handleDeleteTask}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area: Pomodoro & Stats */}
                    <div className="space-y-6">
                        <PomodoroTimer />

                        <div className="bg-gradient-to-br from-primary/90 to-violet-600 rounded-2xl p-6 text-primary-foreground shadow-lg">
                            <h3 className="font-semibold text-lg mb-4">Productivity Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                    <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'done').length}</p>
                                    <p className="text-xs opacity-80">Completed Tasks</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                    <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'in_progress').length}</p>
                                    <p className="text-xs opacity-80">In Progress</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm col-span-2">
                                    <p className="text-2xl font-bold">{tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0}%</p>
                                    <div className="w-full bg-black/20 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="h-full bg-white transition-all duration-500"
                                            style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'done').length / tasks.length) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <p className="text-xs opacity-80 mt-1">Completion Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
                onSubmit={handleCreateTask}
                task={editingTask}
            />
        </div>
    );
};

export default TodoList;
