import { describe, it, expect } from 'vitest';
import {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from '../_core/errors';

/**
 * HTTP Error Tests
 * 
 * Tests for custom HTTP error classes
 */

describe('HTTP Errors', () => {
  describe('HttpError Base Class', () => {
    it('should create error with status code', () => {
      const error = new HttpError(500, 'Internal Server Error');
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Internal Server Error');
    });

    it('should have correct name', () => {
      const error = new HttpError(400, 'Bad Request');
      expect(error.name).toBe('HttpError');
    });

    it('should be instance of Error', () => {
      const error = new HttpError(404, 'Not Found');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(HttpError);
    });

    it('should have stack trace', () => {
      const error = new HttpError(500, 'Test');
      expect(error.stack).toBeDefined();
    });
  });

  describe('BadRequestError', () => {
    it('should create 400 error', () => {
      const error = BadRequestError('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid input');
    });

    it('should be HttpError instance', () => {
      const error = BadRequestError('Test');
      expect(error).toBeInstanceOf(HttpError);
    });
  });

  describe('UnauthorizedError', () => {
    it('should create 401 error', () => {
      const error = UnauthorizedError('Please login');
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Please login');
    });

    it('should be HttpError instance', () => {
      const error = UnauthorizedError('Test');
      expect(error).toBeInstanceOf(HttpError);
    });
  });

  describe('ForbiddenError', () => {
    it('should create 403 error', () => {
      const error = ForbiddenError('Access denied');
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Access denied');
    });

    it('should be HttpError instance', () => {
      const error = ForbiddenError('Test');
      expect(error).toBeInstanceOf(HttpError);
    });
  });

  describe('NotFoundError', () => {
    it('should create 404 error', () => {
      const error = NotFoundError('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
    });

    it('should be HttpError instance', () => {
      const error = NotFoundError('Test');
      expect(error).toBeInstanceOf(HttpError);
    });
  });

  describe('Error Handling Patterns', () => {
    it('should be catchable as Error', () => {
      try {
        throw BadRequestError('Test error');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        if (e instanceof HttpError) {
          expect(e.statusCode).toBe(400);
        }
      }
    });

    it('should allow status code checking', () => {
      const errors = [
        BadRequestError('Bad'),
        UnauthorizedError('Unauth'),
        ForbiddenError('Forbidden'),
        NotFoundError('NotFound'),
      ];

      const statusCodes = errors.map(e => e.statusCode);
      expect(statusCodes).toEqual([400, 401, 403, 404]);
    });

    it('should preserve message in JSON serialization', () => {
      const error = NotFoundError('User not found');
      const json = JSON.stringify({ 
        statusCode: error.statusCode, 
        message: error.message 
      });
      const parsed = JSON.parse(json);
      
      expect(parsed.statusCode).toBe(404);
      expect(parsed.message).toBe('User not found');
    });
  });
});
