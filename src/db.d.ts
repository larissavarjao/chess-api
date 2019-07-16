interface DBBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface DBUser extends DBBase {
  name: string;
  email: string;
  password: string;
}

export interface DBMove extends DBBase {
  moveFrom: string;
  moveTo: string;
}

export interface DBUsersMove {
  userId: string;
  moveId: string;
}
