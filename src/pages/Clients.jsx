import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import './Clients.css';

export function Clients() {
  const { authToken } = useAppStore();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Form State
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/clients', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      // Ensure we only set array data
      setClients(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [authToken]);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to create client');
      
      setFormData({ name: '', email: '', company: '' });
      setIsModalOpen(false);
      fetchClients(); // Re-fetch list
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="clients-page">
      {/* Top Bar */}
      <div className="page-header">
        <div className="title-group">
          <h1 className="page-title">Clients <span className="count-badge">{clients.length}</span></h1>
          <div className="filter-pills">
            <button className="filter-pill active">All</button>
            <button className="filter-pill">Active</button>
            <button className="filter-pill">Archived</button>
          </div>
        </div>
        
        <div className="actions-group">
          <Input 
            placeholder="Search clients..." 
            icon={<Search size={16} />} 
            className="search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Button variant="secondary" className="sort-btn">
            <Filter size={16} /> Sort
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Client
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-md bg-red-500/10 border border-red-500/20 text-red-500 rounded mb-md flex justify-between items-center">
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={fetchClients}>Retry</Button>
        </div>
      )}

      {/* Main Table View */}
      <Card className="clients-table-card p-none">
        <div className="table-responsive">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Active Projects</th>
                <th>Status</th>
                <th className="th-actions"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Simple skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5">
                      <div className="h-12 bg-border-color animate-pulse rounded my-1 opacity-50"></div>
                    </td>
                  </tr>
                ))
              ) : filteredClients.length > 0 ? (
                filteredClients.map(client => (
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
                      <span className="number-badge">{client._count?.projects || 0}</span>
                    </td>
                    <td>
                      <div className="status-label">
                        <span className={`status-dot ${client.status === 'Active' ? 'dot-green' : 'dot-neutral'}`}></span>
                        {client.status}
                      </div>
                    </td>
                    <td className="actions-cell">
                      <button className="icon-btn"><MoreHorizontal size={18} /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                    {searchQuery ? 'No clients match your search.' : 'No clients found. Start by adding one.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Bottom */}
        <div className="pagination">
          <span className="pagination-text">
            {filteredClients.length > 0 ? `Showing 1-${filteredClients.length} of ${filteredClients.length}` : 'No records'}
          </span>
          <div className="pagination-controls">
            <Button variant="secondary" size="sm" disabled>Previous</Button>
            <Button variant="secondary" size="sm" disabled>Next</Button>
          </div>
        </div>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Client">
        <form onSubmit={handleCreateClient} className="flex flex-col gap-4">
          <Input 
            name="name" 
            placeholder="Client Name *" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            autoFocus 
            required 
          />
          <Input 
            name="company" 
            placeholder="Company Name (Optional)" 
            value={formData.company}
            onChange={e => setFormData({...formData, company: e.target.value})}
          />
          <Input 
            name="email" 
            type="email"
            placeholder="Email Address (Optional)" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <Button type="submit" className="mt-4">Create Client</Button>
        </form>
      </Modal>
    </div>
  );
}
