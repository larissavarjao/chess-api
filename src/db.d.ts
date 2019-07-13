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
