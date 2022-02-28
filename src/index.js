require('dotenv').config();
const { Neo4jGraphQL } = require('@neo4j/graphql');
const { ApolloServer } = require('apollo-server');
const neo4j = require('neo4j-driver');

const typeDefs = require('./types');

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
  const server = new ApolloServer({
    schema,
  });

  server.listen({ port: 4001 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
