import { Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  const schema = z.object({
    body: z.object({
      name: z.string().min(3),
    }),
  });

  it('should pass validation for valid data', async () => {
    mockRequest = {
      body: { name: 'John Doe' },
    };

    await validate(schema)(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it('should call next with error for invalid data', async () => {
    mockRequest = {
      body: { name: 'Jo' },
    };

    await validate(schema)(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });
});
