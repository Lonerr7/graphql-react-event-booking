import { transformEvent } from '../../utils/transformEvent.js';
import { Event } from '../../models/eventModel.js';
import { User } from '../../models/userModel.js';

export const eventsResolver = {
  events: async () => {
    const events = await Event.find();

    return events.map((event) => transformEvent(event));
  },
  createEvent: async (args) => {
    try {
      const { title, description, price, date } = args.eventInput;

      const newEvent = await Event.create({
        title,
        description,
        price: +price,
        date: new Date(date), //!
        creator: '6484106f9e725284caac61fe',
      });

      const eventCreator = await User.findById(newEvent.creator);

      if (!eventCreator) {
        throw new Error('User not found!');
      }

      eventCreator.createdEvents.push(newEvent);
      await eventCreator.save();

      return {
        ...newEvent._doc,
        creator: { ...eventCreator._doc },
      };
    } catch (error) {
      throw error;
    }
  },
};
