// client-side logic for login, chat, admin
(async ()=>{
// helper
const $ = (s) => document.querySelector(s);


// Login form
const loginForm = $('#loginForm');
if (loginForm) {
loginForm.addEventListener('submit', async (e)=>{
e.preventDefault();
const fd = new FormData(loginForm);
const res = await fetch('/login', { method:'POST', body: new URLSearchParams(fd) });
const j = await res.json();
if (j.ok) location.href = j.redirect;
else alert(j.message || 'Login failed');
});
}


// Admin login form
const adminForm = $('#adminForm');
if (adminForm) {
adminForm.addEventListener('submit', async (e)=>{
e.preventDefault();
const fd = new FormData(adminForm);
const res = await fetch('/admin-login', { method:'POST', body: new URLSearchParams(fd) });
const j = await res.json();
if (j.ok) location.href = j.redirect;
else alert('Bad admin password');
});
}

