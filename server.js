require('dotenv').config();
const path = require('path');
const express = require('express');
const {auth, requiresAuth} = require('express-openid-connect');

const app = express(); 
app.use(express.static(path.join(__dirname, 'public'))); // serve the front end from /public folder

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    authorizationParams: { scope: 'openid profile email'}
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get('/status', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({
        authenticated: req.oidc?.isAuthenticated() || false,
        user: req.oidc?.user || null
    });
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.type('json').send(JSON.stringify(req.oidc.user, null, 2));
});

const PORT = 3000;
app.listen(PORT, () => {
console.log(`Server is listening on Port: ${PORT}`);
});