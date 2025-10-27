import { MemberCode } from './memberVerificationService';

export interface MachineSession {
  machineId: string;
  ipAddress: string;
  memberName: string;
  memberId: string;
  loginTime: string;
  lastAccessTime: string;
}

export interface MachinesDatabase {
  machines: MachineSession[];
}

/**
 * Generate a unique machine ID using browser fingerprint
 */
export async function generateMachineId(): Promise<string> {
  const navigator_info = window.navigator;
  const screen_info = window.screen;

  const ua = navigator_info.userAgent;
  const vendor = navigator_info.vendor;
  const platform = navigator_info.platform;
  const screenResolution = `${screen_info.width}x${screen_info.height}`;
  const timezone = new Date().getTimezoneOffset();
  const language = navigator_info.language;

  const fingerprint = `${ua}|${vendor}|${platform}|${screenResolution}|${timezone}|${language}`;

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `machine_${Math.abs(hash).toString(36)}`;
}

/**
 * Get user's IP address (simplified - in production, use actual IP detection)
 */
export async function getUserIP(): Promise<string> {
  try {
    // This is a simplified approach for browser environment
    // In production, you'd call an IP detection service
    return 'browser_local';
  } catch {
    return 'unknown';
  }
}

/**
 * Load sessions from localStorage
 */
export function loadSessions(): MachinesDatabase {
  try {
    const data = localStorage.getItem('machines_database');
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading sessions:', error);
  }
  return { machines: [] };
}

/**
 * Save sessions to localStorage
 */
export function saveSessions(database: MachinesDatabase): boolean {
  try {
    localStorage.setItem('machines_database', JSON.stringify(database, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving sessions:', error);
    return false;
  }
}

/**
 * Get session for current machine
 */
export function getCurrentMachineSession(): MachineSession | null {
  const machineId = localStorage.getItem('machine_id');
  if (!machineId) return null;

  const database = loadSessions();
  return database.machines.find(m => m.machineId === machineId) || null;
}

/**
 * Create a new session for current machine
 */
export async function createSession(member: MemberCode): Promise<{ success: boolean; session?: MachineSession }> {
  try {
    const machineId = await generateMachineId();
    const ipAddress = await getUserIP();

    const newSession: MachineSession = {
      machineId,
      ipAddress,
      memberName: member.fullName,
      memberId: member.id,
      loginTime: new Date().toISOString(),
      lastAccessTime: new Date().toISOString()
    };

    const database = loadSessions();
    
    // Remove any existing session for this machine ID
    database.machines = database.machines.filter(m => m.machineId !== machineId);
    
    // Add new session
    database.machines.push(newSession);

    const saved = saveSessions(database);

    if (saved) {
      // Store machine ID in localStorage
      localStorage.setItem('machine_id', machineId);
      return {
        success: true,
        session: newSession
      };
    }

    return { success: false };
  } catch (error) {
    console.error('Error creating session:', error);
    return { success: false };
  }
}

/**
 * Update last access time for current session
 */
export function updateSessionAccess(): boolean {
  try {
    const machineId = localStorage.getItem('machine_id');
    if (!machineId) return false;

    const database = loadSessions();
    const sessionIndex = database.machines.findIndex(m => m.machineId === machineId);

    if (sessionIndex === -1) return false;

    database.machines[sessionIndex].lastAccessTime = new Date().toISOString();
    return saveSessions(database);
  } catch (error) {
    console.error('Error updating session:', error);
    return false;
  }
}

/**
 * Logout current session
 */
export function logout(): boolean {
  try {
    const machineId = localStorage.getItem('machine_id');
    if (!machineId) return false;

    const database = loadSessions();
    database.machines = database.machines.filter(m => m.machineId !== machineId);

    const saved = saveSessions(database);

    if (saved) {
      localStorage.removeItem('machine_id');
      localStorage.removeItem('member_name');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
}

/**
 * Store member name in localStorage for quick access
 */
export function storeMemberName(memberName: string): void {
  localStorage.setItem('member_name', memberName);
}

/**
 * Get stored member name
 */
export function getStoredMemberName(): string | null {
  return localStorage.getItem('member_name');
}
