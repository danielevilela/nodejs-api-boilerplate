import request from 'supertest';
import app from '../../app';
import { config } from '../../config/env';
import { expectError } from '../helpers';

describe('User Routes', () => {
  const baseUrl = `${config.apiPrefix}/users`;

  describe('POST /users', () => {
    const validUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should create a new user with valid data', async () => {
      const response = await request(app)
        .post(baseUrl)
        .send(validUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user).toEqual({
        username: validUser.username,
        email: validUser.email,
        password: validUser.password,
      });
    });

    it('should return 400 for invalid username', async () => {
      const response = await request(app)
        .post(baseUrl)
        .send({ ...validUser, username: 'a' });

      expectError(response, 400);
      expect(response.body.message).toContain('Username must be at least 3 characters');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post(baseUrl)
        .send({ ...validUser, email: 'invalid-email' });

      expectError(response, 400);
      expect(response.body.message).toContain('Invalid email address');
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app)
        .post(baseUrl)
        .send({ ...validUser, password: 'weak' });

      expectError(response, 400);
      expect(response.body.message).toContain('Password must be at least 8 characters');
    });
  });
});
