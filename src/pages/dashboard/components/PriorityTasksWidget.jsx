import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { tasks as tasksApi } from '../../../services/api';
import { startTimer, pauseTimer, setTask, setMode } from '../../../store/slices/focusSlice';

const PriorityTasksWidget = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isActive, task: currentTask } = useSelector(state => state.focus);

    const loadTasks = async () => {
        try {
            setIsLoading(true);
            const allTasks = await tasksApi.list();

            
            const pending = allTasks.filter(t => !t.completed && t.status !== 'done');

            
            const sorted = pending.sort((a, b) => {
                const pMap = { high: 3, medium: 2, low: 1 };
                const pA = pMap[a.priority?.toLowerCase()] || 0;
                const pB = pMap[b.priority?.toLowerCase()] || 0;
                if (pA !== pB) return pB - pA;
                return 0; 
            });

            setTasks(sorted.slice(0, 5)); 
        } catch (e) {
            console.error("Error loading tasks", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();

        
        const handleTaskUpdate = () => loadTasks();
        window.addEventListener('task-updated', handleTaskUpdate);

        return () => window.removeEventListener('task-updated', handleTaskUpdate);
    }, []);

    const handleComplete = async (taskId) => {
        try {
            await tasksApi.update(taskId, { completed: true, status: 'done' });
            
            setTasks(prev => prev.filter(t => t._id !== taskId && t.id !== taskId));

            
            window.dispatchEvent(new Event('task-updated'));
        } catch (e) {
            console.error("Error updating task", e);
        }
    };

    const handleTimerToggle = (task) => {
        const taskId = task._id || task.id;
        const isCurrentTask = currentTask?.id === taskId;

        if (isCurrentTask && isActive) {
            dispatch(pauseTimer());
        } else {
            
            dispatch(setTask({ id: taskId, title: task.title }));
            dispatch(setMode('focus')); 
            dispatch(startTimer());
        }
    };

    const isTaskActive = (taskId) => {
        return isActive && currentTask?.id === taskId;
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
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500"
                    onClick={() => navigate('/todo-list')}
                >
                    View All
                </Button>
            </div>

            <div className="space-y-3">
                {tasks.length > 0 ? (
                    tasks.map(task => {
                        const taskId = task._id || task.id;
                        const active = isTaskActive(taskId);

                        return (
                            <div key={taskId} className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${active ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-100 hover:border-blue-200 hover:shadow-sm'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                    <div>
                                        <p className={`font-medium text-sm line-clamp-1 ${active ? 'text-blue-700' : 'text-gray-800'}`}>{task.title}</p>
                                        <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                                            {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                            {task.tags?.map(tag => (
                                                <span key={tag} className="uppercase text-[10px] bg-gray-200 px-1 rounded">{tag}</span>
                                            ))}
                                            {active && <span className="text-blue-600 font-semibold animate-pulse">Running...</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className={`flex gap-2 transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <button
                                        onClick={() => handleComplete(taskId)}
                                        className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                                        title="Mark Complete"
                                    >
                                        <Icon name="Check" size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleTimerToggle(task)}
                                        className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                        title={active ? "Pause Timer" : "Start Timer"}
                                    >
                                        <Icon name={active ? "Pause" : "Play"} size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
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
