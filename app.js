/* eslint-disable import/no-dynamic-require */
// Some Imports
const express = require('express');

const app = express();
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();

// Start "Server" configuration
app.use('/favicon.ico', express.static('images/favicon.ico'));
// HTTPS Server
https.createServer({
  cert: fs.readFileSync(process.env.SSLPUBPATH),
  key: fs.readFileSync(process.env.SSLPRIVPATH),
}, app).listen(443);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// End "Server" Configuration

// Start "/" Page
app.get('/', (req, res) => {
  if (req.hostname == process.env.STWurl) {
    res.render('index', { GitHubSRClink: process.env.GitHubSRClink });
  } else if (req.hostname == process.env.GGurl) {
    res.render('indexGG', { STWurl: process.env.STWurl });
  } else {
    res.send('Sorry wrong URL');
  }
});
// End "/" Page

// Start "HTML Validate Testing Page"
/* app.get('/validate', (req, res) => {
  res.render('loginsucc', { realname: 'Test' });
}); */
// End "HTML Validate Testing Page"

// Start Whois Page
app.get('/whois', require(process.env.whoisPagePath).whoisGet);
app.post('/whois', require(process.env.whoisPagePath).whoisPost);
// End Whois Page

// Start "Login" Pages
app.get('/login', require(process.env.loginPagePath).login);
// Start "Sign-In with Apple stuff"
app.get('/siwa_token', require(process.env.loginPagePath).siwa_token);
app.post('/siwa_auth', require(process.env.loginPagePath).siwa_authPost);
app.get('/siwa_auth', require(process.env.loginPagePath).siwa_authGet);
app.get('/siwa_refresh', require(process.env.loginPagePath).siwa_refresh);
// End "Sign-In with Apple stuff"

// Start "Sign-In with Gentlent"
app.get('/siwgentlent_auth', require(process.env.loginPagePath).siwgentlent_authGet);
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
