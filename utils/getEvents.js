import { Event } from '../models/eventModel.js';
import { transformEvent } from './transformEvent.js';

export const getEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });

    if (!events) {
      throw new Error('No events found!');
    }

    return events.map((event) => transformEvent(event));
  } catch (error) {
    throw error;
  }
};

export const getSingleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);

    return transformEvent(event);
  } catch (error) {
    throw error;
  }
};
