import User, { IUser, IUserResponse } from '../models/user.model';

export const register = async (email: string, password: string, role: string = 'user'): Promise<IUser> => {
    const existing = await User.findOne({ email });
    if (existing) {
        throw new Error('Email đã tồn tại');
    }

    const user = new User({
        email,
        password: password,
        role: role
    });

    await user.save();
    return user;
};


export const login = async (email: string, password: string): Promise<IUserResponse> => {
    console.log(`[LOGIN_DEBUG] Bắt đầu đăng nhập cho email: ${email}`);

    const user = await User.findOne({ email });

    if (!user) {
        console.log(`[LOGIN_DEBUG] Không tìm thấy người dùng: ${email}`);
        throw new Error('Sai email hoặc mật khẩu');
    }

    console.log(`[LOGIN_DEBUG] Đã tìm thấy người dùng: ${user.email}, Role: ${user.role}`);
    console.log(`[LOGIN_DEBUG] Mật khẩu người dùng nhập vào (thô): ${password}`);
    console.log(`[LOGIN_DEBUG] Mật khẩu đã hash trong DB: ${user.password}`);

    const isPasswordValid = await user.comparePassword(password);

    console.log(`[LOGIN_DEBUG] Kết quả so sánh mật khẩu (bcrypt.compare): ${isPasswordValid}`);

    if (!isPasswordValid) {
        console.log(`[LOGIN_DEBUG] Mật khẩu không khớp cho ${email}`);
        throw new Error('Sai email hoặc mật khẩu');
    }

    console.log(`[LOGIN_DEBUG] Đăng nhập thành công cho ${email}`);

    const userObject: { [key: string]: any } = user.toObject();
    delete userObject.password;

    return userObject as IUserResponse;
};

export const getUsersByRoleService = async (role: string) => {
  return await User.find({ role }).select('-password');
};

