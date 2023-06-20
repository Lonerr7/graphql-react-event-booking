import bcrypt from 'bcrypt';
import { User } from '../../models/userModel.js';
import { Event } from '../../models/eventModel.js';
import { Booking } from '../../models/bookingModel.js';
import { getUser } from '../../utils/getUser.js';
import { getEvents, getSingleEvent } from '../../utils/getEvents.js';

export const rootResolver = {
  events: async () => {
    const events = await Event.find();

    return events.map((event) => ({
      ...event._doc,
      creator: getUser.bind(this, event.creator),
      date: event._doc.date.toLocaleString(undefined, { dateStyle: 'short' }),
    }));
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();

      return bookings.map((booking) => ({
        ...booking._doc,
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        user: getUser.bind(this, booking.user),
        event: getSingleEvent.bind(this, booking.event),
      }));
    } catch (error) {
      throw error;
    }
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
  bookEvent: async ({ eventId }) => {
    try {
      const { _id } = await Event.findById(eventId);

      if (!_id) {
        throw new Error('No event found with that ID. Please try again later');
      }

      const newBooking = await Booking.create({
        user: '6484106f9e725284caac61fe',
        event: _id,
      });

      return {
        ...newBooking._doc,
        createdAt: new Date(newBooking._doc.createdAt).toISOString(),
        updatedAt: new Date(newBooking._doc.createdAt).toISOString(),
        event: getSingleEvent.bind(this, eventId),
        user: getUser.bind(this, newBooking.user),
      };
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async ({ bookingId }) => {
    try {
      const bookingWithEvent = await Booking.findById(bookingId).populate(
        'event'
      );

      console.log(bookingWithEvent);

      if (!bookingWithEvent) {
        throw new Error(
          'A booking with that id was not found. Try again later'
        );
      }
      const event = {
        ...bookingWithEvent.event._doc,
        creator: getUser.bind(this, bookingWithEvent.event.creator),
      };

      await Booking.deleteOne({ _id: bookingId });

      return event;
    } catch (error) {
      throw error;
    }
  },
}; // all resolver functions (they need to match our schema endpoints by name)
