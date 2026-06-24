export interface ICreateExperiencePayload {
  companyName: string;
  position: string;
  startDate: Date | string;
  endDate?: Date | string;
  description?: string;
}

export interface IUpdateExperiencePayload {
  companyName?: string;
  position?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  description?: string;
}
