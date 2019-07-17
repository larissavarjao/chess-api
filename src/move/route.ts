import * as express from 'express';
import * as Move from './model';
import { auth, RequestWithUser } from '../auth/auth';
import { validateMove } from '../shared/validate';

export const router = express.Router();

// GET /moves?moveFrom=A5
router.get('/moves', auth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    const moveFrom = req.query.moveFrom;
    if (!user) {
      return res.status(401).send();
    }

    if (!moveFrom && !validateMove(moveFrom)) {
      return res.status(401).send();
    }

    const moves = await Move.getPossibilities(moveFrom);

    return res.send({ moves });
  } catch (e) {
    console.log('Error', e);
    return res.status(400).send();
  }
});
