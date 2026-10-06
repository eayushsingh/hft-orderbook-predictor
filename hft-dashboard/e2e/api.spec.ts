import { test, expect } from '@playwright/test';

test.describe('Backend API Endpoints', () => {
  test('GET /api/admin returns telemetry data and user list', async ({ request }) => {
    const response = await request.get('/api/admin');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body).toHaveProperty('telemetry');
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBe(true);
  });

  test('POST /api/admin updates user plan/status', async ({ request }) => {
    const response = await request.post('/api/admin', {
      data: {
        action: 'UPDATE_TIER',
        userId: 'usr_1',
        plan: 'INSTITUTIONAL',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.userId).toBe('usr_1');
  });

  test('GET /api/stocks/search returns matching stocks', async ({ request }) => {
    const response = await request.get('/api/stocks/search?q=RELIANCE');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('query');
    expect(body).toHaveProperty('results');
    expect(Array.isArray(body.results)).toBe(true);
  });

  test('GET /api/stocks/RELIANCE/institutional-activity returns analytics', async ({ request }) => {
    const response = await request.get('/api/stocks/RELIANCE/institutional-activity');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('symbol');
    expect(body.symbol).toBe('RELIANCE');
    expect(body).toHaveProperty('score');
  });

  test('POST /api/subscription starts free trial', async ({ request }) => {
    const response = await request.post('/api/subscription', {
      data: {
        action: 'start-trial',
        planId: 'pro',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.isTrialActive).toBe(true);
  });
});
