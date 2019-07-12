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
