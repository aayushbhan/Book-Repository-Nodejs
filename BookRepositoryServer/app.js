require("dotenv").config();
require("./config/database").connect();
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const NodeCache = require("node-cache");
const socketIO = require('socket.io');
const http = require("http");

// Initialize the app and server
const app = express();

app.use(express.json());

const server = http.createServer(app);
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Add a disconnection event listener
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // Add a custom event listener
  socket.on('customEvent', (data) => {
    console.log('Received data:', data);
  });
});


// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// importing user context
const User = require("./model/user");

// importing book context
const Book = require("./model/books");

// create cache
const bookCache = new NodeCache();

// Register
app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { first_name, last_name, email, password } = req.body;
  
      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All fields are required to register.");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login.");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
});
  

// Login
app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("Either email or password is missing.");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials. Please enter the right credentials.");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
});

app.put("/add-book", auth, async (req, res) => {
    try {
        // Get user input
        const { bookId, title, author } = req.body;
    
        // Validate user input
        if (!(bookId && title && author)) {
          res.status(400).send("Please enter all the details to add the book - bookId, title and author");
        }
    
        // check if book already exist
        const oldBook = await Book.findOne({ bookId });
    
        if (oldBook) {
          return res.status(409).send("Book with this id already exists. Please try again.");
        }
    
        // Create user in our database
        const book = await Book.create({
          bookId,
          title,
          author
        });
    
        // Emit a custom event with the new book
        io.emit("book-added", book);
        

        // return new book
        res.status(201).json(book);
      } catch (err) {
        console.log(err);
      }
});

app.post("/update-book/:bookId", auth, async (req, res) => {
    try {
        // Get user input
        var bookId  = req.params.bookId;
        
        const { title, author } = req.body;
    
        // Validate user input
        if (!(bookId)) {
          res.status(400).send("Please enter the bookId to update");
        }

        const oldBook = await Book.findOne({ bookId });
    
        if (!oldBook) {
          return res.status(400).send("Book with this id does not exists. Please try again.");
        }

       
        const filter = { bookId: bookId };

        const options = { upsert: false };
   
        const updateDoc = {
            $set: {
                title: title,
                author: author
            },
        };
    
        // check if book already exist
        const updatedBook = await Book.updateOne(filter, updateDoc, options);
    
        io.emit("book-updated", "updated "+bookId); 
        // return new book
        res.status(200).send("Updated "+bookId);
      } catch (err) {
        console.log(err);
      }
});

app.delete("/delete-book/:bookId", auth, async (req, res) => {
    try {
        // Get user input
        var bookId  = req.params.bookId;
    
        // Validate user input
        if (!(bookId)) {
          res.status(400).send("Please enter the bookId to delete");
        }

        const oldBook = await Book.findOne({ bookId });
    
        if (!oldBook) {
          return res.status(400).send("Book with this id does not exists. Please try again.");
        }
       
        const query = { bookId: bookId };
    
        // check if book already exist
        const updatedBook = await Book.deleteOne(query);
        io.emit("book-deleted", "deleted "+bookId); 
        // return new book
        res.status(200).send("deleted "+bookId);
      } catch (err) {
        console.log(err);
      }
});


app.get("/search-book", auth, async (req, res) => {
    try {
        // Get user input
        const { bookId } = req.query;
        
        // Validate user input
        if (!(bookId)) {
          res.status(400).send("Please specify bookId to search for a book");
        }
    
        // check if book is in cache
        if(bookCache.has(bookId)){
            console.log('Retrieved value from cache !!');
              
            // Serve response from cache using
            res.status(200).json(bookCache.get(bookId));
        }

        // check if book exist
        const book = await Book.findOne({ bookId });
        if (book) {
          bookCache.set(bookId, book)
          return res.status(200).json(book);
        }
    
        // return message if book not found
        res.status(404).send("Book does not exist");
      } catch (err) {
        console.log(err);
      }
});

app.get("/list-books", auth, async (req, res) => {
    try {
        // check if book exist
        let { page = 1, limit = 10 } = req.query;
        
        const booksList = await Book.find().sort({"bookId":1}).limit(limit * 1).skip((page - 1) * limit).exec();
        const count = await Book.countDocuments();

        if (booksList) {
          return res.status(200).json({booksList, totalPages: Math.ceil(count / limit), currentPage: page});
        }
    
        // return message if books not found
        res.status(404).send("Books do not exist");
      } catch (err) {
        console.log(err);
      }
});

module.exports = app;
