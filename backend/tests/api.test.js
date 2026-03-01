import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Gym backend API', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('creates member and invoice flow with webhook idempotency', async () => {
    const memberResponse = await request(app)
      .post('/api/members')
      .send({ fullName: 'Iris Scott', email: 'iris.scott@example.com', planId: 'plan-pro' });

    expect(memberResponse.statusCode).toBe(201);

    const invoiceResponse = await request(app)
      .post('/api/invoices')
      .send({ memberId: memberResponse.body.id });

    expect(invoiceResponse.statusCode).toBe(201);

    const webhookFirstResponse = await request(app)
      .post('/api/webhooks/payments')
      .send({
        providerEventId: 'evt_1234',
        memberId: memberResponse.body.id,
        status: 'succeeded',
        amount: 79
      });

    expect(webhookFirstResponse.statusCode).toBe(202);
    expect(webhookFirstResponse.body.duplicated).toBe(false);

    const webhookSecondResponse = await request(app)
      .post('/api/webhooks/payments')
      .send({
        providerEventId: 'evt_1234',
        memberId: memberResponse.body.id,
        status: 'succeeded',
        amount: 79
      });

    expect(webhookSecondResponse.statusCode).toBe(200);
    expect(webhookSecondResponse.body.duplicated).toBe(true);
  });

  it('books class and enforces duplicate booking check', async () => {
    const membersResponse = await request(app).get('/api/members');
    const classesResponse = await request(app).get('/api/classes');

    const firstBooking = await request(app)
      .post('/api/bookings')
      .send({ memberId: membersResponse.body[0].id, classId: classesResponse.body[0].id });

    expect(firstBooking.statusCode).toBe(201);

    const secondBooking = await request(app)
      .post('/api/bookings')
      .send({ memberId: membersResponse.body[0].id, classId: classesResponse.body[0].id });

    expect(secondBooking.statusCode).toBe(409);
  });
});
