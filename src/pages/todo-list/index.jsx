import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tasks as tasksApi } from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TaskModal from './components/TaskModal';
import KanbanView from './components/KanbanView';
import ListView from './components/ListView';
import PomodoroTimer from './components/PomodoroTimer';
import { useAuth } from '../../contexts/AuthContext';

const TodoList = () => {
    const { refreshUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // list or kanban
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('all'); // all, active, completed

    // API Integration
    const fetchTasks = async () => {
        try {
            const data = await tasksApi.list();
            // Backend returns _id, frontend might need id or just use _id.
            // Let's normalize to ensure compatibility with existing UI if it uses .id
            const normalizedTasks = data.map(t => ({
                ...t,
                id: t._id, // Map _id to id for frontend compatibility
                status: t.completed ? 'done' : (t.status || 'todo') // Normalize status
            }));
            setTasks(normalizedTasks);
        } catch (error) {
            console.error("Failed to load tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Save tasks - REMOVED LocalStorage effect

    const handleCreateTask = async (taskData) => {
        try {
            if (editingTask) {
                // Update
                const updated = await tasksApi.update(editingTask.id, taskData);
                setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...updated, id: updated._id, status: updated.completed ? 'done' : updated.status || 'todo' } : t));
            } else {
                // Create
                // Ensure proper fields are sent. Backend expects: title, priority, etc.
                const { id, ...payload } = taskData; // Remove temp id
                const created = await tasksApi.create(payload);
                setTasks(prev => [...prev, { ...created, id: created._id, status: created.completed ? 'done' : created.status || 'todo' }]);
            }
            setIsModalOpen(false);
            setEditingTask(null);

            // Refresh User for Quests (Task Force)
            if (refreshUser) setTimeout(() => refreshUser(), 500);

        } catch (error) {
            console.error("Failed to save task:", error);
            // Optionally show error notification
        }
    };

    const handleDeleteTask = async (id) => {
        if (confirm('Delete this task?')) {
            try {
                await tasksApi.delete(id);
                setTasks(tasks.filter(t => t.id !== id));
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            // Optimistic update
            setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));

            const completed = newStatus === 'done';
            await tasksApi.update(id, { status: newStatus, completed });

            // If completing a task, refresh user data for Quests
            if (completed && refreshUser) {
                setTimeout(() => refreshUser(), 500);
            }
        } catch (error) {
            console.error("Failed to update task status:", error);
            // Revert on failure? For now just log.
            fetchTasks(); // Re-fetch to sync
        }
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
