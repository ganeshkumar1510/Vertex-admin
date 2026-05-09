import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Pipeline } from './pages/Pipeline';
import { Tasks } from './pages/Tasks';
import { Invoices } from './pages/Invoices';
import { Reports } from './pages/Reports';
import { ClientDetail } from './pages/ClientDetail';
import { ProjectDetail } from './pages/ProjectDetail';
import { Settings } from './pages/Settings';
import { Onboarding } from './pages/Onboarding';
import { getContext } from './utils/storage';

const Placeholder = ({ title }) => (
  <div style={{ padding: '40px' }}>
    <h2>{title}</h2>
    <p>This screen is under construction for the current module.</p>
  </div>
);

// ── Shared CRM Shell ─────────────────────────────────────────────────────────

function CRMShell() {
  const { mode, username } = getContext();
  const params = useParams();

  // Validate route matches current context
  useEffect(() => {
    if (params.username && params.username !== username && mode === 'normal') {
      // Logic for cross-user protection could go here
    }
  }, [params.username, username, mode]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:id" element={<ClientDetail />} />
        <Route path="projects" element={<Pipeline />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

// ── Root App ─────────────────────────────────────────────────────────────────

function App() {
  const { mode, username } = getContext();
  const hasUser = !!username;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={hasUser ? `/${username}/dashboard` : "/onboarding"} replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Specific Static Shells (Hidden from UI) */}
        <Route path="/admin-demo/*" element={<CRMShell />} />
        
        {/* Dynamic Private Shell */}
        <Route path="/:username/*" element={<CRMShell />} />

        {/* Redirects */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
