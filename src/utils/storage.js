// ─────────────────────────────────────────────────────────────────────────────
// storage.js  —  Tesseract Vertex  —  Multi-context storage layer
// ─────────────────────────────────────────────────────────────────────────────

const KEYS = {
  ACTIVE_CONTEXT: 'vtx_active_context', // 'normal' | 'test' | 'demo'
  ACTIVE_USERNAME: 'vtx_active_username',
  USERS: 'vtx_users', // Store created human users
  THEME: 'vtx_theme',
};

// ── Context Management ───────────────────────────────────────────────────────

export function setContext(mode, username = '') {
  localStorage.setItem(KEYS.ACTIVE_CONTEXT, mode);
  if (username) localStorage.setItem(KEYS.ACTIVE_USERNAME, username);
}

export function getContext() {
  return {
    mode: localStorage.getItem(KEYS.ACTIVE_CONTEXT) || 'normal',
    username: localStorage.getItem(KEYS.ACTIVE_USERNAME) || ''
  };
}

export function getTheme() {
  return localStorage.getItem(KEYS.THEME) || 'quasar';
}

export function setTheme(theme) {
  localStorage.setItem(KEYS.THEME, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

// ── Validation ───────────────────────────────────────────────────────────────

/**
 * Validates a user's password/PIN for sensitive actions.
 * In a local-first app, this checks the stored user hash/string.
 */
export function validateUserCredentials(username, password) {
  // Universal bypass for testing/admin overrides
  const adminPin = import.meta.env.VITE_ADMIN_PIN || '1510';
  if (password === adminPin) return 'system_admin';

  const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '{}');
  const user = users[username];
  
  if (!user) return null;

  // Basic check for MVP
  if (user.password === password) return username;
  return null;
}

export function validateSystemCreds(username, pin) {
  return validateUserCredentials(username, pin);
}


// ── Data Fetching Helper ─────────────────────────────────────────────────────
// Prefixes keys based on the current mode to isolate data

function getPrefixedKey(key) {
  const { mode } = getContext();
  if (mode === 'test') return `test_${key}`;
  return `live_${key}`;
}

// ── User Management ──────────────────────────────────────────────────────────

export function getUser(username) {
  const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '{}');
  return users[username] || null;
}

export function createUser(userData) {
  const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '{}');
  const newUser = {
    ...userData,
    createdAt: new Date().toISOString()
  };
  users[userData.username] = newUser;
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return newUser;
}

export function hasAnyUser() {
  const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '{}');
  return Object.keys(users).length > 0;
}

// ── Generic Data Methods ─────────────────────────────────────────────────────

export function getData(key) {
  const { mode } = getContext();
  if (mode === 'demo') {
    // Demo mode uses static mockData (handled by components)
    return null; 
  }
  const fullKey = getPrefixedKey(key);
  const raw = localStorage.getItem(fullKey);
  return raw ? JSON.parse(raw) : [];
}

export function saveData(key, data) {
  const fullKey = getPrefixedKey(key);
  localStorage.setItem(fullKey, JSON.stringify(data));
}

export function addDataItem(key, item) {
  const items = getData(key) || [];
  const newItem = { id: crypto.randomUUID(), ...item, createdAt: new Date().toISOString() };
  items.unshift(newItem); // Unshift so newer items are first
  saveData(key, items);
  return newItem;
}

export function updateDataItem(key, id, updates) {
  const items = getData(key) || [];
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    saveData(key, items);
    return items[index];
  }
  return null;
}

export function addClient(clientData) {
  return addDataItem('clients', clientData);
}

export function logActivity(type, description, company = '') {
  return addDataItem('activities', {
    type,
    description,
    company,
    time: 'Just now'
  });
}

// ── Reset ────────────────────────────────────────────────────────────────────

export function clearTestContext() {
  const keys = Object.keys(localStorage);
  keys.forEach(k => {
    if (k.startsWith('test_')) localStorage.removeItem(k);
  });
  localStorage.removeItem(KEYS.ACTIVE_CONTEXT);
  localStorage.removeItem(KEYS.ACTIVE_USERNAME);
}

// ── Data Sovereignty (Module 1) ─────────────────────────────────────────────

export function exportStorageJSON() {
  const data = {};
  const prefixes = ['vtx_', 'live_', 'test_'];
  
  Object.keys(localStorage).forEach(key => {
    if (prefixes.some(p => key.startsWith(p))) {
      data[key] = localStorage.getItem(key);
    }
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tesseract_snapshot_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function importStorageJSON(jsonData) {
  try {
    const data = JSON.parse(jsonData);
    const prefixes = ['vtx_', 'live_', 'test_'];
    
    Object.keys(data).forEach(key => {
      if (prefixes.some(p => key.startsWith(p))) {
        localStorage.setItem(key, data[key]);
      }
    });
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}

export function wipeStorage() {
  localStorage.clear();
  console.log('VERTEX Instance Purged.');
}

export function logout() {
  localStorage.removeItem(KEYS.ACTIVE_CONTEXT);
  localStorage.removeItem(KEYS.ACTIVE_USERNAME);
}
