import { store } from './data/store.js';
import { createBooking, createClass, listClasses } from './services/bookingService.js';
import { authorizeVisit, listAccessFeed } from './services/accessService.js';
import { createInvoice, listInvoices, processPaymentWebhook } from './services/billingService.js';
import { assignPlan, createMember, listMembers } from './services/memberService.js';
import { ApiError } from './utils/errors.js';

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw.trim()) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new ApiError(400, 'Invalid JSON body');
  }
}

function getPath(req) {
  return new URL(req.url, 'http://localhost').pathname;
}

function getQuery(req) {
  return new URL(req.url, 'http://localhost').searchParams;
}

export function createApp() {
  return async function app(req, res) {
    try {
      const method = req.method ?? 'GET';
      const path = getPath(req);

      if (method === 'GET' && path === '/api/health') {
        return sendJson(res, 200, { status: 'ok', service: 'fitness-gym-backend', at: new Date().toISOString() });
      }

      if (method === 'GET' && path === '/api/overview') {
        const totalMembers = store.members.length;
        const activeMembers = store.members.filter((member) => member.status === 'active').length;
        const todaysCheckins = store.visits.filter((visit) => visit.timestamp.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
        const monthlyRevenue = store.invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

        return sendJson(res, 200, {
          kpis: {
            totalMembers,
            activeMembers,
            todaysCheckins,
            monthlyRevenue,
            collectionRate: totalMembers === 0
              ? 100
              : Number((((totalMembers * 100) - store.members.reduce((sum, m) => sum + m.debt, 0)) / (totalMembers * 100)).toFixed(2))
          },
          alerts: [
            `${store.members.filter((member) => member.debt > 0).length} members with outstanding debt`,
            `${store.bookings.filter((booking) => booking.status === 'waitlist').length} bookings in waitlist`
          ]
        });
      }

      if (method === 'GET' && path === '/api/plans') return sendJson(res, 200, store.plans);
      if (method === 'GET' && path === '/api/members') return sendJson(res, 200, listMembers());
      if (method === 'POST' && path === '/api/members') return sendJson(res, 201, createMember(await readJsonBody(req)));

      if (method === 'POST' && /^\/api\/members\/[^/]+\/plan$/.test(path)) {
        const memberId = path.split('/')[3];
        const body = await readJsonBody(req);
        return sendJson(res, 200, assignPlan(memberId, body.planId));
      }

      if (method === 'GET' && path === '/api/classes') return sendJson(res, 200, listClasses());
      if (method === 'POST' && path === '/api/classes') return sendJson(res, 201, createClass(await readJsonBody(req)));
      if (method === 'POST' && path === '/api/bookings') return sendJson(res, 201, createBooking(await readJsonBody(req)));

      if (method === 'POST' && path === '/api/access/authorize') {
        const decision = authorizeVisit(await readJsonBody(req));
        return sendJson(res, decision.decision === 'ALLOW' ? 200 : 403, decision);
      }

      if (method === 'GET' && path === '/api/access/feed') {
        const limit = Number(getQuery(req).get('limit') ?? 10);
        return sendJson(res, 200, listAccessFeed(Number.isNaN(limit) ? 10 : limit));
      }

      if (method === 'POST' && path === '/api/invoices') return sendJson(res, 201, createInvoice(await readJsonBody(req)));
      if (method === 'GET' && path === '/api/invoices') return sendJson(res, 200, listInvoices());

      if (method === 'POST' && path === '/api/webhooks/payments') {
        const result = processPaymentWebhook(await readJsonBody(req));
        return sendJson(res, result.duplicated ? 200 : 202, result);
      }

      return sendJson(res, 404, { message: `Route not found: ${method} ${path}` });
    } catch (error) {
      if (error instanceof ApiError) {
        return sendJson(res, error.status, { message: error.message, details: error.details ?? null });
      }

      return sendJson(res, 500, {
        message: 'Unexpected server error',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  };
}
