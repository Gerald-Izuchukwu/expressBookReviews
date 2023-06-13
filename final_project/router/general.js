const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return new Promise((resolve, reject) => {
    const response = {
      message: "success",
      books: books
    };

    resolve(response);
  })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
    
    getBookByISBN(isbn)
      .then(book => {
        res.status(200).json({
          message: "Get books by ISBN",
          book
        });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({
          message: "Internal server error"
        });
      });
  });
  
  function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      // Assuming `books` is accessible here
  
      const book = books[isbn];
  
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });
  }
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    getBooksByAuthor(author)
      .then(authorBooks => {
        if (authorBooks.length === 0) {
          return res.status(404).json({ message: 'No books found for the author' });
        }
        res.json(authorBooks);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      });
  });
  
  function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      // Assuming `books` is accessible here
  
      const authorBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  
      resolve(authorBooks);
    });
  }
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    getBooksByTitle(title)
      .then(titleBooks => {
        if (titleBooks.length === 0) {
          return res.status(404).json({ message: 'No books found for the title' });
        }
        res.json(titleBooks);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      });
  });
  
  function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
      // Assuming `books` is accessible here
  
      const titleBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
  
      resolve(titleBooks);
    });
  }
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);

  

  return res.json(books[isbn].reviews);
});

module.exports.general = public_users;
