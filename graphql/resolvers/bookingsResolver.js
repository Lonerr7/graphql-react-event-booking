import { Booking } from '../../models/bookingModel.js';
import { Event } from '../../models/eventModel.js';
import { transformBooking } from '../../utils/transformBooking.js';
import { transformEvent } from '../../utils/transformEvent.js';

export const bookingsResolver = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();

      return bookings.map((booking) => transformBooking(booking));
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

      return transformBooking(newBooking);
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async ({ bookingId }) => {
    try {
      const bookingWithEvent = await Booking.findById(bookingId).populate(
        'event'
      );

      if (!bookingWithEvent) {
        throw new Error(
          'A booking with that id was not found. Try again later'
        );
      }

      const event = transformEvent(bookingWithEvent.event);

      await Booking.deleteOne({ _id: bookingId });

      return event;
    } catch (error) {
      throw error;
    }
  },
};
