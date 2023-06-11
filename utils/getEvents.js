import { Event } from '../models/eventModel.js';
import { getUser } from './getUser.js';

export const getEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });

    if (!events) {
      throw new Error('No events found!');
    }

    return events.map((event) => ({
      ...event._doc,
      creator: getUser.bind(this, event._doc.creator),
    }));
  } catch (error) {
    throw error;
  }
};
