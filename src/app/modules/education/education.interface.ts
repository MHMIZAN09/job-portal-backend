export interface ICreateEducationPayload {
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: Date | string;
  endDate?: Date | string;
  cgpa?: number;
}

export interface IUpdateEducationPayload {
  degree?: string;
  institution?: string;
  fieldOfStudy?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  cgpa?: number;
}
