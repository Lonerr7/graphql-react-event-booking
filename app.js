import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { graphqlSchema } from './graphql/schema/graphqlSchema.js';
import { rootResolver } from './graphql/resolvers/rootResolver.js';

const app = express();

app.use(bodyParser.json());

dotenv.config({ path: './config.env' });

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: rootResolver,
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
