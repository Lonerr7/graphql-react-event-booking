import { User } from '../../models/userModel.js';
import bcrypt from 'bcrypt';

export const authResolver = {
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
};
