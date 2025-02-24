// auth_users.js

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: 'newuser', password: 'newpassword' } // Sample user for testing
];

const isValid = (username) => { 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { 
  return users.some(user => user.username === username && user.password === password);
}

// Secret key for JWT signing and encryption
const secretKey = 'your_secret_key';

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    req.session.token = token;
    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query;
  const token = req.session.token;

  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized: Invalid token');
    }

    const username = decoded.username;
    const book = books.find(b => b.isbn === isbn);

    if (!book) {
      return res.status(404).send('Book not found');
    }

    if (!book.reviews) {
      book.reviews = {};
    }

    book.reviews[username] = review;

    res.status(200).json({ message: 'Review added/modified successfully' });
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const token = req.session.token;

  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized: Invalid token');
    }

    const username = decoded.username;
    const book = books.find(b => b.isbn === isbn);

    if (!book) {
      return res.status(404).send('Book not found');
    }

    if (book.reviews && book.reviews[username]) {
      delete book.reviews[username];
      res.status(200).json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).send('Review not found');
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
