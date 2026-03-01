import { store } from '../data/store.js';
import { ApiError, assertFound } from '../utils/errors.js';
import { requireObject, validate } from '../utils/validation.js';

export function listMembers() {
  return store.members.map((member) => ({
    ...member,
    plan: store.plans.find((plan) => plan.id === member.planId) ?? null
  }));
}

export function createMember(payload) {
  const data = requireObject(payload, 'member payload');
  const fullName = validate.nonEmptyString(data.fullName, 'fullName', 2);
  const email = validate.email(data.email, 'email');
  const planId = data.planId === undefined ? 'plan-basic' : validate.nonEmptyString(data.planId, 'planId');

  const plan = store.plans.find((entry) => entry.id === planId);
  if (!plan) {
    throw new ApiError(400, 'Unknown plan selected');
  }

  if (store.members.some((member) => member.email === email)) {
    throw new ApiError(409, 'A member with this email already exists');
  }

  const member = {
    id: store.createId('mem'),
    fullName,
    email,
    status: 'active',
    planId,
    debt: 0,
    createdAt: new Date().toISOString()
  };

  store.members.push(member);
  return member;
}

export function assignPlan(memberId, planId) {
  const member = store.members.find((entry) => entry.id === memberId);
  assertFound(member, 'Member not found');

  const plan = store.plans.find((entry) => entry.id === planId);
  assertFound(plan, 'Plan not found');

  member.planId = plan.id;
  return member;
}
