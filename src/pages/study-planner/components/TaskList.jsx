import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TaskList = ({ tasks, onTaskToggle, onTaskAdd, onTaskEdit, onTaskDelete }) => {
  const [expandedSections, setExpandedSections] = useState({
    pending: true,
    completed: false
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    priority: 'medium',
    dueDate: '',
    type: 'assignment'
  });

  const pendingTasks = tasks?.filter(task => !task?.completed);
  const completedTasks = tasks?.filter(task => task?.completed);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleAddTask = () => {
    if (newTask?.title?.trim()) {
      onTaskAdd({
        ...newTask,
        id: Date.now(),
        completed: false,
        createdAt: new Date()?.toISOString()
      });
      setNewTask({
        title: '',
        subject: '',
        priority: 'medium',
        dueDate: '',
        type: 'assignment'
      });
      setShowAddForm(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-error bg-error/10 border-error/20',
      medium: 'text-warning bg-warning/10 border-warning/20',
      low: 'text-success bg-success/10 border-success/20'
    };
    return colors?.[priority] || colors?.medium;
  };

  const getTypeIcon = (type) => {
    const icons = {
      assignment: 'FileText',
      exam: 'BookOpen',
      project: 'Folder',
      reading: 'Book',
      lab: 'Flask'
    };
    return icons?.[type] || 'FileText';
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date?.getTime() - now?.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays > 0) return `Due in ${diffDays} days`;
    return `Overdue by ${Math.abs(diffDays)} days`;
  };

  const TaskItem = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-3 bg-card border border-border rounded-lg hover:shadow-sm transition-academic"
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task?.completed}
          onChange={(e) => onTaskToggle(task?.id, e?.target?.checked)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon name={getTypeIcon(task?.type)} size={16} className="text-muted-foreground" />
            <h4 className={`font-medium ${task?.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task?.title}
            </h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task?.priority)}`}>
              {task?.priority}
            </span>
          </div>
          
          {task?.subject && (
            <p className="text-sm text-muted-foreground mb-1">{task?.subject}</p>
          )}
          
          {task?.dueDate && (
            <p className={`text-xs ${
              new Date(task.dueDate) < new Date() && !task?.completed 
                ? 'text-error' :'text-muted-foreground'
            }`}>
              {formatDueDate(task?.dueDate)}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTaskEdit(task)}
            className="h-8 w-8"
          >
            <Icon name="Edit2" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTaskDelete(task?.id)}
            className="h-8 w-8 text-error hover:text-error"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      {/* Add Task Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Tasks & Assignments</h3>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Add Task
        </Button>
      </div>
      {/* Add Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Task title..."
                value={newTask?.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e?.target?.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newTask?.subject}
                  onChange={(e) => setNewTask(prev => ({ ...prev, subject: e?.target?.value }))}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
                
                <select
                  value={newTask?.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e?.target?.value }))}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newTask?.type}
                  onChange={(e) => setNewTask(prev => ({ ...prev, type: e?.target?.value }))}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                  <option value="project">Project</option>
                  <option value="reading">Reading</option>
                  <option value="lab">Lab Work</option>
                </select>
                
                <input
                  type="date"
                  value={newTask?.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e?.target?.value }))}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={handleAddTask}>
                  Add Task
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Pending Tasks */}
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => toggleSection('pending')}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-academic"
        >
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="font-medium text-foreground">Pending Tasks</span>
            <span className="px-2 py-1 text-xs bg-warning/10 text-warning rounded-full">
              {pendingTasks?.length}
            </span>
          </div>
          <Icon 
            name={expandedSections?.pending ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
            className="text-muted-foreground" 
          />
        </button>
        
        <AnimatePresence>
          {expandedSections?.pending && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border"
            >
              <div className="p-4 space-y-3">
                {pendingTasks?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="CheckCircle" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No pending tasks</p>
                  </div>
                ) : (
                  pendingTasks?.map((task) => (
                    <TaskItem key={task?.id} task={task} />
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Completed Tasks */}
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => toggleSection('completed')}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-academic"
        >
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="font-medium text-foreground">Completed Tasks</span>
            <span className="px-2 py-1 text-xs bg-success/10 text-success rounded-full">
              {completedTasks?.length}
            </span>
          </div>
          <Icon 
            name={expandedSections?.completed ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
            className="text-muted-foreground" 
          />
        </button>
        
        <AnimatePresence>
          {expandedSections?.completed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border"
            >
              <div className="p-4 space-y-3">
                {completedTasks?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Clock" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No completed tasks yet</p>
                  </div>
                ) : (
                  completedTasks?.map((task) => (
                    <TaskItem key={task?.id} task={task} />
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;