import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from './models/eventModel.js';
import { User } from './models/userModel.js';
import { getUser } from './utils/getUser.js';

const app = express();

app.use(bodyParser.json());

dotenv.config({ path: './config.env' });

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
        type User {
          _id: ID!
          email: String!
          password: String
          createdEvents: [Event!]
        }

        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
          creator: User!
        }

        input EventInput {
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        input UserInput {
          email: String!
          password: String!
        }

        type RootQuery {
          events: [Event!]!
        }

        type RootMutation {
          createEvent(eventInput: EventInput): Event
          createUser(userInput: UserInput): User
        }

        schema {
          query: RootQuery
          mutation: RootMutation
        }
    `),
    rootValue: {
      events: async () => {
        const events = await Event.find();

        return events.map((event) => ({
          ...event._doc,
          creator: getUser.bind(this, event._doc.creator),
        }));
      },
      createEvent: async (args) => {
        try {
          const { title, description, price, date } = args.eventInput;

          const newEvent = await Event.create({
            title,
            description,
            price: +price,
            date: new Date(date),
            creator: '6484106f9e725284caac61fe',
          });

          const eventCreator = await User.findById(newEvent.creator);

          if (!eventCreator) {
            throw new Error('User not found!');
          }

          eventCreator.createdEvents.push(newEvent);
          await eventCreator.save();

          return newEvent;
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

          console.log(newUser);

          return { email: newUser.email, password: null };
        } catch (error) {
          throw error;
        }
      },
    }, // all resolver functions (they need to match our schema endpoints by name)
    graphiql: true,
  })
);

const connectionLink = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphqlcluster.burlevo.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(connectionLink)
  .then(() => {
    // Starting a server only when we successfully connected to mongoDB
    console.log(`successfully connected to MONGODB`);
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
