const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const booksArray = Object.values(books);

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
  
    // Check if username already exists
    if (users[username]) {
      return res.status(409).send('Username already exists');
    }
  
    // Register the new user
    users[username] = { password };
    res.status(201).send('User registered successfully');
});

// Get the book list available in the shop
  // Route to get the list of books
public_users.get('/', function (req, res) {
    return res.json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = booksArray.find(b => b.isbn === isbn);
  
    if (book) {
      return res.json(JSON.stringify(book, null, 2));
    } else {
      return res.status(404).send('Book not found');
    }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = booksArray.filter(b => b.author === author);
  
    if (booksByAuthor.length > 0) {
      return res.json(JSON.stringify(booksByAuthor, null, 2));
    } else {
      return res.status(404).send('No books found for the specified author');
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
        const title = req.params.title;
        const book = booksArray.find(b => b.title === title);
      
        if (book) {
         return res.json(JSON.stringify(book, null, 2));
        } else {
            return res.status(404).send('Book not found');
        }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    
        const isbn = req.params.isbn;
        const book = booksArray.find(b => b.isbn === isbn);
      
        if (book && book.reviews) {
          return res.json(JSON.stringify(book.reviews, null, 2));
        } else {
          return res.status(404).send('No reviews found for the specified ISBN');
        }
});

module.exports.general = public_users;
