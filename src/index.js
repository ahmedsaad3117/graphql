import { GraphQLServer } from "graphql-yoga";

//Demo Data
const users = [
  {
    id: "1",
    name: "Ahmed",
    email: "ahmed@gmail.com",
    age: 15,
  },
  {
    id: "2",
    name: "khald",
    email: "khald@gmail.com",
  },
  {
    id: "1",
    name: "saad",
    email: "saas@gmail.com",
    age: 22,
  },
];

const posts = [
  {
    id: "10",
    title: "Post1",
    body: "this the frist post",
    published: true,
  },
  {
    id: "12",
    title: "Post2",
    body: "this the 2 post",
    published: true,
  },
  {
    id: "20",
    title: "Post3",
    body: "",
    published: false,
  },
];

//Type definions (schema)
const typeDefs = `
    type Query {
      users(query: String): [User!]!
      me: User!
      posts(query: String): [Post!]!
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

//Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    me() {
      return {
        id: "12345",
        name: "Mike",
        email: "mike@example.com",
        
      };
    },

    posts(parent, args, ctx, info) {
      +console.log(args);
      if (!args.query) {
        return posts;
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isBodyMatch || isTitleMatch;
      });
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
