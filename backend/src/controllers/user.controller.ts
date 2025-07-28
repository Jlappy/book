import { Request, Response } from 'express';
import * as UserService from '../services/user.service';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        if (typeof email !== 'string' || !email || typeof password !== 'string' || password.length < 6 ||
            (role && typeof role !== 'string')) {
            return res.status(400).json({ message: 'Dữ liệu đăng ký không hợp lệ.' });
        }

        await UserService.register(email, password, role);

        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (error: any) {
        console.error('Lỗi khi đăng ký:', error);
        if (error.message === 'Email đã tồn tại') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message || 'Lỗi server khi đăng ký' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (typeof email !== 'string' || !email || typeof password !== 'string' || !password) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không được để trống.' });
        }
        const user = await UserService.login(email, password);

        req.session.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };
        res.status(200).json({ message: 'Đăng nhập thành công', user: { id: user._id, email: user.email, role: user.role } });
    } catch (error: any) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(401).json({ message: error.message || 'Sai email hoặc mật khẩu' });
    }
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Lỗi khi huỷ session:', err);
            return res.status(500).json({ message: 'Lỗi đăng xuất' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Đã đăng xuất' });
    });
};

export const getProfile = (req: Request, res: Response) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).json({ message: 'Chưa đăng nhập' });
    }
};

export const getUsersByRole = async (req: Request, res: Response) => {
    const { role } = req.query;

    if (!role || typeof role !== 'string') {
        return res.status(400).json({ message: 'Tham số vai trò không hợp lệ.' });
    }

    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Vai trò không tồn tại.' });
    }

    try {
        const users = await UserService.getUsersByRoleService(role);
        res.status(200).json(users);
    } catch (error) {
        console.error(`❌ Lỗi khi lấy danh sách người dùng theo role (${role}):`, error);
        res.status(500).json({ message: 'Lỗi server. Không thể lấy danh sách người dùng.' });
    }
};

export const getOverview = async (req: Request, res: Response) => {
    try {
        const stats = await UserService.getOverviewStats();
        res.json(stats);
    } catch (err) {
        console.error('[OverviewController] Lỗi khi lấy thống kê:', err);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy thống kê' });
    }
};