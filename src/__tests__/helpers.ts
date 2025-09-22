import { Response } from 'supertest';

export interface ErrorResponse {
  status: string;
  message: string;
}

export const expectError = (response: Response, statusCode: number, message?: string) => {
  expect(response.status).toBe(statusCode);
  expect(response.body.status).toBe('error');
  if (message) {
    expect(response.body.message).toBe(message);
  }
};

export const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
