import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.clearCookie('token');
    return res.redirect('/login');
  }
}

export function optionalAuth(req, res, next) {
  const token = req.cookies?.token;

  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      res.clearCookie('token');
    }
  }

  next();
}