require('dotenv').config();
const { Neo4jGraphQL } = require('@neo4j/graphql');
const { ApolloServer } = require('apollo-server');
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core');

const neo4j = require('neo4j-driver');

const typeDefs = require('./types');

const axios = require('axios');


// the first thing you have to do is acess this https://app.clickup.com/api?client_id=UQC36DXVVEQTNM46Y4R5IN4E8UO7HD6C&redirect_uri=https://global.consent.azure-apim.net/

// 

// this information is for each user only
const CLIENT_ID = 'UQC36DXVVEQTNM46Y4R5IN4E8UO7HD6C';
const CLIENT_SECRET ='QA88MWS1NFI4Q1VWQX27H05GQ5GYXERA7AJKDYCUNR3YVYS82MYDWUZRRQTWY21T';
const CODE = 'M2M4ZFRZFR6VN0WRC8QI5X79OVWRSER4'

// this request is to return the token
const task = []

axios({ 
  method: 'post',
  url:`https://api.clickup.com/api/v2/oauth/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${CODE}`,
     }).then((res)=>{

       const token = res.data.access_token

       

       const headers = {
        Authorization: `Bearer ${token}`
    }

    axios({ 
      method: 'get',
      url: 'https://api.clickup.com/api/v2/task/2a1y6q7',
      headers,
         }).then((res)=>{
          
              console.log('Status:', res);
              console.log('Headers:', JSON.stringify(res.headers));
              console.log('Response:', res.body);

          task = res.body
          
         } )
          .catch(e => console.log(e))

     }  )
      .catch(e => console.log(e))




// the request already have a token 


const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  server.listen({ port: 4001 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
