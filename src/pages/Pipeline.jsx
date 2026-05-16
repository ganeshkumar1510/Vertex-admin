import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, List, Kanban, Columns, MoreVertical } from 'lucide-react';
import { getContext, getData, saveData } from '../utils/storage';
import './Pipeline.css';

const STAGES = [
  { id: 'Lead', label: 'Lead', color: 'purple' },
  { id: 'Proposal Sent', label: 'Proposal Sent', color: 'amber' },
  { id: 'Negotiation', label: 'Negotiation', color: 'blue' },
  { id: 'Active', label: 'Active', color: 'green' },
  { id: 'Completed', label: 'Completed', color: 'gray' },
];

export function Pipeline() {
  const navigate = useNavigate();
  const { mode } = getContext();
  const [projects, setProjects] = React.useState(() => getData('projects') || []);

  const reloadProjects = React.useCallback(() => {
    const list = getData('projects') || [];
    setProjects(list);
  }, [mode]);

  React.useEffect(() => {
    reloadProjects();
    const onDataChange = (e) => {
      if (!e.detail?.key || e.detail.key === 'projects') reloadProjects();
    };
    window.addEventListener('vertex-data-change', onDataChange);
    return () => window.removeEventListener('vertex-data-change', onDataChange);
  }, [reloadProjects]);

  const getProjectsByStage = (stageId) => projects.filter(p => p.stage === stageId);
  const getStageTotal = (stageId) => getProjectsByStage(stageId).reduce((sum, p) => sum + (p.value || 0), 0);
  const grandTotal = projects.reduce((sum, p) => sum + (p.value || 0), 0);

  const handleStageChange = (e, projectId) => {
    e.stopPropagation();
    const newStage = e.target.value;
    const updated = projects.map(p => p.id === projectId ? { ...p, stage: newStage } : p);
    setProjects(updated);
    saveData('projects', updated);
  };

  return (
    <div className="pipeline-page">
      {/* Header */}
      <div className="page-header">
        <div className="title-group">
          <h1 className="page-title">Pipeline</h1>
          <div className="view-toggles">
            <button className="view-btn active"><Kanban size={16} /></button>
            <button className="view-btn"><List size={16} /></button>
            <button className="view-btn"><Columns size={16} /></button>
          </div>
        </div>
        
        <div className="actions-group">
          <div className="pipeline-stats">
            <span className="text-secondary">Expected Revenue:</span>
            <span className="bold-value">${grandTotal.toLocaleString()}</span>
          </div>
          <Button variant="primary">
            <Plus size={16} /> New Project
          </Button>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="kanban-scroll-area">
        <div className="kanban-board">
          {STAGES.map(stage => {
            const stageProjects = getProjectsByStage(stage.id);
            return (
              <div key={stage.id} className="kanban-column">
                <div className={`column-header border-${stage.color}`}>
                  <h3 className="column-title">{stage.label}</h3>
                  <div className="column-meta">
                    <span>{stageProjects.length} projects</span>
                    <span>•</span>
                    <span>${getStageTotal(stage.id).toLocaleString()}</span>
                  </div>
                </div>

                <div className="kanban-cards">
                  {stageProjects.length > 0 ? (
                    stageProjects.map(project => (
                      <Card 
                        key={project.id} 
                        className={`kanban-card border-left-${stage.color}`}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <div className="card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 className="project-name">{project.title || project.name}</h4>
                          <select 
                            className="stage-select-mini"
                            value={project.stage}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStageChange(e, project.id)}
                          >
                            {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                          </select>
                        </div>
                        <p className="project-client">{project.client || 'General'}</p>
                        <p className="project-value">${(project.value || 0).toLocaleString()}</p>
                        
                        <div className="card-footer">
                          <span className="date-added">Added {new Date(project.createdAt).toLocaleDateString()}</span>
                          <div className="status-indicator">
                            <span className={`status-dot dot-${project.status === 'Active' ? 'green' : project.status === 'Completed' ? 'gray' : 'amber'}`}></span>
                            {project.status || stage.label}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="empty-column">
                      Drag a project here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
