const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Render the login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user in the database
    console.log("Login route hit!");
    const user = await User.findOne({ where: { username } });
    console.log(" user entered password", password); 
    console.log(" user password", user.password); 

    if (!user || !(bcrypt.compareSync(password, user.password))) {
      return res.render('login', { error: 'Invalid username or password.' });
    }
    // Set the user's session
    req.session.user = user;
    console.log("Login successful for user:", user.username); 
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'An error occurred. Please try again.' });
  }
});

// Render the signup page
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Handle signup form submission
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {

     // Hash the password before saving it to the database
     const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user in the database
    const newUser = await User.create({ username,  password: hashedPassword, });
    // Set the user's session
    req.session.user = newUser;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('signup', { error: 'An error occurred. Please try again.' });
  }
});

// Logout the user and clear the session
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// // Handle POST request to /login
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Find the user with the given username
//     const user = await User.findOne({ where: { username } });

//     // If the user is not found or the password is incorrect, show an error message
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }

//     // Set the user in the session
//     req.session.user = user;

//     // Redirect or respond with success message
//     res.json({ message: 'Login successful' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Handle POST request to /signup
// router.post('/signup', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = await User.create({ username, password: hashedPassword });

//     // Set the user in the session
//     req.session.user = newUser;

//     // Redirect or respond with success message
//     res.json({ message: 'Signup successful' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Handle GET request to /logout
// router.get('/logout', (req, res) => {
//   // Clear the user from the session
//   req.session.user = null;

//   // Redirect or respond with success message
//   res.json({ message: 'Logout successful' });
// });

module.exports = router;
