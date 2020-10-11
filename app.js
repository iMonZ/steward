/* eslint-disable import/no-dynamic-require */
// Some Imports
const express = require('express');

const app = express();
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();

// Start "Server" configuration
// HTTPS Server

https.createServer({
  cert: fs.readFileSync(process.env.SSLPUBPATH),
  key: fs.readFileSync(process.env.SSLPRIVPATH),
}, app).listen(443);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// End "Server" Configuration

// The "/" Page
app.get('/', (req, res) => {
  res.render('index');
});

// Start Whois Page
app.get('/whois', require(process.env.whoisPagePath).whoisGet);
app.post('/whois', require(process.env.whoisPagePath).whoisPost);
// End Whois Page

// Start "Login" Pages
app.get('/login', require(process.env.loginPagePath).login);
// Start "Sign-In with Apple stuff"
app.get('/siwa_token', require(process.env.loginPagePath).siwa_token);
app.post('/siwa_auth', require(process.env.loginPagePath).siwa_auth);
app.get('/siwa_refresh', require(process.env.loginPagePath).siwa_refresh);
// End "Sign-In with Apple stuff"

// Start "Sign-In with Gentlent"
app.post('/siwgentlent_auth', require(process.env.loginPagePath).siwgentlent_auth);
// End "Sign-In with Apple stuff"
// End "Login" Pages

// Start "ERROR" Pages
// The "404" Page
app.use((req, res) => {
  res.status(404).send('Hups 🥴 Something is definitely wrong! Error 404... or something else');
});
// The "500" Page
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Hups 🥴 Something is definitely wrong! Error 500... or something else');
});
// End "ERROR" Pages
