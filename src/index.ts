import * as express from 'express';
import * as bodyParser from 'body-parser';
import { router as userRouter } from './user/route';
import './postgres';

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
