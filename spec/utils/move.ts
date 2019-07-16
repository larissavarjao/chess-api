import * as request from 'supertest';
import { app } from '../../src/index';

export const createMove = (moveFrom: string, moveTo: string, token: string) => {
  return request(app)
    .post('/moves')
    .set('Authorization', `Bearer ${token}`)
    .send({ moveFrom, moveTo });
};

export const getMoves = (token: string) => {
  return request(app)
    .get('/moves')
    .set('Authorization', `Bearer ${token}`)
    .send();
};

export const deleteMove = (token: string) => {
  return request(app)
    .delete('/moves')
    .set('Authorization', `Bearer ${token}`);
};

export const generateMoviment = () => {
  const firstLetter = String.fromCharCode(Math.floor(Math.random() * 8) + 65);
  const secondLetter = Math.floor(Math.random() * 8 + 1);
  return `${firstLetter}${secondLetter}`;
};
