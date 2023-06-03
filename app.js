import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
          events: [String!]!
        }

        type RootMutation {
          createEvent(name: String): String
        }

        schema {
          query: RootQuery
          mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return ['Romantic cooking', 'Sailing', 'All night coding'];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    }, // all resolver functions (they need to match our schema endpoints by name)
    graphiql: true,
  })
);

app.listen(4000);
