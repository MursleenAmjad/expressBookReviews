const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Assuming Object Key is ISBN of the book
  const isbn = req.params.isbn;
  const getBooks = new Promise((resolve, reject) => {
    let isbnNum = parseInt(isbn);
    if (books[isbnNum]) {
      resolve(books[isbnNum]);
    } else {
      reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
    }
  });
  getBooks.then(
    (result) => res.status(200).send(JSON.stringify(result, null, 4)),
    (error) => res.status(error.status).json({ message: error.message })
  );
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const getBooks = new Promise((resolve, reject) => {
    const searchedBook = {};
    for (const index in books) {
      if (books[index].author === author) {
        searchedBook[index] = books[index];
      }
    }
    // checking if object is empty
    if (Object.keys(searchedBook).length > 0) {
      resolve(searchedBook);
    } else {
      reject({ status: 404, message: `Book by author ${author} not found` });
    }
  });
  getBooks.then(
    (result) => res.status(200).send(JSON.stringify(result, null, 4)),
    (error) => res.status(error.status).json({ message: error.message })
  );
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const getBooks = new Promise((resolve, reject) => {
    const searchedBook = {};
    for (const index in books) {
      if (books[index].title === title) {
        searchedBook[index] = books[index];
      }
    }
    // checking if object is empty
    if (Object.keys(searchedBook).length > 0) {
      resolve(searchedBook);
    } else {
      reject({ status: 404, message: `Book with title ${title} not found` });
    }
  });
  getBooks.then(
    (result) => res.status(200).send(JSON.stringify(result, null, 4)),
    (error) => res.status(error.status).json({ message: error.message })
  );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  // Assuming Object Key is ISBN of the book
  const isbn = req.params.isbn;
  const searchedBook = books[isbn];
  if (searchedBook) {
    return res.status(200).send(JSON.stringify(searchedBook.reviews, null, 4));
  } else {
    return res.status(203).json({});
  }
});

module.exports.general = public_users;
