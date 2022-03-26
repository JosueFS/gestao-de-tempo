import axios from 'axios';
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

// the first thing you have to do is acess this https://app.clickup.com/api?client_id=UQC36DXVVEQTNM46Y4R5IN4E8UO7HD6C&redirect_uri=https://global.consent.azure-apim.net/

// this information is for each user only
const CLIENT_ID = 'UQC36DXVVEQTNM46Y4R5IN4E8UO7HD6C';
const CLIENT_SECRET =
  'QA88MWS1NFI4Q1VWQX27H05GQ5GYXERA7AJKDYCUNR3YVYS82MYDWUZRRQTWY21T';
const CODE = 'M2M4ZFRZFR6VN0WRC8QI5X79OVWRSER4';

// this request is to return the token
let task;

axios({
  method: 'post',
  url: `https://api.clickup.com/api/v2/oauth/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${CODE}`,
})
  .then((res) => {
    const token = res.data.access_token;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios({
      method: 'get',
      url: 'https://api.clickup.com/api/v2/task/2a1y6q7',
      headers,
    })
      .then((response) => {
        console.log('Status:', response);
        console.log('Headers:', JSON.stringify(response.headers));
        console.log('Response:', response.body);

        task = response.body;

        console.log(task);
      })
      .catch((e) => console.log(e));
  })
  .catch((e) => console.log(e));

// the request already have a token

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
