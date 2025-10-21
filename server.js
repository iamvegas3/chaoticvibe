// server.js - Fully Vercel Ready 💯

import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Vercel Paths Fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚠️ Replace MemoryStore for production (Redis/CloudStore)
// MemoryStore is okay for testing but gives warnings on Vercel.
app.use(
  session({
    secret: "chaoticvibe_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ In-memory user data (instead of file)
let users = [
  {
    username: "admin",
    password: "admin",
  },
];

// ✅ Serve static frontend (if any)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Routes

app.get("/", (req, res) => {
  res.send("🔥 ChaoticVibe Server Running on Vercel — All Good!");
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

// ✅ Export handler for Vercel
export default app;
