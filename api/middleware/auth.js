import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Access denied. Missing token.' } });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'vertex-secret-key');
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token.' } });
  }
};
