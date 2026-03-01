import { Router } from 'express';
import { store } from '../data/store.js';
import { createBooking, createClass, listClasses } from '../services/bookingService.js';
import { authorizeVisit, listAccessFeed } from '../services/accessService.js';
import { createInvoice, listInvoices, processPaymentWebhook } from '../services/billingService.js';
import { assignPlan, createMember, listMembers } from '../services/memberService.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'fitness-gym-backend', at: new Date().toISOString() });
});

apiRouter.get('/overview', (_req, res) => {
  const totalMembers = store.members.length;
  const activeMembers = store.members.filter((member) => member.status === 'active').length;
  const todaysCheckins = store.visits.filter((visit) => visit.timestamp.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
  const monthlyRevenue = store.invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  res.json({
    kpis: {
      totalMembers,
      activeMembers,
      todaysCheckins,
      monthlyRevenue,
      collectionRate: totalMembers === 0 ? 100 : Number((((totalMembers * 100) - store.members.reduce((sum, m) => sum + m.debt, 0)) / (totalMembers * 100)).toFixed(2))
    },
    alerts: [
      `${store.members.filter((member) => member.debt > 0).length} members with outstanding debt`,
      `${store.bookings.filter((booking) => booking.status === 'waitlist').length} bookings in waitlist`
    ]
  });
});

apiRouter.get('/plans', (_req, res) => {
  res.json(store.plans);
});

apiRouter.get('/members', (_req, res) => {
  res.json(listMembers());
});

apiRouter.post('/members', (req, res) => {
  const member = createMember(req.body);
  res.status(201).json(member);
});

apiRouter.post('/members/:id/plan', (req, res) => {
  const member = assignPlan(req.params.id, req.body.planId);
  res.json(member);
});

apiRouter.get('/classes', (_req, res) => {
  res.json(listClasses());
});

apiRouter.post('/classes', (req, res) => {
  const gymClass = createClass(req.body);
  res.status(201).json(gymClass);
});

apiRouter.post('/bookings', (req, res) => {
  const booking = createBooking(req.body);
  res.status(201).json(booking);
});

apiRouter.post('/access/authorize', (req, res) => {
  const decision = authorizeVisit(req.body);
  const status = decision.decision === 'ALLOW' ? 200 : 403;
  res.status(status).json(decision);
});

apiRouter.get('/access/feed', (req, res) => {
  const limit = Number(req.query.limit ?? 10);
  res.json(listAccessFeed(Number.isNaN(limit) ? 10 : limit));
});

apiRouter.post('/invoices', (req, res) => {
  const invoice = createInvoice(req.body);
  res.status(201).json(invoice);
});

apiRouter.get('/invoices', (_req, res) => {
  res.json(listInvoices());
});

apiRouter.post('/webhooks/payments', (req, res) => {
  const result = processPaymentWebhook(req.body);
  res.status(result.duplicated ? 200 : 202).json(result);
});
