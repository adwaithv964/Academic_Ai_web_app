import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { tasks as tasksApi } from '../../../services/api';

const PriorityTasksWidget = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadTasks = async () => {
        try {
            setIsLoading(true);
            const allTasks = await tasksApi.list();

            // Filter pending tasks
            const pending = allTasks.filter(t => !t.completed && t.status !== 'done');

            // Sort by priority (high > medium > low) and due date if available
            const sorted = pending.sort((a, b) => {
                const pMap = { high: 3, medium: 2, low: 1 };
                const pA = pMap[a.priority?.toLowerCase()] || 0;
                const pB = pMap[b.priority?.toLowerCase()] || 0;
                if (pA !== pB) return pB - pA;
                return 0; // simplistic sort, could add due date
            });

            setTasks(sorted.slice(0, 5)); // Show top 5
        } catch (e) {
            console.error("Error loading tasks", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();

        // Listen for task updates from other components
        const handleTaskUpdate = () => loadTasks();
        window.addEventListener('task-updated', handleTaskUpdate);

        return () => window.removeEventListener('task-updated', handleTaskUpdate);
    }, []);

    const handleComplete = async (taskId) => {
        try {
            await tasksApi.update(taskId, { completed: true, status: 'done' });
            // Refresh local list immediately
            setTasks(prev => prev.filter(t => t._id !== taskId && t.id !== taskId));

            // Notify other components
            window.dispatchEvent(new Event('task-updated'));
        } catch (e) {
            console.error("Error updating task", e);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex items-center justify-center">
                <div className="text-sm text-gray-500">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                    <Icon name="CheckSquare" size={20} className="text-blue-500" />
                    Pending Assignments
                </h3>
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">View All</Button>
            </div>

            <div className="space-y-3">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task._id || task.id} className="group flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                <div>
                                    <p className="font-medium text-gray-800 text-sm line-clamp-1">{task.title}</p>
                                    <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                                        {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                        {task.tags?.map(tag => (
                                            <span key={tag} className="uppercase text-[10px] bg-gray-200 px-1 rounded">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={() => handleComplete(task._id || task.id)}
                                    className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                                    title="Mark Complete"
                                >
                                    <Icon name="Check" size={16} />
                                </button>
                                <button
                                    className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                                    title="Start Timer"
                                >
                                    <Icon name="Play" size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        No pending tasks. Great job!
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriorityTasksWidget;
