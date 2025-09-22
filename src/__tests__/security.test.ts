import request from 'supertest';
import app from '../app';
import { config } from '../config/env';

describe('Security Middleware', () => {
  describe('Helmet Security Headers', () => {
    it('should set security headers', async () => {
      const response = await request(app).get(`${config.apiPrefix}/health`);

      // Content-Security-Policy header
      expect(response.headers['content-security-policy']).toContain("default-src 'self'");

      // X-Content-Type-Options header
      expect(response.headers['x-content-type-options']).toBe('nosniff');

      // X-Frame-Options header
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');

      // X-XSS-Protection header
      expect(response.headers['x-xss-protection']).toBe('0');

      // Strict-Transport-Security header
      expect(response.headers['strict-transport-security']).toBe(
        'max-age=31536000; includeSubDomains'
      );
    });
  });

  describe('CORS', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options(`${config.apiPrefix}/health`)
        .set('Origin', 'http://example.com')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.headers['access-control-allow-methods']).toContain('GET');
      expect(response.status).toBe(204);
    });

    it('should set CORS headers on normal requests', async () => {
      const response = await request(app)
        .get(`${config.apiPrefix}/health`)
        .set('Origin', 'http://example.com');

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });
});
