import { store } from '../data/store.js';
import { ApiError } from '../utils/errors.js';
import { requireObject, validate } from '../utils/validation.js';

export function authorizeVisit(payload) {
  const data = requireObject(payload, 'check-in payload');
  const memberId = validate.nonEmptyString(data.memberId, 'memberId');
  const gate = validate.nonEmptyString(data.gate, 'gate', 2);

  const member = store.members.find((entry) => entry.id === memberId);

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
    gate,
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
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new ApiError(400, 'Invalid limit');
  }
  return store.visits.slice(0, limit);
}
