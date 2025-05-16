import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import type { RowDataPacket } from 'mysql2';

interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    active?: boolean;
  };
  headers: Record<string, string | string[] | undefined>;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = typeof authHeader === 'string' ? authHeader.replace('Bearer ', '') : undefined;

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ? AND active = true',
      [(decoded as { id: number }).id]
    );

    if (!rows.length) {
      throw new Error();
    }

    req.user = {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role: rows[0].role,
      active: rows[0].active
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Por favor, faça login.' });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso não autorizado.' });
    }
    next();
  };
};