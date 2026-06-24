import { Gender } from "../../../generated/prisma/enums";

export interface IUpdateProfilePayload {
  dateOfBirth?: Date | string;
  gender?: Gender;
  address?: string;
  bio?: string;
  resume?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
}
