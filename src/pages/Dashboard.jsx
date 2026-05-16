import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { mockData } from '../utils/mockData';
import { Link } from 'react-router-dom';
import { getContext, getLocalUser, getData, addDataItem, logActivity, isDemoMode } from '../utils/storage';
import { Plus, Mail, Phone, FileText, ArrowRight, CheckCircle, Database } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import './Dashboard.css';

export function Dashboard() {
  const { mode, username } = getContext();
  const user = getLocalUser(username);
  const isDemo = isDemoMode();
  
  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'client' | 'project' | 'task'

  // Data State
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [invoices, setInvoices] = useState([]);

  React.useEffect(() => {
    const c = getData('clients') || [];
    const p = getData('projects') || [];
    const t = getData('tasks') || [];
    setClients(c);
    setProjects(p);
    setTasks(t);
    setActivities(getData('activities') || []);
    setInvoices(getData('invoices') || []);
  }, []);

  const sourceData = useMemo(() => {
    const revenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + (i.amount || 0), 0);
    const pending = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + (i.amount || 0), 0);

    const baseMetrics = isDemo ? mockData.metrics : {
      activeProjects: projects.length,
      revenueThisMonth: revenue,
      revenueGrowth: 0,
      pendingInvoices: invoices.filter(i => i.status !== 'Paid').length,
      pendingAmount: pending,
      tasksDueToday: tasks.filter(t => !t.done).length
    };

    return {
      metrics: baseMetrics,
      agenda: [...tasks.filter(t => !t.done), ...(isDemo ? mockData.agenda : [])].slice(0, 5),
      activities: [...activities, ...(isDemo ? mockData.activities : [])].slice(0, 5),
      pipelineSummary: isDemo ? mockData.pipelineSummary : [
        { stage: 'Lead', count: clients.filter(c => c.status === 'Lead').length, value: 0, color: 'purple' },
        { stage: 'Active', count: clients.filter(c => c.status === 'Active').length, value: 0, color: 'green' }
      ]
    };
  }, [isDemo, clients, projects, tasks, activities, invoices]);

  const [agenda, setAgenda] = useState([]);
  
  useEffect(() => {
    setAgenda(sourceData.agenda || []);
  }, [sourceData.agenda]);

  const toggleTask = (id) => {
    // Note: In a real app we'd update storage too
    setAgenda(prev => prev.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const hours = new Date().getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 17 ? 'Good afternoon' : 'Good evening';
  const displayName = user.name?.split(' ')[0] || 'Freelancer';

  // Modal Handlers
  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const handleCreateClient = (e) => {
    e.preventDefault();
    const name = e.target.clientName.value;
    const newClient = addDataItem('clients', { name, status: 'Lead' });
    logActivity('note', `Added new client: ${name}`, name);
    
    setClients(prev => [...prev, newClient]);
    setActivities(prev => [{ id: Date.now(), type: 'note', description: `Added new client: ${name}`, company: name, time: 'Just now' }, ...prev]);
    
    closeModal();
    e.target.reset();
  };

  // Empty State Helper
  const hasClients = isDemo || clients.length > 0;

  return (
    <div className="dashboard-page">
      {/* Top Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="greeting">{greeting}, {displayName}</h1>
          <p className="date-sub">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            {mode === 'test' && <span className="uat-tag">UAT Mode</span>}
          </p>
        </div>
        <div className="quick-actions">
          <Button variant="primary" className="pill" onClick={() => openModal('client')}><Plus size={16} /> New Client</Button>
          <Button variant="secondary" className="pill" onClick={() => openModal('project')}><Plus size={16} /> New Project</Button>
          <Button variant="secondary" className="pill" onClick={() => openModal('task')}><Plus size={16} /> Log Activity</Button>
        </div>
      </div>

      {!hasClients && (
        <div className="empty-state-banner">
          <Database size={24} />
          <div>
            <h3>Your workspace is clean</h3>
            <p>Start by adding your first client to see real-time metrics and pipelines.</p>
          </div>
          <Button variant="primary" size="sm">Add Client</Button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="metrics-grid">
        <Card className="metric-card">
          <p className="metric-label">Active Projects</p>
          <h2 className="metric-value">{sourceData.metrics.activeProjects}</h2>
          <span className="metric-trend positive">{isDemo ? 'On track' : 'Started'}</span>
        </Card>
        <Card className="metric-card">
          <p className="metric-label">Revenue This Month</p>
          <h2 className="metric-value">${sourceData.metrics.revenueThisMonth.toLocaleString()}</h2>
          <span className="metric-trend positive">{isDemo ? `↑ ${sourceData.metrics.revenueGrowth}%` : 'Goal set'}</span>
        </Card>
        <Card className="metric-card">
          <p className="metric-label">Pending Invoices</p>
          <h2 className="metric-value">${sourceData.metrics.pendingAmount.toLocaleString()}</h2>
          <span className="metric-trend neutral"> outstanding</span>
        </Card>
        <Card className="metric-card">
          <p className="metric-label">Tasks Due Today</p>
          <h2 className="metric-value">{sourceData.metrics.tasksDueToday}</h2>
          <span className="metric-trend neutral">Stay focused</span>
        </Card>
      </div>

      {/* Middle Section */}
      <div className="dashboard-two-col">
        <div className="col-left">
          <Card className="full-height">
            <CardHeader>Today's Agenda</CardHeader>
            <CardContent>
              <div className="agenda-list">
                {agenda.length > 0 ? agenda.map(task => (
                  <div key={task.id} className={`agenda-item ${task.done ? 'done' : ''}`}>
                    <button 
                      className={`check-circle ${task.done ? 'checked' : ''}`}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.done && <CheckCircle size={16} />}
                    </button>
                    <span className="task-time">{task.time || 'All day'}</span>
                    <div className="task-details">
                      <p className="task-title">{task.title}</p>
                      <p className="task-client">{task.client}</p>
                    </div>
                  </div>
                )) : (
                  <p className="empty-msg">No tasks scheduled for today.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-right">
          <Card className="full-height">
            <CardHeader>Recent Activity</CardHeader>
            <CardContent>
              <div className="activity-feed">
                {sourceData.activities.length > 0 ? sourceData.activities.map(act => (
                  <div key={act.id} className="activity-item">
                    <div className="activity-icon-wrapper">
                      {act.type === 'email' && <Mail size={16} className="icon-blue" />}
                      {act.type === 'call' && <Phone size={16} className="icon-green" />}
                      {act.type === 'note' && <FileText size={16} className="icon-amber" />}
                    </div>
                    <div className="activity-details">
                      <p className="act-desc">{act.description}</p>
                      <p className="act-meta">
                        {act.company && <span className="company-link">@{act.company}</span>} • {act.time}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="empty-msg">No recent activity to show.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - Pipeline */}
      <Card className="pipeline-mini-card">
        <div className="pipeline-header">
          <h3 className="card-title">Pipeline Summary</h3>
          <Link to="/pipeline" className="view-link">View Pipeline <ArrowRight size={16} /></Link>
        </div>
        <div className="pipeline-track">
          {sourceData.pipelineSummary.map((stage, idx) => (
            <React.Fragment key={stage.stage}>
              <div className="pipeline-node">
                <Badge variant={stage.color} className="stage-badge">
                  {stage.stage} ({stage.count})
                </Badge>
                <span className="stage-value">${stage.value.toLocaleString()}</span>
              </div>
              {idx < sourceData.pipelineSummary.length - 1 && (
                <div className="pipeline-edge"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Modals */}
      <Modal isOpen={activeModal === 'client'} onClose={closeModal} title="Add New Client">
        <form onSubmit={handleCreateClient} className="flex-col gap-md">
          <Input name="clientName" placeholder="Client or Company Name" autoFocus required />
          <Input name="clientEmail" placeholder="Email Address (Optional)" />
          <Button type="submit">Create Client</Button>
        </form>
      </Modal>

      <Modal isOpen={activeModal === 'project'} onClose={closeModal} title="Create New Project">
        <form onSubmit={(e) => {
          e.preventDefault();
          const pTitle = e.target.pTitle.value;
          const pVal = parseInt(e.target.pValue.value || '0');
          const newProject = addDataItem('projects', { title: pTitle, value: pVal, stage: 'Lead' });
          logActivity('note', `Initialized project: ${pTitle}`);
          
          setProjects(prev => [...prev, newProject]);
          setActivities(prev => [{ id: Date.now(), type: 'note', description: `Initialized project: ${pTitle}`, time: 'Just now' }, ...prev]);
          
          closeModal();
          e.target.reset();
        }} className="flex-col gap-md">
          <Input name="pTitle" placeholder="Project Title" autoFocus required />
          <Input name="pValue" placeholder="Estimated Value ($)" type="number" />
          <Button type="submit">Initialize Project</Button>
        </form>
      </Modal>

      <Modal isOpen={activeModal === 'task'} onClose={closeModal} title="Schedule Task / Activity">
        <form onSubmit={(e) => {
          e.preventDefault();
          const tTitle = e.target.tTitle.value;
          const newTask = addDataItem('tasks', { title: tTitle, done: false });
          logActivity('note', `Scheduled task: ${tTitle}`);
          
          setTasks(prev => [...prev, newTask]);
          setActivities(prev => [{ id: Date.now(), type: 'note', description: `Scheduled task: ${tTitle}`, time: 'Just now' }, ...prev]);
          
          closeModal();
          e.target.reset();
        }} className="flex-col gap-md">
          <Input name="tTitle" placeholder="What needs to be done?" autoFocus required />
          <Button type="submit">Add to Agenda</Button>
        </form>
      </Modal>
    </div>
  );
}
