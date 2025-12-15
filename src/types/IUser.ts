export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  profileImageUrl: string;
}

export interface IAddUserForm {
  firstName: string;
  lastName: string;
}
