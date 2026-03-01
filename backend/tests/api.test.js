import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createApp } from '../src/app.js';

function startTestServer() {
  const app = createApp();
  const server = createServer(app);

  return new Promise((resolve) => {
    server.listen(0, () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`
      });
    });
  });
}

async function requestJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers ?? {})
    }
  });

  const body = await response.json();
  return { status: response.status, body };
}

test('Gym backend API', async (t) => {
  const { server, baseUrl } = await startTestServer();
  t.after(() => server.close());

  await t.test('returns health status', async () => {
    const response = await requestJson(baseUrl, '/api/health');
    assert.equal(response.status, 200);
    assert.equal(response.body.status, 'ok');
  });

  await t.test('creates member and invoice flow with webhook idempotency', async () => {
    const memberResponse = await requestJson(baseUrl, '/api/members', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Iris Scott', email: 'iris.scott@example.com', planId: 'plan-pro' })
    });

    assert.equal(memberResponse.status, 201);

    const invoiceResponse = await requestJson(baseUrl, '/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ memberId: memberResponse.body.id })
    });

    assert.equal(invoiceResponse.status, 201);

    const webhookPayload = {
      providerEventId: 'evt_1234',
      memberId: memberResponse.body.id,
      status: 'succeeded',
      amount: 79
    };

    const webhookFirstResponse = await requestJson(baseUrl, '/api/webhooks/payments', {
      method: 'POST',
      body: JSON.stringify(webhookPayload)
    });

    assert.equal(webhookFirstResponse.status, 202);
    assert.equal(webhookFirstResponse.body.duplicated, false);

    const webhookSecondResponse = await requestJson(baseUrl, '/api/webhooks/payments', {
      method: 'POST',
      body: JSON.stringify(webhookPayload)
    });

    assert.equal(webhookSecondResponse.status, 200);
    assert.equal(webhookSecondResponse.body.duplicated, true);
  });

  await t.test('books class and enforces duplicate booking check', async () => {
    const membersResponse = await requestJson(baseUrl, '/api/members');
    const classesResponse = await requestJson(baseUrl, '/api/classes');

    const firstBooking = await requestJson(baseUrl, '/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ memberId: membersResponse.body[0].id, classId: classesResponse.body[0].id })
    });

    assert.equal(firstBooking.status, 201);

    const secondBooking = await requestJson(baseUrl, '/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ memberId: membersResponse.body[0].id, classId: classesResponse.body[0].id })
    });

    assert.equal(secondBooking.status, 409);
  });
});
