import { z } from 'zod';
import { store } from '../data/store.js';
import { ApiError, assertFound } from '../utils/errors.js';

const createInvoiceSchema = z.object({
  memberId: z.string().min(1)
});

const webhookSchema = z.object({
  providerEventId: z.string().min(4),
  memberId: z.string().min(1),
  status: z.enum(['succeeded', 'failed']),
  amount: z.number().positive()
});

export function createInvoice(payload) {
  const parsed = createInvoiceSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid invoice payload', parsed.error.flatten());
  }

  const member = store.members.find((entry) => entry.id === parsed.data.memberId);
  assertFound(member, 'Member not found');

  const plan = store.plans.find((entry) => entry.id === member.planId);
  assertFound(plan, 'Plan not found for member');

  const invoice = {
    id: store.createId('inv'),
    memberId: member.id,
    amount: plan.monthlyPrice,
    status: 'open',
    createdAt: new Date().toISOString()
  };

  store.invoices.push(invoice);
  member.debt += plan.monthlyPrice;
  return invoice;
}

export function processPaymentWebhook(payload) {
  const parsed = webhookSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid payment webhook payload', parsed.error.flatten());
  }

  if (store.webhookEvents.has(parsed.data.providerEventId)) {
    return { duplicated: true };
  }

  const member = store.members.find((entry) => entry.id === parsed.data.memberId);
  assertFound(member, 'Member not found');

  if (parsed.data.status === 'succeeded') {
    member.debt = Math.max(member.debt - parsed.data.amount, 0);
  }

  store.webhookEvents.add(parsed.data.providerEventId);

  return {
    duplicated: false,
    memberId: member.id,
    debt: member.debt,
    status: parsed.data.status
  };
}

export function listInvoices() {
  return store.invoices;
}
