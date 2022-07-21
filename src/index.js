import { GraphQLServer } from "graphql-yoga";

//Type definions (schema)
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        me: User!
        post: Post!
        line: String!
        add(a: Float, b: Float): Float!
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
        body: String!
        published: Boolean!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      if (args.name) {
        return `Hellow ${args.name} `;
      } else {
        return `Hello!`;
      }
    },
    me() {
      return {
        id: "123456",
        name: "Ahmed",
        email: "ahmed@gmail.com",
        age: 28,
      };
    },
    post() {
      return {
        id: "4561",
        title: "ASDcsd",
        body: "Body",
        published: true,
      };
    },
    line() {
      return "from Line";
    },
 
    add(parent,args){
        return `${args.a + args.b}`
    }
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is up on port 4000!");
});
