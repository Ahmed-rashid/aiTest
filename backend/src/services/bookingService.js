import { store } from '../data/store.js';
import { ApiError, assertFound } from '../utils/errors.js';
import { requireObject, validate } from '../utils/validation.js';

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
  const data = requireObject(payload, 'class payload');
  const className = validate.nonEmptyString(data.className, 'className', 2);
  const instructor = validate.nonEmptyString(data.instructor, 'instructor', 2);
  const startsAt = validate.isoDateTimeString(data.startsAt, 'startsAt');
  const capacity = validate.positiveIntInRange(data.capacity, 'capacity', 100);

  const gymClass = {
    id: store.createId('class'),
    className,
    instructor,
    startsAt,
    capacity
  };

  store.classes.push(gymClass);
  return gymClass;
}

export function createBooking(payload) {
  const data = requireObject(payload, 'booking payload');
  const memberId = validate.nonEmptyString(data.memberId, 'memberId');
  const classId = validate.nonEmptyString(data.classId, 'classId');

  const member = store.members.find((entry) => entry.id === memberId);
  assertFound(member, 'Member not found');

  if (member.status !== 'active') {
    throw new ApiError(403, 'Inactive member cannot book classes');
  }

  const gymClass = store.classes.find((entry) => entry.id === classId);
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
