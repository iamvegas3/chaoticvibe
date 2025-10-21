// server.js — CommonJS version for Vercel ✅

const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚠️ Session setup
app.use(
  session({
    secret: "chaoticvibe_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ In-memory users (no filesystem writes)
let users = [
  {
    username: "admin",
    password: "admin",
  },
];

// ✅ Serve static files (optional: if you have a public/ folder)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Routes
app.get("/", (req, res) => {
  res.send("🔥 ChaoticVibe Server Running on Vercel — CommonJS OK!");
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  req.session.user = user;
  return res.json({ message: "Login successful" });
});

app.get("/users", (req, res) => {
  res.json(users);
});

// ✅ Required for Vercel
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

// ✅ Export for Vercel
module.exports = app;
