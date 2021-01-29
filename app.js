/* eslint-disable import/newline-after-import,import/no-dynamic-require */
// Some Imports

const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

Sentry.init({
  dsn: process.env.sentryKey,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

// Start "Server" configuration
require('dotenv').config();
app.use('/favicon.ico', express.static(process.env.favicon));
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
// HTTPS secure Server
https.createServer({
  cert: fs.readFileSync(process.env.SSLPUBPATH),
  key: fs.readFileSync(process.env.SSLPRIVPATH),
}, app).listen(443);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// End "Server" Configuration

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all 404 and 500 errors
      if (error.status === 404 || error.status === 500) {
        return true;
      }
      return false;
    },
  }),
);

// Start "/ default" Page
app.get('/', (req, res) => {
  if (req.hostname == process.env.STWurl) {
    res.render('index', { GitHubSRClink: process.env.GitHubSRClink });
  } else if (req.hostname == process.env.GGurl) {
    res.render('indexGG', { STWurl: process.env.STWurl });
  } else {
    res.send('Sorry wrong URL');
  }
});
// End "/ default" Page

// Start "HTML Validate Testing Page"
app.get('/validate', (req, res) => {
  res.render('notitle');
});
// End "HTML Validate Testing Page"

// Start Whois Page
app.get('/whois', require(process.env.whoisPagePath).whoisGet);
app.post('/whois', require(process.env.whoisPagePath).whoisPost);
// End Whois Page

// Start "Login" Pages
app.get('/login', require(process.env.loginPagePath).login);
// Start "Log-in with Telegram stuff"
app.get('/login-tg', require(process.env.loginPagePath).loginTeleGet);
app.post('/login-tg', require(process.env.loginPagePath).loginTelePost);
// Stop "Log-in with Telegram stuff""
// Start "Sign-In with Apple stuff"
app.get('/siwa_token', require(process.env.loginPagePath).siwa_token);
app.post('/siwa_auth', require(process.env.loginPagePath).siwa_authPost);
app.get('/siwa_auth', require(process.env.loginPagePath).siwa_authGet);
app.get('/siwa_refresh', require(process.env.loginPagePath).siwa_refresh);
// End "Sign-In with Apple stuff"

// Start "Sign-In with Gentlent"
app.get('/siwgentlent_auth', require(process.env.loginPagePath).siwgentlent_authGet);
// End "Sign-In with Gentlent"
// End "Login" Pages

// Start "ERROR" Pages
app.use(Sentry.Handlers.errorHandler());
// The "404" Page
app.use((req, res) => {
  res.status(404).send('Hups 🥴 Something is definitely wrong! Error 404... or something else');
});
// The "500" Page
app.use((err, req, res, next) => {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(`${res.sentry}\n`);
});
// End "ERROR" Pages
