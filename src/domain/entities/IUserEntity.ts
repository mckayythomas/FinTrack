export interface IUserEntity {
  _id: string;
  name: string;
  email: string;
  image: string;
  emailVerified: boolean | null;
}
