import express from 'express';
import { json } from 'body-parser';
import { verifyToken } from './middleware/auth.js';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(json());

const prisma = new PrismaClient();

// Add CORS headers for Vercel / Mobile App future-proofing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ==========================================
// AUTHENTICATION
// ==========================================

app.post('/auth/login', (req, res) => {
  try {
    const { password } = req.body;
    const masterPassword = process.env.MASTER_PASSWORD || 'your-secure-password-1510';
    
    if (password !== masterPassword) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid Master Key' } });
    }
    
    // Issue token valid for 30 days
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'vertex-secret-key', { expiresIn: '30d' });
    res.json({ data: { token } });
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
});

// ==========================================
// PLACEHOLDER ROUTES (To be implemented per TRD-API)
// ==========================================

app.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const projectsCount = await prisma.project.count({ where: { status: 'In Progress' }});
    res.json({ data: { projectsCount } });
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
});

app.get('/system/verify', verifyToken, async (req, res) => {
  try {
    // Quick verification that the schema works
    const schemaVersion = await prisma.settings.findFirst();
    res.json({ data: { verified: true, schemaVersion } });
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Database schema verification failed', details: err.message } });
  }
});

export default app;
