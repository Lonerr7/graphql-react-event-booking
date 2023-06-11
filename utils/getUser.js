import { User } from '../models/userModel.js';
import { getEvents } from './getEvents.js';

export const getUser = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('No user found with that id!');
    }

    return {
      ...user._doc,
      createdEvents: getEvents.bind(this, user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};
