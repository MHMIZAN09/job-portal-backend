export interface IAddSkillPayload {
  skillId?: string; // Existing skill ID (preferred)
  skillName?: string; // Or skill name (auto-create if not exists)
}

export interface IAddMultipleSkillsPayload {
  skillIds?: string[]; // Multiple skill IDs
  skillNames?: string[]; // Multiple skill names
}
