import { getUser } from './getUser.js';

export const transformEvent = (event) => ({
  ...event._doc,
  creator: getUser.bind(this, event.creator),
  date: event._doc.date.toLocaleString(undefined, { dateStyle: 'short' }),
});
