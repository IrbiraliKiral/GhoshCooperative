export type UserRole = 'member' | 'staff' | 'admin';

export interface User {
  id: string;
  fullName: string;
  dateOfBirth: string;
  passwordHash: string;
  role: UserRole;
  registeredAt: string;
  lastLogin?: string;
}

export interface UserRegistrationData {
  fullName: string;
  dateOfBirth: string;
  password: string;
}

export interface UsersDatabase {
  users: User[];
}
