// server.js
const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// ✅ Use environment PORT for Vercel or fallback to 3000
const PORT = process.env.PORT || 3000;

// ✅ Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Session setup
app.use(
  session({
    secret: "chaoticvibe_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ Simple user data store
const USERS_FILE = path.join(__dirname, "users.json");
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "{}");

// ✅ Helper functions
function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ✅ Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).send("Missing credentials");

  const users = getUsers();

  // Auto-register new users
  if (!users[username]) {
    users[username] = { username, password, online: false };
    saveUsers(users);
  }

  // Verify password
  if (users[username].password !== password)
    return res.status(401).send("Wrong password");

  req.session.username = username;
  res.redirect("/chat.html");
});

// ✅ Admin login route
app.post("/admin-login", (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASS || "admin123";

  if (password === adminPass) {
    req.session.admin = true;
    res.redirect("/admin.html");
  } else {
    res.status(401).send("Invalid admin password");
  }
});

// ✅ Chat route protection
app.get("/chat", (req, res) => {
  if (!req.session.username) return res.redirect("/");
  res.sendFile(path.join(__dirname, "public/chat.html"));
});

// ✅ Admin panel protection
app.get("/admin", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin-login.html");
  res.sendFile(path.join(__dirname, "public/admin.html"));
});

// ✅ Socket.io for live chat
io.on("connection", (socket) => {
  socket.on("join", (username) => {
    socket.username = username;
    const users = getUsers();
    if (users[username]) users[username].online = true;
    saveUsers(users);
    io.emit("userList", users);
  });

  socket.on("message", (msg) => {
    io.emit("message", { user: socket.username, text: msg });
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      const users = getUsers();
      if (users[socket.username]) users[socket.username].online = false;
      saveUsers(users);
      io.emit("userList", users);
    }
  });
});

// ✅ Default route for Vercel (serves index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ✅ Start the server
server.listen(PORT, () => {
  console.log(`🚀 ChaoticVibe running on port ${PORT}`);
});

// ✅ Export for Vercel compatibility
module.exports = app;
