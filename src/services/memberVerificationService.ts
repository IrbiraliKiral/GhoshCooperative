import memberCodesData from '../data/member_codes.json';

export interface MemberCode {
  id: string;
  fullName: string;
  code: string;
}

interface MemberCodesData {
  members: MemberCode[];
}

const typedMemberCodesData = memberCodesData as MemberCodesData;

/**
 * Verify member credentials (name and code)
 */
export function verifyMemberCredentials(fullName: string, code: string): { success: boolean; member?: MemberCode; message: string } {
  const normalizedName = fullName.trim().toLowerCase();
  const normalizedCode = code.trim();

  const member = typedMemberCodesData.members.find(
    (m: MemberCode) => m.fullName.toLowerCase() === normalizedName && m.code === normalizedCode
  );

  if (member) {
    return {
      success: true,
      member,
      message: 'Verification successful'
    };
  }

  return {
    success: false,
    message: 'Invalid name or code. Please try again.'
  };
}

/**
 * Check if a member exists by name (for verification page feedback)
 */
export function memberExists(fullName: string): boolean {
  const normalizedName = fullName.trim().toLowerCase();
  return typedMemberCodesData.members.some(
    (m: MemberCode) => m.fullName.toLowerCase() === normalizedName
  );
}

/**
 * Get all member names for autocomplete/suggestions
 */
export function getAllMemberNames(): string[] {
  return typedMemberCodesData.members.map((m: MemberCode) => m.fullName);
}
