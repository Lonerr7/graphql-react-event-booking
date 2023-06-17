import bcrypt from 'bcrypt';
import { User } from '../../models/userModel.js';
import { Event } from '../../models/eventModel.js';
import { getUser } from '../../utils/getUser.js';

export const rootResolver = {
  events: async () => {
    const events = await Event.find();

    return events.map((event) => ({
      ...event._doc,
      creator: getUser.bind(this, event._doc.creator),
      date: event._doc.date.toLocaleString(undefined, { dateStyle: 'short' }),
    }));
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

  createUser: async (args) => {
    // Checking if user with the exact same email is already created
    try {
      const { email, password } = args.userInput;
      const possibleUser = await User.findOne({ email });

      if (possibleUser) {
        throw new Error('User exists already.');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        email,
        password: hashedPassword,
      });

      return { email: newUser.email, password: null };
    } catch (error) {
      throw error;
    }
  },
}; // all resolver functions (they need to match our schema endpoints by name)
