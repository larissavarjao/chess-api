import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import * as User from '../user/model';
import { JWT_SECRET } from '../user/model';
import { DBUser } from '../db';

export interface RequestWithUser extends express.Request {
  user: DBUser | undefined;
}

export const auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const request = req as RequestWithUser;
    const token = request.header('Authorization')!.replace('Bearer ', '');
    const decoded = <{ id: string; iat: string }>jwt.verify(token, JWT_SECRET);
    const user = await User.get(decoded.id);

    if (user) {
      request.user = user;
    }

    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: 'Please authenticate!' });
  }
};
