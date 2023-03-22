const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fs = require('fs')
const path = require('path');
// const { render } = require('../app');

const router = express.Router();

const userDataFile = path.join(__dirname, '..', '/data/users.json');

function checkUserDataFile() {
  try {
    fs.accessSync(userDataFile, fs.constants.F_OK);
    console.log('User data file exists');
  } catch (err) {
    console.log('User data file does not exist, creating a new one');
    try {
      fs.writeFileSync(userDataFile, JSON.stringify([]));
      console.log('New user data file created');
    } catch (err) {
      console.log('Error creating user data file:', err);
    }
  }
}

// Call the function to check the user data file
checkUserDataFile();

// Configure passport to use local strategy for authentication
passport.use(new LocalStrategy(
  function (username, password, done) {
    // Load user data from file
    fs.readFile(userDataFile, 'utf8', (err, data) => {
      if (err) {
        return done(err);
      }
      const users = JSON.parse(data);
      const user = users.find((user) => user.username === username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      return done(null, user);
    });
  }
));


// Configure passport to serialize and deserialize user instances
passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
  // Load user data from file
  fs.readFile(userDataFile, 'utf8', (err, data) => {
    if (err) {
      return done(err);
    }
    const users = JSON.parse(data);
    const user = users.find((user) => user.username === username);
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    return done(null, user);
  });
});

// Route to register a new user
router.post('/register', function (req, res, next) {
  const { username, password } = req.body;
  // Load user data from file
  fs.readFile(userDataFile, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }
    const users = JSON.parse(data);
    // Check if user already exists
    if (users.some((user) => user.username === username)) {
      // return res.status(409).send('User already exists');
      return res.redirect('/login');
    }
    // Add new user to array and save data to file
    const newUser = { username, password };
    users.push(newUser);
    return fs.writeFile(userDataFile, JSON.stringify(users), (err) => {
      if (err) {
        return next(err);
      }
      // return res.send('User registered successfully');
      res.redirect('/login');
    });
  });
});




// Route to handle login form submission
router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login'
}));


// Route to handle logout
// Route to handle logout
router.get('/logout', function (req, res) {
  req.logout(function(err) {
    if (err) {
      console.error('Error logging out:', err);
      return next(err);
    }
    res.redirect('/home');
  });
});


// Middleware function to check if user is authenticated




module.exports = router;