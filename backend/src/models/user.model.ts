import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
    avatar?: string;
    role: 'user' | 'admin';
    favorites: string[];
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserResponse {
    _id: Types.ObjectId;
    email: string;
    fullName?: string;
    phone?: string;
    avatar?: string;
    role: 'user' | 'admin';
    favorites: string[];
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: String,
    phone: String,
    avatar: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    favorites: [{ type: String }]
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    console.log(`[COMPARE_DEBUG] Bắt đầu so sánh mật khẩu.`); 
    console.log(`[COMPARE_DEBUG] Mật khẩu candidate (nhập vào): ${candidatePassword}`);
    console.log(`[COMPARE_DEBUG] Mật khẩu lưu trữ (hash): ${this.password}`);
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log(`[COMPARE_DEBUG] Kết quả bcrypt.compare: ${result}`); 
    return result;
};
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;