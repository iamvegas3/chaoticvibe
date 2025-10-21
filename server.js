const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


const PORT = process.env.PORT || 3000;
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
secret: 'chaoticvibe-secret',
resave: false,
saveUninitialized: true,
}));


// in-memory stores (for demo)
const registeredUsers = []; // { username, password (plain for demo), lastSeen }
const onlineBySocket = new Map(); // socketId -> username


// Serve static public folder
app.use(express.static(path.join(__dirname, 'public')));


// Serve admin.html only for logged-in admin
app.get('/admin.html', (req, res, next) => {
if (req.session && req.session.isAdmin) return res.sendFile(path.join(__dirname, 'public', 'admin.html'));
return res.redirect('/admin-login.html');
});


// GET current session info (used by front-end)
app.get('/session', (req, res) => {
res.json({ username: req.session.username || null, isAdmin: !!req.session.isAdmin });
});


// Login for users
app.post('/login', (req, res) => {
const { username, password } = req.body;
if (!username || !password) return res.status(400).json({ ok: false, message: 'Missing fields' });


// find or create user (very simple for demo)
let user = registeredUsers.find(u => u.username === username);
if (!user) {
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
