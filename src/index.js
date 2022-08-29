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
    id: "3",
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
    author: "1",
  },
  {
    id: "12",
    title: "Post2",
    body: "this the 2 post",
    published: true,
    author: "1",
  },
  {
    id: "20",
    title: "Post3",
    body: "",
    published: false,
    author: "2",
  },
];

const comments = [
  {
    id: "1",
    text: "comment one",
    author: "1",
    post: "10",
  },
  {
    id: "2",
    text: "comment 2nd",
    author: "1",
    post: "10",
  },
  {
    id: "3",
    text: "comment 3rd",
    author: "2",
    post: "20",
  },
  {
    id: "4",
    text: "comment 4th",
    author: "2",
    post: "10",
  },
];

//Type definions (schema)
const typeDefs = `
    type Query {
      users(query: String): [User!]!
      me: User!
      posts(query: String): [Post!]!
      comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int  
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comments: [Comment!]!
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
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

    comments(parent, args, ctx, info) {
      return comments;
    },

    me() {
      return {
        id: "12345",
        name: "Mike",
        email: "mike@example.com",
      };
    },

    posts(parent, args, ctx, info) {
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
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info){
      return comments.filter((comment)=>{
        return comment.post === parent.id 
      })
    }

  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.autho;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
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
