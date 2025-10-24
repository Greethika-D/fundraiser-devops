const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = process.env.PORT || 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb://mongo:27017/fundraiserDB")
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});

const userSchema = new mongoose.Schema({
    regd_no: String,
    name: String,
    email: String,
    branch: String,
    password: String 
});

const Users = mongoose.model("User", userSchema);

const fundRequestSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    delivery_date: Date,
    address: String,
    Fundss: [String],
    payment_type: String
});

const FundRequests = mongoose.model("FundRequest", fundRequestSchema);

const donationSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    amount: Number,
    donationType: String,
    message: String
});

const Donations = mongoose.model('Donation', donationSchema);

app.get('/', (req, res) => {
    console.log("Serving form.html");
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/post', async (req, res) => {
    const { regd_no, name, email, branch } = req.body;
    const user = new Users({
        regd_no,
        name,
        email,
        branch
    });
    await user.save();
    console.log("User saved:", user);
    res.send("Form submitted successfully");
});

app.post('/donate_post', async (req, res) => {
    const { firstName, lastName, email, amount, donationType, message } = req.body;

    console.log("Received donation data:", { firstName, lastName, email, amount, donationType, message });

    const donation = new Donations({
        firstName,
        lastName,
        email,
        amount,
        donationType,
        message
    });

    try {
        await donation.save(); 
        console.log("Donation saved:", donation);
        res.send("Donation submitted successfully");
    } catch (error) {
        console.error("Error saving donation:", error);
        res.status(500).send("Error submitting donation");
    }
});

app.post('/app_post', async (req, res) => {
    const { name, email, password, delivery_date, address, Fundss, payment_type } = req.body;

    console.log("Received data from app.html:", { name, email, password, delivery_date, address, Fundss, payment_type });

    const fundRequest = new FundRequests({
        name,
        email,
        password,
        delivery_date,
        address,
        Fundss: Fundss ? Array.isArray(Fundss) ? Fundss : [Fundss] : [],
        payment_type
    });

    try {
        await fundRequest.save(); 
        console.log("Fund request saved:", fundRequest);
        res.send("Fund request submitted successfully");
    } catch (error) {
        console.error("Error saving fund request:", error);
        res.status(500).send("Error submitting fund request");
    }
});

app.post('/signin_post', async (req, res) => {
    const { email, password } = req.body;

    console.log("Received sign-in data:", { email, password });

    const user = await Users.findOne({ email, password });
    if (user) {
        console.log("User signed in:", user);
        res.redirect('/'); 
    } else {
        console.log("Sign-in failed for email:", email);
        res.status(401).send("Invalid email or password");
    }
});

app.post('/signup_post', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).send("Passwords do not match");
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
        return res.status(400).send("User already exists");
    }

    const user = new Users({
        name,
        email,
        password 
    });

    try {
        await user.save();
        console.log("User registered:", user);
        res.redirect('/'); 
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error during sign-up");
    }
});

app.get('/funds', (req, res) => {
    console.log("Serving funds.html");
    res.sendFile(path.join(__dirname, 'funds.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`);
});
