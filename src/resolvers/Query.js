const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },

  comments(parent, args, { db }, info) {
    return db.comments;
  },

  me() {
    return {
      id: "12345",
      name: "Mike",
      email: "mike@example.com",
    };
  },

  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }

    return db.posts.filter((post) => {
      const isTitleMatch = post.title
        .toLowerCase()
        .includes(args.query.toLowerCase());

      const isBodyMatch = post.body
        .toLowerCase()
        .includes(args.query.toLowerCase());

      return isBodyMatch || isTitleMatch;
    });
  },
};


export default Query