const express = require('express');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Provide username and password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_books = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if(books[key].author === author) {
      filtered_books.push(books[key]);
    }
  });
  return res.status(200).send(JSON.stringify(filtered_books, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_books = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if(books[key].title === title) {
      filtered_books.push(books[key]);
    }
  });
  return res.status(200).send(JSON.stringify(filtered_books, null, 4));
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

// =======================================================
// Tasks 10-13: Async-Await / Promises implementation using Axios
// =======================================================

// Task 10: Get all books using Async-Await
public_users.get('/async/books', async function (req, res) {
  try {
    let response = await new Promise((resolve, reject) => {
      resolve(books);
    });
    return res.status(200).send(JSON.stringify(response, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Get book details based on ISBN using Async-Await
public_users.get('/async/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    let response = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
    return res.status(200).send(JSON.stringify(response, null, 4));
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Task 12: Get book details based on Author using Async-Await
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    let response = await new Promise((resolve, reject) => {
      let filtered_books = [];
      Object.keys(books).forEach((key) => {
        if (books[key].author === author) {
          filtered_books.push(books[key]);
        }
      });
      resolve(filtered_books);
    });
    return res.status(200).send(JSON.stringify(response, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error filtering books by author"});
  }
});

// Task 13: Get book details based on Title using Async-Await
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    let response = await new Promise((resolve, reject) => {
      let filtered_books = [];
      Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
          filtered_books.push(books[key]);
        }
      });
      resolve(filtered_books);
    });
    return res.status(200).send(JSON.stringify(response, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error filtering books by title"});
  }
});

module.exports.general = public_users;