/**
 * Runtime verification for storage demo merge (writes NDJSON to debug log).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logPath = path.join(__dirname, '..', '.cursor', 'debug-184353.log');

const store = {};
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => {
    store[k] = String(v);
  },
  removeItem: (k) => {
    delete store[k];
  },
};

function log(location, message, data, hypothesisId) {
  const line =
    JSON.stringify({
      sessionId: '184353',
      runId: 'post-fix-script',
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }) + '\n';
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, line);
}

// Bootstrap demo context (mirrors InitialSetup)
store.vtx_active_context = 'demo';
store['vertex-storage'] = JSON.stringify({ state: { isDemoEnvironment: true } });

const { getData, addDataItem, isDemoMode } = await import('../src/utils/storage.js');

const clientsBefore = getData('clients');
log('verify-data-sync.mjs', 'demo clients merged', { count: clientsBefore.length, isDemo: isDemoMode() }, 'A');

addDataItem('clients', { name: 'SyncTest', status: 'Active' });
const clientsAfter = getData('clients');
const hasSyncTest = clientsAfter.some((c) => c.name === 'SyncTest');

log(
  'verify-data-sync.mjs',
  'SyncTest visible after add',
  { count: clientsAfter.length, hasSyncTest },
  'B'
);

const projects = getData('projects');
const stages = projects.map((p) => p.stage);
log('verify-data-sync.mjs', 'project stages', { count: projects.length, stages }, 'E');

console.log('Verification complete. clients:', clientsAfter.length, 'hasSyncTest:', hasSyncTest);
