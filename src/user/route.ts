import * as express from 'express';
import * as User from './model';
import { auth, RequestWithUser } from '../auth/auth';
import { isValidEmail } from '../utils/email';

export const router = express.Router();

router.post('/users', async (req, res) => {
  const newUser = req.body;

  if (!newUser.name) {
    return res.sendStatus(401);
  }
  if (!newUser.email || !isValidEmail(newUser.email)) {
    return res.sendStatus(401);
  }
  if (!newUser.password || newUser.password.length < 7) {
    return res.sendStatus(401);
  }

  try {
    const user = await User.insert(newUser.name, newUser.email, newUser.password);

    return res.status(201).send(User.format(user));
  } catch (e) {
    console.error(e);
    return res.status(400).send();
  }
});

router.post('/auth', async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(401).send({ error: 'Unable to login' });
  }
  if (!req.body.password) {
    return res.status(401).send({ error: 'Unable to login' });
  }

  try {
    const user = await User.getByEmail(email);
    if (!user) {
      return res.status(401).send({ error: 'Unable to login' });
    }

    const isMatch = await User.comparePassword(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Unable to login' });
    }

    const token = User.generateAuthToken(user.id);
    res.send({ user: User.format(user), token });
  } catch (e) {
    console.log('Error', e);
    res.sendStatus(400);
  }
});

router.put('/users', auth, async (req: RequestWithUser, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid operation' });
  }

  if (req.body.email && !isValidEmail(req.body.email)) {
    return res.sendStatus(401);
  }

  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send();
    }
    updates.forEach(update => ((user as any)[update] = req.body[update]));
    await User.update(user.name, user.id, user.email);
    res.send({ user: User.format(user) });
  } catch (e) {
    console.log('Error', e);
    return res.status(400).send();
  }
});

router.delete('/users', auth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send();
    }
    const userRemoved = await User.remove(user!.id);
    res.send({ user: User.format(userRemoved) });
  } catch (e) {
    console.log('Error ', e);
    return res.status(404).send();
  }
});
