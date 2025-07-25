import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập (yêu cầu Admin)' });
  }
  next();
};

export const onlyUser = (req: Request, res: Response, next: NextFunction) => {
  const role = req.session.user?.role;
  if (role !== 'user') {
    return res.status(403).json({ message: 'Chỉ người dùng được thực hiện chức năng này' });
  }
  next();
};

export const onlyAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Chỉ admin mới được phép thực hiện thao tác này.' });
  }
  next();
};
