interface DBBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface DBUser extends DBBase {
  name: string;
  email: string;
  password: string;
}
