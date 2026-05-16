import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CheckSquare, Calendar, Kanban, Plus, MoreHorizontal, List } from 'lucide-react';
import { getData, addDataItem, logActivity, saveData, getContext, isDemoMode } from '../utils/storage';
import { mockData } from '../utils/mockData';
import './Tasks.css';

export function Tasks() {
  const { mode } = getContext();
  const isDemo = isDemoMode();
  
  const [persistentTasks, setPersistentTasks] = useState([]);

  useEffect(() => {
    const stored = getData('tasks') || [];
    setPersistentTasks(stored);
  }, []);

  const allTasks = [
    ...persistentTasks,
    ...(isDemo ? mockData.agenda.filter((a) => !persistentTasks.some((t) => t.id === a.id)) : []),
  ];
  
  const tasksByStatus = {
    overdue: [],
    today: allTasks.filter(t => !t.done),
    thisWeek: [],
    completed: allTasks.filter(t => t.done)
  };

  const handleToggle = (id) => {
    // Check if it's a persistent task or a demo task
    const isPersistent = persistentTasks.some(t => t.id === id);
    
    if (!isPersistent && !isDemo) return;

    let updatedPersistent = [...persistentTasks];
    const task = allTasks.find(t => t.id === id);
    if (!task) return;

    const nextStatus = !task.done;

    if (isPersistent) {
      updatedPersistent = persistentTasks.map(t => 
        t.id === id ? { ...t, done: nextStatus } : t
      );
      setPersistentTasks(updatedPersistent);
      saveData('tasks', updatedPersistent);
    } else {
      // For demo tasks, we'd just update local UI state if we wanted to support it, 
      // but the requirement is to prevent pollution. 
      // We'll skip saving demo task changes to storage.
      // For a better UX in demo mode, we could use a combined state, 
      // but let's stick to fixing the pollution first.
    }
    
    if (nextStatus) {
      logActivity('note', `Completed task: ${task.title}`);
    }
  };

  const TaskRow = ({ task, isOverdue }) => (
    <div className="task-row">
      <button 
        className={`task-checkbox ${task.done ? 'checked' : ''}`} 
        onClick={() => handleToggle(task.id)}
      >
        {task.done && <CheckSquare size={14} />}
      </button>
      <div className="task-content">
        <span className={`task-title ${task.done ? 'strikethrough' : ''}`}>{task.title}</span>
        <div className="task-meta">
          <span className={`task-due ${isOverdue ? 'text-danger' : 'text-secondary'}`}>Due {task.due}</span>
          <span className="meta-dot">•</span>
          <span className="task-client">{task.client}</span>
          {task.project && (
            <>
              <span className="meta-dot">•</span>
              <span className="task-project">{task.project}</span>
            </>
          )}
        </div>
      </div>
      <button className="icon-btn"><MoreHorizontal size={18} /></button>
    </div>
  );

  const handleAddTask = (e) => {
    e.preventDefault();
    const title = e.target.taskTitle.value;
    const newTask = addDataItem('tasks', { title, done: false });
    logActivity('note', `Scheduled task: ${title}`);
    
    setPersistentTasks(prev => [newTask, ...prev]);
    e.target.reset();
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div className="title-group">
          <h1 className="page-title">Tasks & Follow-ups</h1>
          <div className="view-toggles">
            <button className="view-btn active"><List size={16} /></button>
            <button className="view-btn"><Calendar size={16} /></button>
            <button className="view-btn"><Kanban size={16} /></button>
          </div>
        </div>
        <div className="filter-pills">
          <button className="filter-pill">All</button>
          <button className="filter-pill active">Today</button>
          <button className="filter-pill">This Week</button>
          <button className="filter-pill">Overdue</button>
          <button className="filter-pill">Completed</button>
        </div>
      </div>

      <form className="quick-add-bar" onSubmit={handleAddTask}>
        <Input name="taskTitle" placeholder="What needs to get done?" className="quick-input" required />
        <Button type="submit" variant="primary">Add Task</Button>
      </form>

      <div className="task-sections">
        {tasksByStatus.overdue.length > 0 && (
          <div className="task-section">
            <h3 className="section-title text-danger">Overdue <span className="count-badge red">{tasksByStatus.overdue.length}</span></h3>
            <div className="tasks-list">
              {tasksByStatus.overdue.map(t => <TaskRow key={t.id} task={t} isOverdue={true} />)}
            </div>
          </div>
        )}

        <div className="task-section">
          <h3 className="section-title text-accent">Active Agenda</h3>
          <div className="tasks-list">
            {tasksByStatus.today.length > 0 ? tasksByStatus.today.map(t => (
              <TaskRow key={t.id} task={{ ...t, due: 'Today', client: t.client || 'General', priority: 'neutral' }} />
            )) : (
              <p className="empty-msg">No active tasks. Add one above to get started.</p>
            )}
          </div>
        </div>

        {tasksByStatus.completed.length > 0 && (
          <div className="task-section">
            <h3 className="section-title text-success">Completed</h3>
            <div className="tasks-list">
              {tasksByStatus.completed.map(t => <TaskRow key={t.id} task={{ ...t, due: 'Done', client: t.client || 'General' }} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

