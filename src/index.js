import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

//Demo Data
let users = [
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

let posts = [
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

let comments = [
  {
    id: "1",
    text: "comment one",
    author: "1",
    post: "12",
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

    type Mutation {
      createUser(data: CreateUserInput!): User!
      deleteUser(id: ID!) : User!
      createPost(data: CreatePostInput!): Post!
      createComment(data: CreateCommentInput!) : Comment!
    }

    input CreateUserInput {
      name: String!
      email: String!
      age: Int
    }

    input CreatePostInput {
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    }

    input CreateCommentInput {
      text: String!
      author: ID!
      post: ID!
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

  Mutation: {
    createUser(parent, args, ctx, info) {
      const isEmailTaken = users.some((user) => user.email === args.data.email);

      if (isEmailTaken) {
        throw new Error("Email taken.");
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },

    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => {
        return user.id === args.id;
      });

      if (userIndex === -1) {
        throw new Error("Thier is no match");
      }

      const deletedUser = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      });

      return deletedUser[0];
    },

    createPost(parent, args, ctx, info) {
      const isUserExists = users.some((user) => user.id === args.data.author);

      if (!isUserExists) {
        throw new Error("User not found");
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(post);

      return post;
    },

    createComment(parent, args, ctx, info) {
      const isPostExistsAndPublished = posts.some(
        (post) => post.id === args.data.post && post.published
      );
      const isUserExists = users.some((user) => user.id === args.data.author);

      if (!isPostExistsAndPublished && !isUserExists) {
        throw new Error("User or post not exist!");
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      comments.push(comment);

      return comment;
    },
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },

    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
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
        return user.id === parent.author;
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
