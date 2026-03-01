import { store } from '../data/store.js';
import { ApiError, assertFound } from '../utils/errors.js';
import { requireObject, validate } from '../utils/validation.js';

export function createInvoice(payload) {
  const data = requireObject(payload, 'invoice payload');
  const memberId = validate.nonEmptyString(data.memberId, 'memberId');

  const member = store.members.find((entry) => entry.id === memberId);
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
  const data = requireObject(payload, 'payment webhook payload');
  const providerEventId = validate.nonEmptyString(data.providerEventId, 'providerEventId', 4);
  const memberId = validate.nonEmptyString(data.memberId, 'memberId');
  const status = validate.enumValue(data.status, 'status', ['succeeded', 'failed']);
  const amount = validate.positiveNumber(data.amount, 'amount');

  if (store.webhookEvents.has(providerEventId)) {
    return { duplicated: true };
  }

  const member = store.members.find((entry) => entry.id === memberId);
  assertFound(member, 'Member not found');

  if (status === 'succeeded') {
    member.debt = Math.max(member.debt - amount, 0);
  }

  store.webhookEvents.add(providerEventId);

  return {
    duplicated: false,
    memberId: member.id,
    debt: member.debt,
    status
  };
}

export function listInvoices() {
  return store.invoices;
}
