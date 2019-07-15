import * as request from 'supertest';
import { app } from '../../src/index';
import { NewUser } from '../../src/user/model';

export const createUser = (newUser: NewUser) => {
  return request(app)
    .post('/users')
    .send(newUser);
};

export const loginUser = (email: string, password: string) => {
  return request(app)
    .post('/auth')
    .send({ email, password });
};

export const updateUser = (name: string, email: string, token: string) => {
  return request(app)
    .put('/users')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, email });
};

export const deleteUser = (token: string) => {
  return request(app)
    .delete('/users')
    .set('Authorization', `Bearer ${token}`);
};
