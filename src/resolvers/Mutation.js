import { v4 as uuidv4 } from "uuid";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const isEmailTaken = db.users.some(
      (user) => user.email === args.data.email
    );

    if (isEmailTaken) {
      throw new Error("Email taken.");
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);

    return user;
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => {
      return user.id === args.id;
    });

    if (userIndex === -1) {
      throw new Error("Thier is no match");
    }

    const deletedUser = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });

    return deletedUser[0];
  },

  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User not found!");
    }

    if (typeof data.email === "string") {
      isEmailTaken = db.users.some((user) => user.email === data.email);

      if (isEmailTaken) {
        throw new Error("This Email is already exaist!");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name === data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age == data.age;
    }

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const isUserExists = db.users.some((user) => user.id === args.data.author);

    if (!isUserExists) {
      throw new Error("User not found");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => {
      return post.id === args.id;
    });

    if (postIndex === -1) {
      throw new Error("Post not found!");
    }

    let [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => {
      return comment.post !== post.id;
    });

    pubsub.publish("post", {
      post: {
        mutation: "DELETED",
        data: post,
      },
    });

    return post;
  },

  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error("This post id not exist!");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish("post", {
          post: { mutation: "DELETED", data: originalPost },
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      } else if (originalPost.published) {
        pubsub.publish("post", {
          post: {
            mutation: "UPDATED",
            data: post,
          },
        });
      }
    }

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
    const isPostExistsAndPublished = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );
    const isUserExists = db.users.some((user) => user.id === args.data.author);

    if (!isPostExistsAndPublished && !isUserExists) {
      throw new Error("User or post not exist!");
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, { comment });

    return comment;
  },

  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex((comment) => {
      return args.id === comment.id;
    });

    if (commentIndex === -1) {
      throw new Error("This comment not found!");
    }

    const deletedComment = db.comments.splice(commentIndex, 1);

    return deletedComment[0];
  },

  updateComment(parent, args, { db }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("This Comment id not exist!");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    return comment;
  },
};

export default Mutation;
