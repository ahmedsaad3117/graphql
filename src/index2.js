import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
  type Query {
    hi: String!
    name: String!
    age: Float!
  }
`;

const resolvers = {
  Query: {
    hi() {
      return "Hello GraphQL!";
    },

    name() {
      return "Adam";
    },

    age() {
      return 5;
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is up on the default port 4000.");
});
