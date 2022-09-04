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

  createPost(parent, args, { db }, info) {
    const isUserExists = db.users.some((user) => user.id === args.data.author);

    if (!isUserExists) {
      throw new Error("User not found");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    return post;
  },

  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => {
      return post.id === args.id;
    });

    if (postIndex === -1) {
      throw new Error("Post not found!");
    }

    let deletedPost = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => {
      return comment.post !== deletedPost[0].id;
    });

    return deletedPost[0];
  },

  createComment(parent, args, { db }, info) {
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
};


export default Mutation 