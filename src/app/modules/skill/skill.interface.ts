export interface ICreateSkillPayload {
  name: string;
  userId: string;
}

export interface IUpdateSkillPayload {
  name?: string;
  userId: string;
}
