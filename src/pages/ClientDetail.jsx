import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, Mail, Phone, FileText, CheckSquare, Calendar, Tag, Plus } from 'lucide-react';
import './DetailPages.css';

export function ClientDetail() {
  return (
    <div className="detail-page">
      <div className="detail-left">
        {/* Header */}
        <div className="detail-header">
          <a href="/clients" className="back-link"><ArrowLeft size={16} /> Clients</a>
          <div className="header-main">
            <h1 className="header-title">Sarah Miller</h1>
            <Badge variant="green" className="header-badge">Active Client</Badge>
          </div>
          <p className="header-sub">VP of Marketing at <span className="text-accent">Acme Corp</span></p>
          
          <div className="header-actions">
            <Button variant="secondary" size="sm"><Mail size={14} /> Email</Button>
            <Button variant="secondary" size="sm"><Phone size={14} /> Call</Button>
            <Button variant="secondary" size="sm"><FileText size={14} /> Note</Button>
            <Button variant="secondary" size="sm"><CheckSquare size={14} /> Task</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <button className="tab active">Timeline</button>
          <button className="tab">Projects</button>
          <button className="tab">Invoices</button>
          <button className="tab">Files</button>
          <button className="tab">Notes</button>
        </div>

        {/* Timeline View */}
        <div className="timeline-container">
          <div className="log-activity-bar">
            <input type="text" placeholder="Write a note, log a call, or record what happened..." className="log-input" />
            <div className="log-type-pills">
              <button className="type-pill">Note</button>
              <button className="type-pill">Call</button>
              <button className="type-pill">Email</button>
              <button className="type-pill">Meeting</button>
            </div>
          </div>

          <div className="timeline-feed">
            {/* Entry 1 */}
            <div className="timeline-entry">
              <div className="timeline-icon bg-blue"><Mail size={14} /></div>
              <div className="timeline-content">
                <p className="entry-meta"><strong>Email sent:</strong> "Follow-up on website redesign" <span className="entry-time">Apr 10</span></p>
                <div className="entry-box bg-light">
                  <p className="entry-text text-secondary">Opened: Yes (2x) | Clicked: Yes</p>
                </div>
              </div>
            </div>

            {/* Entry 2 */}
            <div className="timeline-entry">
              <div className="timeline-icon bg-green"><Phone size={14} /></div>
              <div className="timeline-content">
                <p className="entry-meta"><strong>Call</strong> (outbound, 12 min) <span className="entry-time">Apr 8</span></p>
                <div className="entry-box">
                  <p className="entry-text">"Discussed timeline for phase 2. She wants to kick off May 1st. Budget is $8K for the next phase. Decision by end of week."</p>
                </div>
              </div>
            </div>

            {/* Entry 3 */}
            <div className="timeline-entry">
              <div className="timeline-icon bg-gray"><CheckSquare size={14} /></div>
              <div className="timeline-content">
                <p className="entry-meta">Task completed: <strong>Send revised proposal</strong> <span className="entry-time">Apr 5</span></p>
              </div>
            </div>

            {/* Entry 4 */}
            <div className="timeline-entry">
              <div className="timeline-icon bg-purple"><Calendar size={14} /></div>
              <div className="timeline-content">
                <p className="entry-meta"><strong>Meeting:</strong> Project Kickoff (45 min) <span className="entry-time">Apr 3</span></p>
                <div className="entry-box bg-light">
                  <p className="entry-text text-secondary">Attendees: Sarah Miller, Alex</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-right">
        {/* Info Panel */}
        <Card className="panel-card">
          <div className="panel-profile">
            <Avatar name="Sarah Miller" size="lg" />
            <div className="profile-info">
              <h3>Sarah Miller</h3>
              <p>Acme Corp • VP of Marketing</p>
            </div>
          </div>
          <div className="panel-details">
            <div className="detail-row"><Mail size={14} /> <span>sarah@acme.com</span></div>
            <div className="detail-row"><Phone size={14} /> <span>(555) 123-4567</span></div>
            <div className="detail-row"><Tag size={14} /> 
              <div className="tag-group">
                <span className="mini-tag">Design</span>
                <span className="mini-tag">VIP</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="panel-card">
          <h4 className="panel-title">Quick Stats</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Lifetime Revenue</span>
              <span className="stat-val">$18,500</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Projects</span>
              <span className="stat-val">2</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Project Value</span>
              <span className="stat-val">$6,166</span>
            </div>
          </div>
        </Card>

        <Card className="panel-card bg-amber-light">
          <h4 className="panel-title">Pinned Note</h4>
          <p className="pinned-text">Prefers email over calls. Always CC her assistant Mark (mark@acme.com).</p>
        </Card>
      </div>
    </div>
  );
}
