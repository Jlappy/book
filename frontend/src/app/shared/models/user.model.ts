// IUser: Định nghĩa user object mà frontend sẽ làm việc.
export interface IUser {
  _id: string; 
  email: string;
  role: 'user' | 'admin'; 
  fullName?: string;
  phone?: string;
  avatar?: string;
  favorites?: string[]; 
}

// ILoginCredentials: Dữ liệu gửi lên khi đăng nhập
export interface ILoginCredentials {
  email: string;
  password: string;
}

// ILoginResponse: Phản hồi từ API đăng nhập
export interface ILoginResponse {
  message: string;
  user: IUser;
}

// IRegisterCredentials: Dữ liệu gửi lên khi đăng ký
export interface IRegisterCredentials {
  email: string;
  password: string;
  role?: 'user' | 'admin'; 
}

// IRegisterResponse: Phản hồi từ API đăng ký (Backend trả về message và user)
export interface IRegisterResponse {
  message: string;
  user?: IUser; 
}