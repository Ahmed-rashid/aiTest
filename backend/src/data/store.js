import { randomUUID } from 'node:crypto';

const now = Date.now();

const plans = [
  { id: 'plan-basic', name: 'Basic', monthlyPrice: 49, visitLimit: 12 },
  { id: 'plan-pro', name: 'Pro', monthlyPrice: 79, visitLimit: 40 },
  { id: 'plan-unlimited', name: 'Unlimited', monthlyPrice: 109, visitLimit: null }
];

const members = [
  {
    id: 'mem-1',
    fullName: 'Sophia Reed',
    email: 'sophia.reed@example.com',
    status: 'active',
    planId: 'plan-pro',
    debt: 0,
    createdAt: new Date(now - 86400000 * 12).toISOString()
  },
  {
    id: 'mem-2',
    fullName: 'Mason Cole',
    email: 'mason.cole@example.com',
    status: 'active',
    planId: 'plan-basic',
    debt: 20,
    createdAt: new Date(now - 86400000 * 31).toISOString()
  }
];

const classes = [
  {
    id: 'class-1',
    className: 'HIIT Express',
    instructor: 'Maya',
    startsAt: new Date(now + 3600000).toISOString(),
    capacity: 24
  },
  {
    id: 'class-2',
    className: 'Power Yoga',
    instructor: 'Noah',
    startsAt: new Date(now + 7200000).toISOString(),
    capacity: 20
  }
];

const bookings = [];
const visits = [];
const invoices = [];
const webhookEvents = new Set();

export const store = {
  plans,
  members,
  classes,
  bookings,
  visits,
  invoices,
  webhookEvents,
  createId(prefix) {
    return `${prefix}-${randomUUID()}`;
  }
};
