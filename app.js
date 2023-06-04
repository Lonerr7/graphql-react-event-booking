import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();

app.use(bodyParser.json());

const events = [];

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
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const { title, description, price, date } = args.eventInput;

        const newEvent = {
          _id: Math.random().toString(),
          title,
          description,
          price: +price,
          date: date,
        };

        events.push(newEvent);

        return newEvent;
      },
    }, // all resolver functions (they need to match our schema endpoints by name)
    graphiql: true,
  })
);

app.listen(4000);
