// Some Imports
const express = require('express');

const app = express();
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

// Start "Server" configuration
// HTTPS Server
https.createServer({
  cert: fs.readFileSync(`${__dirname}/db/cer/pub.pem`),
  key: fs.readFileSync(`${__dirname}/db/cer/priv.pem`),
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
app.get('/whois', require('./js/whois').whois);
// End Whois Page

// Start "Login" Pages
app.get('/login', require('./js/login').login);
// Start "Sign-In with Apple stuff"
app.get('/siwa_token', require('./js/login').siwa_token);
app.post('/siwa_auth', require('./js/login').siwa_auth);
app.get('/siwa_refresh', require('./js/login').siwa_refresh);
// End "Sign-In with Apple stuff"

// Start "Sign-In with Gentlent"
app.post('/siwgentlent_auth', require('./js/login').siwgentlent_auth);
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
