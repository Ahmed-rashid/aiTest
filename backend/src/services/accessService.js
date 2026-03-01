import { z } from 'zod';
import { store } from '../data/store.js';
import { ApiError } from '../utils/errors.js';

const authorizeSchema = z.object({
  memberId: z.string().min(1),
  gate: z.string().min(2)
});

export function authorizeVisit(payload) {
  const parsed = authorizeSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid check-in payload', parsed.error.flatten());
  }

  const member = store.members.find((entry) => entry.id === parsed.data.memberId);

  if (!member) {
    return {
      decision: 'DENY',
      reason: 'MEMBER_NOT_FOUND'
    };
  }

  if (member.status !== 'active') {
    return {
      decision: 'DENY',
      reason: 'INACTIVE_MEMBERSHIP'
    };
  }

  if (member.debt > 50) {
    return {
      decision: 'DENY',
      reason: 'OUTSTANDING_DEBT'
    };
  }

  const visit = {
    id: store.createId('visit'),
    memberId: member.id,
    gate: parsed.data.gate,
    status: 'ALLOW',
    timestamp: new Date().toISOString()
  };

  store.visits.unshift(visit);

  return {
    decision: 'ALLOW',
    reason: 'OK',
    visit
  };
}

export function listAccessFeed(limit = 10) {
  return store.visits.slice(0, limit);
}
