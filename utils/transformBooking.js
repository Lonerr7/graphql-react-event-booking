import { dateToString } from './transformDate.js';
import { getUser } from './getUser.js';
import { getSingleEvent } from './getEvents.js';

export const transformBooking = (booking) => ({
  ...booking._doc,
  createdAt: dateToString(booking._doc.updatedAt),
  updatedAt: dateToString(booking._doc.updatedAt),
  user: getUser.bind(this, booking.user),
  event: getSingleEvent.bind(this, booking.event),
});
