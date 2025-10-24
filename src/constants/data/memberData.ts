import { Member } from '@/types';
import membersData from '../../../data/members.json';

export const members: Member[] = membersData as Member[];

// Helper functions to filter members
export const getStaffMembers = (): Member[] => {
  return members.filter(member => member.isStaff);
};

export const getRegularMembers = (): Member[] => {
  return members.filter(member => !member.isStaff);
};

export const getAllMembers = (): Member[] => {
  return members;
};
