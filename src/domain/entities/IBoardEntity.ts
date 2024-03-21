export interface IBoardEntity {
  _id?: string;
  userId: string;
  name: string;
  description?: string;
  privacy: "private" | "shared";
  sharedUsers?: ISharedUsers[];
  createdAt?: number;
  updatedAt?: number;
}

export interface ISharedUsers {
  userId: string;
  accessLevel: "view-only" | "contributor";
}
