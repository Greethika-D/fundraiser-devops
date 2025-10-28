const express = require('express');
const path = require('path');

const port = process.env.PORT || 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// ======== Mock Storage (for logging only) ========
const mockUsers = [];
const mockDonations = [];
const mockFundRequests = [];

// ======== Routes ========

// Home route
app.get('/', (req, res) => {
  console.log("Serving form.html");
  res.sendFile(path.join(__dirname, 'form.html'));
});

// ----- User Registration (mock) -----
app.post('/post', (req, res) => {
  const { regd_no, name, email, branch } = req.body;
  const user = { regd_no, name, email, branch };
  mockUsers.push(user);
  console.log("User registered (mock):", user);
  res.send("Form submitted successfully (mock)");
});

// ----- Donation Form (mock) -----
app.post('/donate_post', (req, res) => {
  const { firstName, lastName, email, amount, donationType, message } = req.body;

  const donation = { firstName, lastName, email, amount, donationType, message };
  mockDonations.push(donation);

  console.log("Donation received (mock):", donation);
  res.send("Donation submitted successfully (mock)");
});

// ----- Fund Request (mock) -----
app.post('/app_post', (req, res) => {
  const { name, email, password, delivery_date, address, Fundss, payment_type } = req.body;

  const fundRequest = {
    name,
    email,
    password,
    delivery_date,
    address,
    Fundss: Fundss ? (Array.isArray(Fundss) ? Fundss : [Fundss]) : [],
    payment_type
  };

  mockFundRequests.push(fundRequest);

  console.log("Fund request received (mock):", fundRequest);
  res.send("Fund request submitted successfully (mock)");
});

// ----- Sign-in (mock validation) -----
app.post('/signin_post', (req, res) => {
  const { email, password } = req.body;
  console.log("Sign-in attempt:", { email, password });

  // Check if mock user exists
  const userExists = mockUsers.find(user => user.email === email && user.password === password);

  if (userExists) {
    console.log("User signed in (mock):", userExists);
    res.redirect('/');  // ✅ Redirect to home page
  } else {
    console.log("Sign-in failed (mock) for:", email);
    res.status(401).send("Invalid credentials (mock)");
  }
});

// ----- Sign-up (mock) -----
app.post('/signup_post', (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).send("Passwords do not match (mock)");
  }

  const existingUser = mockUsers.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).send("User already exists (mock)");
  }

  const user = { name, email, password };
  mockUsers.push(user);

  console.log("User signed up (mock):", user);

  // ✅ After sign-up, redirect to home page
  res.redirect('/');
});

// ----- Funds Page -----
app.get('/funds', (req, res) => {
  console.log("Serving funds.html");
  res.sendFile(path.join(__dirname, 'funds.html'));
});

// ======== Server Start ========
if (require.main === module) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server started successfully on port ${port} (Mongo-free version)`);
  });
} else {
  module.exports = app;
}
