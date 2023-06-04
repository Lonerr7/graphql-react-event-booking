import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from './models/eventModel.js';

const app = express();

app.use(bodyParser.json());

const events = [];

dotenv.config({ path: './config.env' });

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        input EventInput {
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        type RootQuery {
          events: [Event!]!
        }

        type RootMutation {
          createEvent(eventInput: EventInput): Event
        }

        schema {
          query: RootQuery
          mutation: RootMutation
        }
    `),
    rootValue: {
      events: async () => {
        return await Event.find();
      },
      createEvent: async (args) => {
        const { title, description, price, date } = args.eventInput;

        const newEvent = await Event.create({
          title,
          description,
          price: +price,
          date: new Date(date),
        });

        return newEvent;

        // return newEvent
        //   .save()
        //   .then((result) => {
        //     console.log(result);
        //     return { ...result._doc };
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     throw err;
        //   });
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
