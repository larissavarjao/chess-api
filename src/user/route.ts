import * as express from 'express';
import * as User from './model';

export const router = express.Router();

router.post('/users', async (req, res) => {
  const newUser = req.body;

  if (!newUser.name) {
    return res.sendStatus(401);
  }
  if (!newUser.email) {
    return res.sendStatus(401);
  }
  if (!newUser.password) {
    return res.sendStatus(401);
  }

  try {
    const user = await User.insert(newUser.name, newUser.email, newUser.password);

    return res.send(User.format(user));
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

    const isMatch = User.comparePassword(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Unable to login' });
    }

    const token = User.generateAuthToken(user.id, user.email);
    res.send({ user, token });
  } catch (e) {
    res.sendStatus(400);
  }
});
