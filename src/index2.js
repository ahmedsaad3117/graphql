import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
  type Query {
    user: Person! 
  }

  type Person {
    id: ID!
    name: String!
    age: Int
  }
`;

const resolvers = {
  Query: {
    user() {
      return {
        id: "12345",
        name: "John",
        age: 22,
      };
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