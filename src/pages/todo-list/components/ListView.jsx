import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ListView = ({ tasks, onStatusChange, onEdit, onDelete }) => {
    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'todo': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
            case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'done': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
            default: return 'bg-muted';
        }
    };

    return (
        <div className="space-y-2">
            <AnimatePresence>
                {tasks.map((task) => (
                    <motion.div
                        key={task.id}
                        layoutId={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="group flex p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all items-center gap-4"
                    >
                        {/* Status Checkbox-like button */}
                        <button
                            onClick={() => onStatusChange(task.id, task.status === 'done' ? 'todo' : 'done')}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'done' ? 'bg-success border-success text-white' : 'border-muted-foreground hover:border-primary'}`}
                        >
                            {task.status === 'done' && <Icon name="Check" size={14} />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-medium text-foreground truncate ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h4>
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {task.dueDate && (
                                    <span className="flex items-center gap-1">
                                        <Icon name="Calendar" size={12} />
                                        {task.dueDate}
                                    </span>
                                )}
                                <span className={`px-2 py-0.5 rounded-full ${getStatusColor(task.status)} uppercase text-[10px] font-semibold tracking-wide`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                                {task.description && <span className="truncate max-w-[200px] hidden sm:inline">{task.description}</span>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" onClick={() => onEdit(task)} iconName="Edit2" />
                            <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)} className="text-destructive hover:text-destructive" iconName="Trash2" />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            {tasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No tasks found. Create one to get started!
                </div>
            )}
        </div>
    );
};

export default ListView;
