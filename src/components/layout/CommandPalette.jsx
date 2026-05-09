import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Folder, Users, FileText, CheckSquare, X, Settings as SettingsIcon } from 'lucide-react';
import { getData, getContext } from '../../utils/storage';
import './CommandPalette.css';

const QUICK_ACTIONS = [
  { id: 'new-client', label: 'Add new client', icon: <Users size={16} />, path: '/clients?action=new' },
  { id: 'new-project', label: 'Create project', icon: <Folder size={16} />, path: '/projects?action=new' },
  { id: 'new-invoice', label: 'Draft invoice', icon: <FileText size={16} />, path: '/invoices?action=new' },
  { id: 'new-task', label: 'Add task', icon: <CheckSquare size={16} />, path: '/tasks?action=new' },
  { id: 'settings', label: 'Go to Settings', icon: <SettingsIcon size={16} />, path: '/settings' },
];

export function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const { mode, username } = getContext();
  const basePath = mode === 'normal' ? `/${username}` : `/${mode}`;
  
  // Data Fetching
  const clients = getData('clients') || [];
  const projects = getData('projects') || [];

  const filteredResults = query ? [
    ...clients.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).map(c => ({
      id: `client-${c.id}`,
      label: c.name,
      sub: 'Client',
      icon: <Users size={16} />,
      path: `${basePath}/clients/${c.id}`
    })),
    ...projects.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).map(p => ({
      id: `project-${p.id}`,
      label: p.title,
      sub: 'Project',
      icon: <Folder size={16} />,
      path: `${basePath}/projects/${p.id}`
    }))
  ] : QUICK_ACTIONS.map(action => ({...action, path: `${basePath}${action.path}`}));

  const totalResults = filteredResults.length;

  // Key Handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalResults);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalResults) % totalResults);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleAction(filteredResults[selectedIndex].path);
        }
      }
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, totalResults, selectedIndex, filteredResults]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const handleAction = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <>
      <div className="cmd-backdrop" onClick={onClose}></div>
      <div className="cmd-palette">
        <div className="cmd-input-wrap">
          <Search size={20} className="cmd-icon" />
          <input 
            autoFocus
            type="text" 
            className="cmd-input" 
            placeholder="Search clients, projects, or type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="cmd-esc-tag">ESC</div>
        </div>

        <div className="cmd-results">
          <div className="cmd-group">
            <div className="cmd-group-title">{query ? 'Search Results' : 'Quick Actions'}</div>
            {filteredResults.length > 0 ? filteredResults.map((item, idx) => (
              <button 
                key={item.id} 
                className={`cmd-item ${idx === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleAction(item.path)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="cmd-item-icon">{item.icon}</div>
                <div className="cmd-item-info">
                  <span className="cmd-item-label">{item.label}</span>
                  {item.sub && <span className="cmd-item-sub">{item.sub}</span>}
                </div>
                {idx === selectedIndex && <div className="cmd-enter-tag">↵</div>}
              </button>
            )) : (
              <div className="cmd-empty">No results found for "{query}"</div>
            )}
          </div>
        </div>

        <div className="cmd-footer">
          Navigate with <kbd>↑</kbd> <kbd>↓</kbd> • Select with <kbd>Enter</kbd>
        </div>
      </div>
    </>
  );
}
