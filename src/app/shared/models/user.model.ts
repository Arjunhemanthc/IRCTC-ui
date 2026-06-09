export interface User { 
  id: string; 
  username: string; 
  email: string; 
  firstName: string; 
  lastName: string; 
  phone: string; 
  address: string;
  city: string;
  state: string;
  pincode: string;
  role: UserRole; 
  isAadhaarVerified: boolean; 
  bookingThisMonth: number; 
  eWalletBalance: number; 
}

export type UserRole = 'User' | 'SuperAdmin' | 'TrainManager' | 'FareAdmin' | 'SupportAdmin' | 'StationMaster';

export interface TokenResponse { 
  accessToken: string; 
  refreshToken: string; 
  expiresAt: string; 
  user: User; 
}

export interface RegisterRequest { 
  username: string; 
  email: string; 
  password: string; 
  firstName: string; 
  lastName: string; 
  phone: string; 
  dateOfBirth: string; 
  gender: 'Male' | 'Female' | 'Other'; 
  captchaId: string;
  captchaResponse: string;
}

export interface CaptchaResponse {
  captchaId: string;
  captchaText: string;
}

export interface LoginRequest { 
  usernameOrEmail: string; 
  password: string; 
}

export interface UpdateProfileRequest { 
  firstName: string; 
  lastName: string; 
  phone: string; 
  address: string; 
  city: string; 
  state: string; 
  pincode: string; 
}
