import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const KanbanColumn = ({ title, status, tasks, color, onStatusChange, onEdit, onDelete }) => {
    return (
        <div className="flex-1 min-w-[300px] flex flex-col bg-muted/20 rounded-xl border border-border/50 h-full">
            <div className={`p-4 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background/50 backdrop-blur-sm rounded-t-xl z-10`}>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="font-semibold text-foreground">{title}</span>
                    <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">{tasks.length}</span>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                    <Icon name="MoreHorizontal" size={16} />
                </button>
            </div>

            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                <AnimatePresence>
                    {tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            layoutId={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group bg-card p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer relative"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border ${task.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    }`}>
                                    {task.priority}
                                </span>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onEdit(task)} className="p-1 hover:bg-muted rounded">
                                        <Icon name="Edit2" size={14} className="text-muted-foreground" />
                                    </button>
                                    <button onClick={() => onDelete(task.id)} className="p-1 hover:bg-destructive/10 rounded">
                                        <Icon name="Trash2" size={14} className="text-destructive" />
                                    </button>
                                </div>
                            </div>

                            <h4 className="font-medium text-foreground mb-1">{task.title}</h4>
                            {task.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{task.description}</p>}

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    {task.dueDate && <><Icon name="Calendar" size={12} /> {task.dueDate}</>}
                                </span>

                                {/* Simple Move Actions */}
                                <div className="flex gap-1">
                                    {status !== 'todo' && (
                                        <button onClick={() => onStatusChange(task.id, 'todo')} className="p-1 hover:bg-muted rounded text-xs" title="Move to Todo">
                                            <Icon name="ArrowLeft" size={14} />
                                        </button>
                                    )}
                                    {status !== 'done' && (
                                        <button onClick={() => onStatusChange(task.id, status === 'todo' ? 'in_progress' : 'done')} className="p-1 hover:bg-muted rounded text-xs" title="Move Forward">
                                            <Icon name="ArrowRight" size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {tasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-xl">
                        No tasks
                    </div>
                )}
            </div>
        </div>
    );
};

const KanbanView = ({ tasks, onStatusChange, onEdit, onDelete }) => {
    return (
        <div className="flex gap-4 h-full overflow-x-auto pb-4">
            <KanbanColumn
                title="To Do"
                status="todo"
                color="bg-slate-500"
                tasks={tasks.filter(t => t.status === 'todo')}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
            />
            <KanbanColumn
                title="In Progress"
                status="in_progress"
                color="bg-blue-500"
                tasks={tasks.filter(t => t.status === 'in_progress')}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
            />
            <KanbanColumn
                title="Done"
                status="done"
                color="bg-emerald-500"
                tasks={tasks.filter(t => t.status === 'done')}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
};

export default KanbanView;
