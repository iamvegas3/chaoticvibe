const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "chaoticvibe_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Simple in-memory users (you can later add file DB)
const users = [{ username: "admin", password: "admin" }];

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .send(
        `<script>alert('Invalid username or password');window.location.href='/'</script>`
      );
  }

  req.session.user = user;
  res.redirect("/chat");
});

app.get("/chat", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});

app.get("/admin", (req, res) => {
  if (!req.session.user || req.session.user.username !== "admin") {
    return res.status(403).send("Access denied");
  }
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// JSON API for admin dashboard
app.get("/admin/users", (req, res) => {
  if (!req.session.user || req.session.user.username !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  res.json(users);
});

// ✅ Vercel-friendly export
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ ChaoticVibe running on port ${port}`));

module.exports = app;
