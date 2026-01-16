export interface User {
  _id: string | undefined;
  username: string;
  password: string;
  name: string;
  lastname: string;
  isAdmin: boolean;
}