import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { eisenhowerTasks } from '../../../services/api';

const EisenhowerMatrix = ({ onBack }) => {
    // Quadrants: 
    // 1: Important & Urgent (Do First)
    // 2: Important, Not Urgent (Schedule)
    // 3: Not Important, Urgent (Delegate)
    // 4: Not Important, Not Urgent (Delete)

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [targetQuad, setTargetQuad] = useState(1);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await eisenhowerTasks.list();
            // Ensure data is an array, backend might return empty or null if no tasks
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const task = await eisenhowerTasks.create({
                text: newTask,
                quad: targetQuad
            });
            setTasks(prev => [task, ...prev]);
            setNewTask('');
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const moveTask = async (id, direction) => {
        const taskToMove = tasks.find(t => t._id === id);
        if (!taskToMove) return;

        let nextQuad = taskToMove.quad;
        // Simplified movement logic specific to 2x2 grid
        if (direction === 'right') nextQuad = taskToMove.quad === 1 ? 2 : (taskToMove.quad === 3 ? 4 : taskToMove.quad);
        if (direction === 'left') nextQuad = taskToMove.quad === 2 ? 1 : (taskToMove.quad === 4 ? 3 : taskToMove.quad);
        if (direction === 'down') nextQuad = taskToMove.quad === 1 ? 3 : (taskToMove.quad === 2 ? 4 : taskToMove.quad);
        if (direction === 'up') nextQuad = taskToMove.quad === 3 ? 1 : (taskToMove.quad === 4 ? 2 : taskToMove.quad);

        if (nextQuad === taskToMove.quad) return;

        try {
            // Optimistic update
            const updatedTasks = tasks.map(t => t._id === id ? { ...t, quad: nextQuad } : t);
            setTasks(updatedTasks);

            await eisenhowerTasks.update(id, { quad: nextQuad });
        } catch (error) {
            console.error('Failed to move task:', error);
            // Revert on failure
            loadTasks();
        }
    };

    const deleteTask = async (id) => {
        try {
            // Optimistic update
            setTasks(tasks.filter(t => t._id !== id));
            await eisenhowerTasks.delete(id);
        } catch (error) {
            console.error('Failed to delete task:', error);
            // Revert on failure
            loadTasks();
        }
    };

    const Quadrant = ({ title, desc, id, color, bg }) => (
        <div className={`p-4 rounded-xl border flex flex-col h-full ${bg} ${color}`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="text-xs opacity-75">{desc}</p>
                </div>
                <div className="bg-white/30 p-1.5 rounded-lg backdrop-blur-sm">
                    <span className="font-mono font-bold">Q{id}</span>
                </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-[200px] pr-2">
                {tasks.filter(t => t.quad === id).map(task => (
                    <div key={task._id} className="bg-white p-3 rounded-lg shadow-sm border border-black/5 group relative flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{task.text}</span>
                        <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Move controls simplified for demo */}
                            {id < 3 && <button onClick={() => moveTask(task._id, 'down')} className="text-gray-400 hover:text-gray-700"><Icon name="ArrowDown" size={14} /></button>}
                            {id > 2 && <button onClick={() => moveTask(task._id, 'up')} className="text-gray-400 hover:text-gray-700"><Icon name="ArrowUp" size={14} /></button>}
                            {(id === 1 || id === 3) && <button onClick={() => moveTask(task._id, 'right')} className="text-gray-400 hover:text-gray-700"><Icon name="ArrowRight" size={14} /></button>}
                            {(id === 2 || id === 4) && <button onClick={() => moveTask(task._id, 'left')} className="text-gray-400 hover:text-gray-700"><Icon name="ArrowLeft" size={14} /></button>}
                            <button onClick={() => deleteTask(task._id)} className="text-red-300 hover:text-red-500 ml-1"><Icon name="X" size={14} /></button>
                        </div>
                    </div>
                ))}
                {tasks.filter(t => t.quad === id).length === 0 && (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-black/10 rounded-lg min-h-[60px]">
                        <span className="text-xs font-medium opacity-40">Empty</span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300 h-full flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Icon name="ArrowLeft" size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Eisenhower Matrix</h1>
                        <p className="text-sm text-gray-500">Prioritize tasks by urgency and importance.</p>
                    </div>
                </div>
                {loading && <div className="text-sm text-gray-500"><Icon name="Loader" className="animate-spin" size={16} /> Saving...</div>}
            </div>

            {/* Quick Add */}
            <form onSubmit={addTask} className="flex gap-2 shrink-0">
                <div className="w-32">
                    <select
                        value={targetQuad}
                        onChange={(e) => setTargetQuad(parseInt(e.target.value))}
                        className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={1}>Do First</option>
                        <option value={2}>Schedule</option>
                        <option value={3}>Delegate</option>
                        <option value={4}>Delete</option>
                    </select>
                </div>
                <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1"
                />
                <Button type="submit" iconName="Plus">Add</Button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[500px]">
                <Quadrant
                    id={1}
                    title="Do First"
                    desc="Urgent & Important"
                    bg="bg-red-50"
                    color="text-red-800 border-red-100"
                />
                <Quadrant
                    id={2}
                    title="Schedule"
                    desc="Not Urgent, Important"
                    bg="bg-blue-50"
                    color="text-blue-800 border-blue-100"
                />
                <Quadrant
                    id={3}
                    title="Delegate"
                    desc="Urgent, Not Important"
                    bg="bg-amber-50"
                    color="text-amber-800 border-amber-100"
                />
                <Quadrant
                    id={4}
                    title="Delete"
                    desc="Neither"
                    bg="bg-gray-50"
                    color="text-gray-800 border-gray-100"
                />
            </div>
        </div>
    );
};

export default EisenhowerMatrix;
