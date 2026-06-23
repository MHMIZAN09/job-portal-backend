export interface IUserRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface IUserLoginPayload {
  email: string;
  password: string;
}
