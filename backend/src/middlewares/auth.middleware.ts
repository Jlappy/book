import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user?.id) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }
  next();
};