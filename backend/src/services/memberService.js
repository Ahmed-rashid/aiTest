import { z } from 'zod';
import { store } from '../data/store.js';
import { ApiError, assertFound } from '../utils/errors.js';

const createMemberSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  planId: z.string().optional()
});

export function listMembers() {
  return store.members.map((member) => ({
    ...member,
    plan: store.plans.find((plan) => plan.id === member.planId) ?? null
  }));
}

export function createMember(payload) {
  const parsed = createMemberSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid member payload', parsed.error.flatten());
  }

  const planId = parsed.data.planId ?? 'plan-basic';
  const plan = store.plans.find((entry) => entry.id === planId);
  if (!plan) {
    throw new ApiError(400, 'Unknown plan selected');
  }

  if (store.members.some((member) => member.email === parsed.data.email)) {
    throw new ApiError(409, 'A member with this email already exists');
  }

  const member = {
    id: store.createId('mem'),
    fullName: parsed.data.fullName,
    email: parsed.data.email,
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
