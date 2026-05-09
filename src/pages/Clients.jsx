import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react';
import { getContext, getData, addDataItem, logActivity } from '../utils/storage';
import { mockData } from '../utils/mockData';
import { Modal } from '../components/ui/Modal';
import './Clients.css';

export function Clients() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { mode, username } = getContext();
  const isDemo = mode === 'demo';
  
  const savedClients = getData('clients') || [];
  const clients = [...savedClients, ...(isDemo ? mockData.clients : [])];
  
  const basePath = mode === 'normal' ? `/${username}` : `/${mode}`;

  const handleCreateClient = (e) => {
    e.preventDefault();
    const name = e.target.clientName.value;
    addDataItem('clients', { name, status: 'Lead' });
    logActivity('note', `Added new client: ${name}`, name);
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="clients-page">
      {/* Top Bar */}
      <div className="page-header">
        <div className="title-group">
          <h1 className="page-title">Clients <span className="count-badge">{clients.length}</span></h1>
          <div className="filter-pills">
            <button className="filter-pill active">All</button>
            <button className="filter-pill">Active</button>
            <button className="filter-pill">Past</button>
            <button className="filter-pill">Leads</button>
          </div>
        </div>
        
        <div className="actions-group">
          <Input 
            placeholder="Search clients..." 
            icon={<Search size={16} />} 
            className="search-input"
          />
          <Button variant="secondary" className="sort-btn">
            <Filter size={16} /> Sort
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Client
          </Button>
        </div>
      </div>

      {/* Main Table View */}
      <Card className="clients-table-card p-none">
        <div className="table-responsive">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Active Projects</th>
                <th>Total Revenue</th>
                <th>Last Activity</th>
                <th>Status</th>
                <th className="th-actions"></th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? clients.map(client => (
                <tr key={client.id} className="client-row cursor-pointer">
                  <td>
                    <div className="client-cell">
                      <Avatar name={client.name} size="md" />
                      <div className="client-info">
                        <Link to={`/clients/${client.id}`} style={{textDecoration: 'none'}}>
                          <span className="client-name">{client.name}</span>
                        </Link>
                        {client.company && <span className="client-company">{client.company}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="text-secondary">{client.email || '—'}</td>
                  <td>
                    <span className="number-badge">{client.projects || 0}</span>
                  </td>
                  <td>${(client.revenue || 0).toLocaleString()}</td>
                  <td>
                    <span className={`activity-text ${client.color || 'neutral'}`}>{client.lastActivity || 'Just added'}</span>
                  </td>
                  <td>
                    <div className="status-label">
                      <span className={`status-dot dot-${client.color || 'purple'}`}></span>
                      {client.status}
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button className="icon-btn"><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                    No clients found. Start by adding one to your pipeline.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Bottom */}
        <div className="pagination">
          <span className="pagination-text">
            {clients.length > 0 ? `Showing 1-${clients.length} of ${clients.length}` : 'No records'}
          </span>
          <div className="pagination-controls">
            <Button variant="secondary" size="sm" disabled>Previous</Button>
            <Button variant="secondary" size="sm" disabled>Next</Button>
          </div>
        </div>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Client">
        <form onSubmit={handleCreateClient} className="flex-col gap-md">
          <Input name="clientName" placeholder="Client or Company Name" autoFocus required />
          <Input name="clientEmail" placeholder="Email Address (Optional)" />
          <Button type="submit">Create Client</Button>
        </form>
      </Modal>
    </div>
  );
}
