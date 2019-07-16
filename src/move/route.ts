import * as express from 'express';
import * as Move from './model';
import { auth, RequestWithUser } from '../auth/auth';
import { validateMove } from '../shared/validate';

export const router = express.Router();

router.get('/moves', auth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send();
    }
    const movesFromUser = await Move.getAllMovesFromUser(user!.id);
    res.send({ moves: movesFromUser });
  } catch (e) {
    console.log('Error', e);
    return res.status(400).send();
  }
});

router.post('/moves', auth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    const from = req.body.moveFrom;
    const to = req.body.moveTo;
    if (!user) {
      return res.status(401).send();
    }
    if (!from || !validateMove(from)) {
      return res.status(401).send();
    }
    if (!to || !validateMove(to)) {
      return res.status(401).send();
    }

    const move = await Move.insert(user.id, from, to);
    res.send({ move: Move.format(move) });
  } catch (e) {
    console.log('Error', e);
    return res.status(400).send();
  }
});
