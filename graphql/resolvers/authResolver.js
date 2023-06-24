import { User } from '../../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const authResolver = {
  createUser: async ({ userInput }) => {
    // Checking if user with the exact same email is already created
    try {
      const { email, password } = userInput;
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
  logIn: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Email or password is incorrect!');
      }

      const isPasswordEqual = await bcrypt.compare(password, user.password);

      if (!isPasswordEqual) {
        throw new Error('Email or password is incorrect!');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        userId: user.id,
        token,
        tokenExpiration: 1,
      };
    } catch (error) {
      throw error;
    }
  },
};
