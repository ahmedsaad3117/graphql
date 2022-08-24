import { GraphQLServer } from "graphql-yoga";

//Type definions (schema)
const typeDefs = `
    type Query {
      greating(name: String) : String!
      add(a: Number! , b: Number!) : Float!
       me: User!
       post: Post!
       add: Float!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int  
    }

    type Post {
      id: ID!
      title: String!
      body: String,!
      published: Boolean!
    }

`;

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: "12345",
        name: "Mike",
        email: "mike@example.com",
      };
    },
    post() {
      return {
        id: "12345",
        title: "frist Post",
        body: "this my frost post ever",
        published: true,
      };
    },
    greating(parent, args, ctx) {
      if (args.name) {
        return `Hi Mr(s): ${args.name}`;
      } else {
        return "Hello!";
      }
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is up on port 4000!");
});
