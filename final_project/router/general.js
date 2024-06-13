const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

//TASK #6
public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if(username && password){
    if(!isValid(username)){
      users.push({"username":username,"password":password})
      return res.status(200).json({message:"User succesfully registered."})
    }else{
      return res.status(404).json({message:"User already exist."})
    }
  }
  return res.status(404).json({message:"Unable to register."})
});

// TASK #1
public_users.get('/',function (req, res) {
  try{
    res.json(books);
  }catch(err){
    console.error(error);
    res.status(500).json({message:"Error Retrieving books"})
  }
});
// TASK #2
public_users.get('/isbn/:isbn',function (req, res) {
  try{
    const isbn = req.params.isbn;
    //res.send(books[isbn])
    if(books[isbn]){
      return res.json(books[isbn])
    }else{
      return res.status(404).json({message:"Book not found"})
    }
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});
  
// TASK #3
public_users.get('/author/:author',function (req, res) {
  try{
    const author = req.params.author;
    const matchBooks = [];

    const bookKeys = Object.keys(books);

    for(const key of bookKeys){
      const book = books[key];
      if(book.author === author){
        matchBooks.push(book);
      }
  }
  if(matchBooks.length > 0 ){
    res.json(matchBooks);
  }else{
    res.status(404).json({message:"No books found by the author"});
  }
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// TASK #4
public_users.get('/title/:title',function (req, res) {
  try{
    const title = req.params.title.toLowerCase();
  const matchBooks = []

  const bookKeys = Object.keys(books)

  for(const key of bookKeys){
    const book = books[key];
    if(book.title.toLowerCase() === title.toLowerCase()){
      matchBooks.push(book);
    }
  }

  if(matchBooks.length > 0){
    res.json(matchBooks);
  }else{
    res.status(404).json({message:"No books found with this title"})
  }
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Error retrieving books" });
  }
});

//  TASK #5
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]
  if(book){
    const reviews = book.reviews;
    res.json(reviews)
  }else{
    res.status(404).json({message:"Book not found"})
  }
});

//TASK #10
function getBooksPromises(url){
  return new Promise((resolve,reject)=>{
    axios.get(url)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}
async function getBooksAsync(url){
  try{
    const response = await axios.get(url);
    return response.data;
  }catch(err){
    throw error;
  }
}

public_users.get('/promise', function (req, res) {
  try {
    getBooksPromises('http://localhost:5000/') 
      .then(bookList => {
        res.json(bookList);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book list" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});

public_users.get('/async', async function (req, res) {
  try {
    const bookList = await getBooksAsync('http://localhost:5000/'); //
    res.json(bookList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

//TASK #11
public_users.get('/promise/isbn/:isbn', function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    getBooksPromises("http://localhost:5000/isbn/" + requestedIsbn) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});

public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    const book = await getBooksAsync("http://localhost:5000/isbn/" + requestedIsbn);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

//TASK #12
public_users.get('/promise/author/:author', function (req, res) {
  try {
    const requestedAuthor = req.params.author;
    getBooksPromises("http://localhost:5000/author/" + requestedAuthor) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});

public_users.get('/async/author/:author', async function (req, res) {
  try {
    const requestedAuthor = req.params.author;
    const book = await getBooksAsync("http://localhost:5000/author/" + requestedAuthor);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});
// TASK #13
public_users.get('/promise/title/:title', function (req, res) {
  try {
    const requestedTitle = req.params.title;
    getBooksPromises("http://localhost:5000/title/" + requestedTitle) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});

public_users.get('/async/title/:title', async function (req, res) {
  try {
    const requestedTitle = req.params.title;
    const book = await getBooksAsync("http://localhost:5000/title/" + requestedTitle);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});


module.exports = {
  general: public_users,
  getBooksPromises,
  getBooksAsync
};