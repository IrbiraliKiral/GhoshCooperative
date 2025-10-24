import { Rule } from '@/types';
import rulesData from '../../../data/rules.json';

export const rules: Rule[] = rulesData as Rule[];

export const getImportantRules = (): Rule[] => {
  return rules.filter(rule => rule.important);
};

export const getAllRules = (): Rule[] => {
  return rules;
};
