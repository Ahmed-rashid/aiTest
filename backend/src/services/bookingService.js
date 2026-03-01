import { z } from 'zod';
import { store } from '../data/store.js';
import { ApiError, assertFound } from '../utils/errors.js';

const createClassSchema = z.object({
  className: z.string().min(2),
  instructor: z.string().min(2),
  startsAt: z.string().datetime(),
  capacity: z.number().int().positive().max(100)
});

const bookingSchema = z.object({
  memberId: z.string().min(1),
  classId: z.string().min(1)
});

export function listClasses() {
  return store.classes.map((session) => {
    const reserved = store.bookings.filter((booking) => booking.classId === session.id && booking.status === 'confirmed').length;
    const waitlist = store.bookings.filter((booking) => booking.classId === session.id && booking.status === 'waitlist').length;

    return {
      ...session,
      reserved,
      waitlist,
      remaining: Math.max(session.capacity - reserved, 0)
    };
  });
}

export function createClass(payload) {
  const parsed = createClassSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid class payload', parsed.error.flatten());
  }

  const gymClass = {
    id: store.createId('class'),
    ...parsed.data
  };

  store.classes.push(gymClass);
  return gymClass;
}

export function createBooking(payload) {
  const parsed = bookingSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid booking payload', parsed.error.flatten());
  }

  const member = store.members.find((entry) => entry.id === parsed.data.memberId);
  assertFound(member, 'Member not found');

  if (member.status !== 'active') {
    throw new ApiError(403, 'Inactive member cannot book classes');
  }

  const gymClass = store.classes.find((entry) => entry.id === parsed.data.classId);
  assertFound(gymClass, 'Class not found');

  if (store.bookings.some((entry) => entry.memberId === member.id && entry.classId === gymClass.id)) {
    throw new ApiError(409, 'Member already has a booking for this class');
  }

  const confirmedCount = store.bookings.filter((entry) => entry.classId === gymClass.id && entry.status === 'confirmed').length;
  const status = confirmedCount < gymClass.capacity ? 'confirmed' : 'waitlist';

  const booking = {
    id: store.createId('booking'),
    memberId: member.id,
    classId: gymClass.id,
    status,
    createdAt: new Date().toISOString()
  };

  store.bookings.push(booking);
  return booking;
}
