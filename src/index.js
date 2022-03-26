import neo4j from 'neo4j-driver';
import { Neo4jGraphQL } from '@neo4j/graphql';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import { createServer } from 'http';
import express from 'express';

import dotenv from 'dotenv';
import { typeDefs } from './types';
import { getUser } from './middlewares/authHandler';

dotenv.config();

// GRAPHQL Server
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const neo4jGraphQL = new Neo4jGraphQL({ typeDefs, driver });

(async () => {
  const schema = await neo4jGraphQL.getSchema();

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        endpoint: '/graphql',
      }),
    ],
    context: async ({ req }) => {
      // get the user token from the headers
      const token = req.headers.authorization || '';

      // try to retrieve a user with the token
      await getUser(token);

      // optionally block the user
      // we could also check user roles/permissions here
      // if (!user) throw new AuthenticationError('you must be logged in');

      // add the user to the context
      return { driver };
    },
  });

  // Express Server
  const app = express();

  app.use(express.json());

  const httpServer = createServer(app);

  await server.start();

  server.applyMiddleware({ app });

  await httpServer.listen({ port: 4001 });

  console.log(
    `⚛ GraphQL server is ready at http://localhost:${
      httpServer.address().port
    }${server.graphqlPath}`
  );
})();
