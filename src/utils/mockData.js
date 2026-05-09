export const mockData = {
  metrics: {
    activeProjects: 8,
    revenueThisMonth: 12400,
    revenueGrowth: 18,
    pendingInvoices: 3,
    pendingAmount: 4200,
    tasksDueToday: 5
  },
  agenda: [
    { id: 1, time: '10:00 AM', title: 'Send revised mockups', client: 'Acme Design Co', priority: 'warning', done: false },
    { id: 2, time: '2:00 PM', title: 'Discovery call with Sarah', client: 'New Lead', priority: 'danger', done: false },
    { id: 3, time: '4:00 PM', title: 'Follow up on invoice', client: 'StartupXYZ', priority: 'success', done: false }
  ],
  activities: [
    { id: 1, type: 'email', description: 'Email opened by John', company: 'TechCorp', time: '2 hours ago' },
    { id: 2, type: 'call', description: 'Call logged with Lisa (12 min)', company: 'BrandCo', time: 'yesterday' },
    { id: 3, type: 'note', description: 'Note added to Website Redesign', company: 'Acme', time: 'yesterday' }
  ],
  pipelineSummary: [
    { stage: 'Lead', count: 3, value: 9000, color: 'purple' },
    { stage: 'Proposal', count: 2, value: 6500, color: 'amber' },
    { stage: 'Active', count: 8, value: 24000, color: 'green' },
    { stage: 'Complete', count: 12, value: 36000, color: 'gray' }
  ],
  clients: [
    { id: 1, name: 'Sarah Miller', company: 'Acme Corp', email: 'sarah@acme.com', projects: 2, revenue: 18500, lastActivity: '2 days ago', status: 'Active', color: 'green' },
    { id: 2, name: 'John Chen', company: '', email: 'john@email.com', projects: 0, revenue: 0, lastActivity: '1 week ago', status: 'Lead', color: 'amber' },
    { id: 3, name: 'Lisa Park', company: 'BrandCo', email: 'lisa@brandco.com', projects: 1, revenue: 8200, lastActivity: '3 days ago', status: 'Active', color: 'green' },
    { id: 4, name: 'Mike Torres', company: 'StartupXYZ', email: 'mike@sxyz.io', projects: 0, revenue: 24000, lastActivity: '2 months ago', status: 'Past', color: 'gray' }
  ],
  pipelineProjects: [
    { id: 1, name: 'Website for CaféNoir', client: 'Lisa Park', value: 3000, dateAdded: 'Apr 8', status: 'Active', stage: 'Lead' },
    { id: 2, name: 'Logo Design', client: 'Mike Torres', value: 1500, dateAdded: 'Apr 5', status: 'Needs follow-up', stage: 'Lead' },
    { id: 3, name: 'Brand Guidelines', client: 'John Chen', value: 3500, dateAdded: 'Apr 1', status: 'Active', stage: 'Proposal Sent' },
    { id: 4, name: 'E-commerce Setup', client: 'Sarah Miller', value: 6500, dateAdded: 'Mar 28', status: 'Active', stage: 'Negotiation' },
    { id: 5, name: 'Website Redesign', client: 'Acme Corp', value: 8000, dateAdded: 'Mar 15', status: 'Active', stage: 'Active' },
    { id: 6, name: 'Landing Page', client: 'StartupXYZ', value: 2400, dateAdded: 'Feb 10', status: 'Completed', stage: 'Completed' }
  ],
  invoices: [
    { id: 'INV-1024', client: 'Acme Corp', project: 'Website Redesign', amount: 4500, issued: 'Apr 12, 2026', due: 'Apr 27, 2026', status: 'Paid', statusColor: 'green' },
    { id: 'INV-1025', client: 'Lisa Park', project: 'Brand Guidelines', amount: 1200, issued: 'Apr 20, 2026', due: 'May 05, 2026', status: 'Pending', statusColor: 'amber' },
    { id: 'INV-1026', client: 'Sarah Miller', project: 'E-commerce Setup', amount: 3500, issued: 'Apr 05, 2026', due: 'Apr 20, 2026', status: 'Overdue', statusColor: 'danger' }
  ]
};
