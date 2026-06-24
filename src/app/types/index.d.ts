import { Role } from "../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user: IRequestUser;
    }
  }
}

export interface IRequestUser {
  userId: string;
  email: string;
  role: Role;
}
