import { User, UserRegistrationData, UsersDatabase } from '@/types/user';
import { hashPassword } from '@/utils/encryption';

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Load users from localStorage (simulating file system)
 */
export function loadUsers(): UsersDatabase {
  try {
    const data = localStorage.getItem('users_database');
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return { users: [] };
}

/**
 * Save users to localStorage (simulating file system)
 */
export function saveUsers(database: UsersDatabase): boolean {
  try {
    localStorage.setItem('users_database', JSON.stringify(database, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
}

/**
 * Check if a user already exists by full name
 */
export function userExists(fullName: string): boolean {
  const database = loadUsers();
  return database.users.some(
    user => user.fullName.toLowerCase() === fullName.toLowerCase()
  );
}

/**
 * Register a new user
 */
export async function registerUser(data: UserRegistrationData): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    // Check if user already exists
    if (userExists(data.fullName)) {
      return {
        success: false,
        message: 'A user with this name already exists'
      };
    }

    // Hash the password
    const passwordHash = await hashPassword(data.password);

    // Create new user
    const newUser: User = {
      id: generateUserId(),
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      passwordHash: passwordHash,
      role: 'member',
      registeredAt: new Date().toISOString()
    };

    // Load existing database
    const database = loadUsers();

    // Add new user
    database.users.push(newUser);

    // Save to localStorage
    const saved = saveUsers(database);

    if (saved) {
      return {
        success: true,
        message: 'User registered successfully',
        user: newUser
      };
    } else {
      return {
        success: false,
        message: 'Failed to save user data'
      };
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      message: 'An error occurred during registration'
    };
  }
}

/**
 * Get all users (admin function)
 */
export function getAllUsers(): User[] {
  const database = loadUsers();
  return database.users;
}

/**
 * Get user by ID
 */
export function getUserById(id: string): User | undefined {
  const database = loadUsers();
  return database.users.find(user => user.id === id);
}

/**
 * Get user by full name
 */
export function getUserByName(fullName: string): User | undefined {
  const database = loadUsers();
  return database.users.find(
    user => user.fullName.toLowerCase() === fullName.toLowerCase()
  );
}

/**
 * Update user's last login timestamp
 */
export function updateLastLogin(userId: string): boolean {
  try {
    const database = loadUsers();
    const userIndex = database.users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return false;
    }

    database.users[userIndex].lastLogin = new Date().toISOString();
    return saveUsers(database);
  } catch (error) {
    console.error('Error updating last login:', error);
    return false;
  }
}
