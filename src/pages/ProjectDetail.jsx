import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { getContext, getData, saveData, updateDataItem, addDataItem } from '../utils/storage';
import { 
  ArrowLeft, FileText, CheckSquare, Mail, Sparkles, 
  ChevronDown, Clock, MessageSquare, DollarSign, 
  User, Calendar, ExternalLink, Send, Plus
} from 'lucide-react';
import './DetailPages.css';

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [vibe, setVibe] = useState('excellent');
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState('');

  const STAGES = [
    { id: 'Lead', label: 'Lead' },
    { id: 'Proposal Sent', label: 'Proposal Sent' },
    { id: 'Negotiation', label: 'Negotiation' },
    { id: 'Active', label: 'Active' },
    { id: 'Completed', label: 'Completed' },
  ];

  const VIBES = [
    { id: 'excellent', emoji: '🤩', label: 'Excellent' },
    { id: 'good', emoji: '😊', label: 'Good' },
    { id: 'neutral', emoji: '😐', label: 'Neutral' },
    { id: 'difficult', emoji: '😖', label: 'Difficult' },
    { id: 'risk', emoji: '🆘', label: 'Risk' }
  ];

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const projects = getData('projects') || [];
    const foundProject = projects.find(p => p.id === id);
    if (foundProject) {
      setProject(foundProject);
    } else {
      setNotFound(true);
    }

    const allActivities = getData('activities') || [];
    setActivities(allActivities.filter(a => a.projectId === id));

    const allTasks = getData('tasks') || [];
    setTasks(allTasks.filter(t => t.projectId === id));
  }, [id]);

  const handleUpdateProject = (updates) => {
    const updated = updateDataItem('projects', id, updates);
    if (updated) setProject(updated);
  };

  const handleAddActivity = (type, description) => {
    const newActivity = {
      type,
      description,
      projectId: id,
      company: project.client || 'General',
      time: 'Just now'
    };
    const added = addDataItem('activities', newActivity);
    setActivities([added, ...activities]);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    handleAddActivity('Note', noteText);
    setNoteText('');
  };

  const handleSendEmail = () => {
    handleAddActivity('Email', `Sent email to ${project.client || 'Client'}: "Project Update"`);
    alert('Email simulation: Sent!');
  };

  const handleAddTask = () => {
    const taskTitle = prompt('Enter task title:');
    if (!taskTitle) return;
    
    const newTask = {
      title: taskTitle,
      projectId: id,
      project: project.title || project.name || 'Project',
      status: 'To Do',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString()
    };
    const added = addDataItem('tasks', newTask);
    setTasks([added, ...tasks]);
    handleAddActivity('Task', `Created task: ${taskTitle}`);
  };

  const toggleTaskStatus = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const newStatus = task.status === 'Completed' ? 'To Do' : 'Completed';
    const updated = updateDataItem('tasks', taskId, { status: newStatus });
    setTasks(tasks.map(t => t.id === taskId ? updated : t));
    
    if (newStatus === 'Completed') {
      handleAddActivity('System', `Task completed: ${task.title}`);
    }
  };

  if (notFound) {
    return (
      <div className="p-xl" style={{textAlign: 'center', marginTop: 40}}>
        <h2>Project not found</h2>
        <p className="text-secondary" style={{marginBottom: 20}}>The project you are looking for does not exist or has been deleted.</p>
        <Link to="/pipeline"><Button variant="primary">Return to Pipeline</Button></Link>
      </div>
    );
  }

  if (!project) return <div className="p-xl">Loading project...</div>;

  return (
    <div className="detail-page">
      <div className="detail-left">
        {/* Header */}
        <div className="detail-header">
          <Link to="/pipeline" className="back-link"><ArrowLeft size={16} /> Pipeline</Link>
          <div className="header-main">
            {isEditing ? (
              <input 
                className="header-title-input"
                value={project.title || project.name}
                onChange={(e) => handleUpdateProject({ title: e.target.value })}
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <h1 className="header-title" onClick={() => setIsEditing(true)}>{project.title || project.name}</h1>
            )}
            
            <div className="stage-selector-wrapper">
              <Badge variant={project.stage === 'Active' ? 'green' : 'purple'} className="header-badge">
                {project.stage} <ChevronDown size={14} style={{marginLeft: 4}}/>
              </Badge>
              <select 
                className="stage-select-overlay"
                value={project.stage}
                onChange={(e) => handleUpdateProject({ stage: e.target.value })}
              >
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
          
          <div className="project-quick-info">
            <span>Client: <strong className="text-primary">{project.client || 'Acme Corp'}</strong></span>
            <span>Value: <strong className="text-primary">${(project.value || 0).toLocaleString()}</strong></span>
            <span>Created: <strong className="text-primary">{new Date(project.createdAt).toLocaleDateString()}</strong></span>
          </div>
          
          <div className="header-actions">
            <Button variant="secondary" size="sm" onClick={() => setActiveTab('timeline')}><FileText size={14} /> Note</Button>
            <Button variant="secondary" size="sm" onClick={handleAddTask}><CheckSquare size={14} /> Task</Button>
            <Button variant="secondary" size="sm" onClick={handleSendEmail}><Mail size={14} /> Email Client</Button>
            <Button variant="secondary" size="sm" className="text-accent"><Sparkles size={14} /> Sentinel Summary</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>Timeline</button>
          <button className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Tasks ({tasks.length})</button>
          <button className="tab">Invoices</button>
          <button className="tab">Files</button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <Card className="panel-card">
                <h4 className="panel-title">Project Details</h4>
                <div className="details-grid">
                  <div className="detail-field">
                    <label>Client</label>
                    <input 
                      value={project.client || ''} 
                      onChange={(e) => handleUpdateProject({ client: e.target.value })}
                      placeholder="Client name"
                    />
                  </div>
                  <div className="detail-field">
                    <label>Project Value ($)</label>
                    <input 
                      type="number"
                      value={project.value || 0} 
                      onChange={(e) => handleUpdateProject({ value: Number(e.target.value) })}
                    />
                  </div>
                  <div className="detail-field">
                    <label>Source</label>
                    <select value={project.source || 'Referral'} onChange={(e) => handleUpdateProject({ source: e.target.value })}>
                      <option>Referral</option>
                      <option>Direct</option>
                      <option>Website</option>
                      <option>Social Media</option>
                    </select>
                  </div>
                </div>
                <div className="detail-field full-width" style={{marginTop: 16}}>
                  <label>Description</label>
                  <textarea 
                    placeholder="Describe the project goals, scope, and deliverables..."
                    value={project.description || ''}
                    onChange={(e) => handleUpdateProject({ description: e.target.value })}
                  />
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="timeline-container">
              <div className="log-activity-bar">
                <textarea 
                  className="log-input" 
                  placeholder="Type a note here..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="log-actions" style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 12px 12px' }}>
                  <Button variant="primary" size="sm" onClick={handleAddNote}>
                    <Send size={14} /> Log Note
                  </Button>
                </div>
              </div>

              <div className="timeline-feed">
                {activities.length > 0 ? activities.map(activity => (
                  <div key={activity.id} className="timeline-entry">
                    <div className={`timeline-icon bg-${activity.type === 'Email' ? 'blue' : activity.type === 'Task' ? 'green' : activity.type === 'Note' ? 'amber' : 'gray'}`}>
                      {activity.type === 'Email' ? <Mail size={12} /> : activity.type === 'Task' ? <CheckSquare size={12} /> : <FileText size={12} />}
                    </div>
                    <div className="timeline-content">
                      <div className="entry-meta">
                        <strong>{activity.type}</strong>
                        <span className="entry-time">{activity.time} • {new Date(activity.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="entry-box">
                        <p className="entry-text">{activity.description}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="empty-state">No activity logged yet.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="tasks-tab">
              <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{fontSize: 16, margin: 0}}>Project Tasks</h3>
                <Button variant="secondary" size="sm" onClick={handleAddTask}><Plus size={14} /> Add Task</Button>
              </div>
              <div className="tasks-list" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tasks.length > 0 ? tasks.map(task => (
                  <Card key={task.id} className="task-item-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input 
                      type="checkbox" 
                      checked={task.status === 'Completed'} 
                      onChange={() => toggleTaskStatus(task.id)}
                      style={{ width: 18, height: 18, cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: 14, 
                        fontWeight: 500, 
                        textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                        color: task.status === 'Completed' ? 'var(--text-secondary)' : 'var(--text-primary)'
                      }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                         Due {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={task.status === 'Completed' ? 'gray' : 'blue'} size="sm">{task.status}</Badge>
                  </Card>
                )) : (
                  <div className="empty-state">No tasks assigned to this project.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="detail-right">
        {/* Info Panel */}
        <Card className="panel-card" style={{ display: 'flex', alignItems: 'center', gap: '12px'}}>
          <Avatar name={project.client || 'User'} size="md" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>{project.client || 'Client Contact'}</div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>contact@client.com</div>
          </div>
        </Card>

        <Card className="panel-card">
          <h4 className="panel-title">Financial Summary</h4>
          <div className="stats-grid">
            <div className="stat-item"><span className="stat-label">Total Value</span><span className="stat-val">${(project.value || 0).toLocaleString()}</span></div>
            <div className="stat-item"><span className="stat-label">Invoiced</span><span className="stat-val">$0</span></div>
            <div className="stat-item"><span className="stat-label">Paid</span><span className="stat-val" style={{color: '#10B981'}}>$0</span></div>
          </div>
          <div style={{ height: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, marginTop: 16, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '0%', backgroundColor: '#10B981', height: '100%' }}></div>
          </div>
        </Card>

        <Card className="panel-card sentiment-card">
          <h4 className="panel-title flex items-center gap-sm">
            <Sparkles size={14} className="text-accent" /> Sentinel: Project Vibe
          </h4>
          <p className="sov-info-p">How is the client feeling lately?</p>
          <div className="vibe-selector">
            {VIBES.map(v => (
              <button 
                key={v.id}
                className={`vibe-btn ${vibe === v.id ? 'active' : ''}`} 
                title={v.label}
                onClick={() => setVibe(v.id)}
              >
                {v.emoji}
              </button>
            ))}
          </div>
          <p className="vibe-insight">Sentinel: {vibe === 'risk' ? 'Alert: Urgent attention needed.' : 'Client relationship remains stable.'}</p>
        </Card>
      </div>
    </div>
  );
}
