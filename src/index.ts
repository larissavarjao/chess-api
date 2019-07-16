import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { router as userRouter } from './user/route';
import { router as moveRouter } from './move/route';
import './postgres';

export const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRouter);
app.use(moveRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
