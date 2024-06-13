const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let sameNameUsers = users.filter((user)=>{
    return user.username === username
  });
  if(sameNameUsers.length > 0){
    return true
  }else{
    return false
  }
}

const authenticatedUser = (username,password)=>{ 
  let validateUser = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validateUser.length > 0){
    return true
  }else{
    return false
  }
}

//TASK #7
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password =  req.query.password;

  if(!username || !password){
    return res.status(404).json({message:"error Loging in"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({data:password},'access',{expiresIn:60*60});
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).json({message:"User succesfullu logged in"})
  }else{
    return res.status(404).json({message:"Invalid Login"})
  }
  });

// TASK #8
regd_users.put("/auth/review/:isbn", (req, res) => {
  try{
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if(!username){
      return res.status(401).json({message:"Unauthorized"});
    }

    const book = books[isbn];

    if(book){
      book.reviews[username] = review;
      res.json({message:"Review modified successfully"})
    }else{
      res.status(404).json({message:"Book not found"})
    }
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Error adding/modifying review" }); // Handle unexpected errors
  }
});
//TASK #9
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const requestedIsbn = req.params.isbn;
    const username = req.session.authorization.username; // Retrieve username from session
    if (!username) {
      return res.status(401).json({ message: "Unauthorized" }); // Handle unauthorized access
    }
    const book = books[requestedIsbn];
    if (book) {
      if (book.reviews[username]) { // Check if a review exists for the user
        delete book.reviews[username]; // Delete the user's review
        res.json({ message: "Review deleted successfully" });
      } else {
        res.status(404).json({ message: "Review not found" }); // Handle review not found
      }
    } else {
      res.status(404).json({ message: "Book not found" }); // Handle book not found
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
