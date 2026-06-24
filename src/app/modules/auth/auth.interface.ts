import { Role } from "../../../generated/prisma/enums";

export interface IUserRegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  // options?:  for employee
  companyName?: string;
  industry?: string;
}

export interface IUserLoginPayload {
  email: string;
  password: string;
}
