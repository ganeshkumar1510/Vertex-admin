/** Read env vars with optional surrounding quotes stripped (common .env typo). */
export function envValue(key, fallback = '') {
  const raw = process.env[key];
  if (raw == null || raw === '') return fallback;
  return raw.replace(/^["']+|["']+$/g, '').trim();
}

const MASTER_PASSWORD_PLACEHOLDERS = new Set([
  'your-secure-password-1510',
  'change-me',
]);

/** Master key used for /api/auth/login — matches VITE_ADMIN_PIN when MASTER_PASSWORD is unset or still a template default. */
export function getMasterPassword() {
  const adminPin = envValue('VITE_ADMIN_PIN') || '1510';
  const master = envValue('MASTER_PASSWORD');
  if (!master || MASTER_PASSWORD_PLACEHOLDERS.has(master)) {
    return adminPin;
  }
  return master;
}

export function getJwtSecret() {
  return envValue('JWT_SECRET') || 'vertex-secret-key';
}
