import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { X, Sparkles, Send, FileText, CheckCircle } from 'lucide-react';
import './AIPanel.css';

export function AIPanel({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <>
      <div className="backdrop" onClick={onClose}></div>
      <div className={`ai-panel ${isOpen ? 'open' : ''}`}>
        <div className="ai-header">
          <div className="ai-title"><Sparkles size={18} className="text-accent" /> Sentinel</div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="ai-chat-area">
          <div className="chat-bubble ai">
            Hi Alex! I noticed you have an overdue invoice for <strong>StartupXYZ</strong>. Would you like me to draft a gentle reminder email?
          </div>
          
          <div className="chat-bubble user">
            Yes, please draft that for me.
          </div>

          <div className="chat-bubble ai">
            <p>Here's a draft you can review:</p>
            <div className="draft-card">
              <p className="draft-text" style={{fontSize: 13, marginBottom: 12}}>
                Hi Mike,<br/><br/>I hope you're having a great week! I'm writing to follow up on invoice #INV-1042 for the App Design project, which was due on Apr 1...
              </p>
              <div className="draft-actions">
                <Button variant="primary" size="sm">Send via Email</Button>
                <Button variant="secondary" size="sm">Edit</Button>
              </div>
            </div>
          </div>

        </div>

        <div className="ai-suggestions">
          <p className="suggestions-title">How Sentinel can help:</p>
          <button className="suggestion-pill"><FileText size={12}/> Draft weekly update for Acme project</button>
          <button className="suggestion-pill"><CheckCircle size={12}/> Analyze my project health</button>
        </div>

        <div className="ai-input-area">
          <input 
            type="text" 
            placeholder="Ask AI to draft emails, summarize projects..." 
            className="ai-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="ai-send-btn"><Send size={16} /></button>
        </div>
      </div>
    </>
  );
}
