export interface IBoardEntity {
  _id?: string;
  userId: string;
  name: string;
  description?: string;
  privacy: "private" | "shared";
  sharedUsers?: {
    userId: string;
    accessLevel: "view-only" | "contributor";
  }[];
  createdAt?: number;
  updatedAt?: number;
}
