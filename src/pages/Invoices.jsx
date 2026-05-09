import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Plus, Send, Download } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { mockData } from '../utils/mockData';
import { getUser, getData, addDataItem, getContext, logActivity } from '../utils/storage';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import './Invoices.css';

export function Invoices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mode, username } = getContext();
  const isDemo = mode === 'demo';
  
  const savedInvoices = getData('invoices') || [];
  const invoices = [...savedInvoices, ...(isDemo ? mockData.invoices : [])];
  
  const user = getUser(username) || { name: 'Freelancer', email: 'guest@vertex.io', workspace: 'VERTEX Studio' };

  const totalOutstanding = invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (i.amount || 0), 0);

  const handleCreate = (e) => {
    e.preventDefault();
    const data = {
      id: `INV-${Math.floor(Math.random() * 1000) + 1000}`,
      client: e.target.client.value,
      project: e.target.project.value,
      amount: parseInt(e.target.amount.value),
      issued: new Date().toLocaleDateString(),
      due: 'Next Week',
      status: 'Pending',
      statusColor: 'amber'
    };
    addDataItem('invoices', data);
    logActivity('note', `Generated invoice: ${data.id} for ${data.client}`, data.client);
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleDownload = (invoice) => {
    generateInvoicePDF(invoice, user);
  };

  return (
    <div className="invoices-page">
      <div className="page-header">
        <h1 className="page-title">Invoices</h1>
        <div className="invoice-stats">
          <div className="stats-item">Total Outstanding: <span className="bold-value">${totalOutstanding.toLocaleString()}</span></div>
          <div className="stats-item text-danger">Overdue: <span className="bold-value text-danger">${totalOverdue.toLocaleString()}</span></div>
          <div className="stats-item">Paid This Month: <span className="bold-value">${totalPaid.toLocaleString()}</span></div>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Invoice
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate New Invoice">
        <form onSubmit={handleCreate} className="flex-col gap-md">
           <Input name="client" placeholder="Client Name" required />
           <Input name="project" placeholder="Project Title" required />
           <Input name="amount" placeholder="Amount ($)" type="number" required />
           <Button type="submit">Publish Invoice</Button>
        </form>
      </Modal>

      <Card className="p-none table-responsive">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Issued</th>
              <th>Due</th>
              <th>Status</th>
              <th className="th-actions"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? invoices.map(inv => (
              <tr key={inv.id} className={`client-row ${inv.status === 'Overdue' ? 'row-overdue' : ''}`}>
                <td className="mono">{inv.id}</td>
                <td className="font-medium">{inv.client}</td>
                <td className="text-secondary">{inv.project}</td>
                <td className="font-medium">${(inv.amount || 0).toLocaleString()}</td>
                <td className="text-secondary">{inv.issued}</td>
                <td className={inv.status === 'Overdue' ? 'text-danger font-medium' : 'text-secondary'}>{inv.due}</td>
                <td>
                  <Badge variant={inv.statusColor || 'neutral'}>{inv.status}</Badge>
                </td>
                <td className="actions-cell">
                  <div className="flex gap-xs">
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(inv)} title="Download PDF">
                      <Download size={14} />
                    </Button>
                    {inv.status === 'Overdue' && (
                      <Button variant="secondary" size="sm" className="reminder-btn">
                        <Send size={14} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No invoices found. Generate your first invoice to see it here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
