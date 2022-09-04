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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
