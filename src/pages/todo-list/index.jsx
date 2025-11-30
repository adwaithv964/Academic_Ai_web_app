import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TodoList = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        const savedTasks = localStorage.getItem('todoTasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task = {
            id: Date.now(),
            text: newTask,
            completed: false
        };

        setTasks([...tasks, task]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
            <Header sidebarCollapsed={sidebarCollapsed} />
            <main className={`
                transition-academic-slow pt-16 pb-24 lg:pb-8
                ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}
            `}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Icon name="CheckSquare" size={24} className="text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">To-Do List</h1>
                                <p className="text-muted-foreground">Manage your academic tasks and goals.</p>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6 mb-8">
                            <form onSubmit={addTask} className="flex gap-4">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="Add a new task..."
                                    className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <Button type="submit" iconName="Plus">
                                    Add Task
                                </Button>
                            </form>
                        </div>

                        <div className="space-y-4">
                            {tasks.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No tasks yet. Add one to get started!
                                </div>
                            ) : (
                                tasks.map(task => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className={`
                                            flex items-center justify-between p-4 rounded-lg border border-border bg-card
                                            ${task.completed ? 'opacity-60' : ''}
                                        `}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <button
                                                onClick={() => toggleTask(task.id)}
                                                className={`
                                                    w-6 h-6 rounded border flex items-center justify-center transition-colors
                                                    ${task.completed
                                                        ? 'bg-primary border-primary text-primary-foreground'
                                                        : 'border-muted-foreground hover:border-primary'
                                                    }
                                                `}
                                            >
                                                {task.completed && <Icon name="Check" size={14} />}
                                            </button>
                                            <span className={`
                                                text-lg transition-all
                                                ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}
                                            `}>
                                                {task.text}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="text-muted-foreground hover:text-destructive transition-colors p-2"
                                        >
                                            <Icon name="Trash2" size={20} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default TodoList;
