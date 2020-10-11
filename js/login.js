// Start "Some imports"
const fs = require('fs');
const AppleAuth = require('apple-auth');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const layout = require('express-layout');
// End "Some imports"

// Start "Login" Page
module.exports.login = (req, res) => {
  console.log(`${Date().toString()}GET /login`);
  // res.send(`<a href="${auth.loginURL()}">Sign in with Apple</a>`);

  res.render('login', { authLink: auth.loginURL() });
};

// Start "SIWA"
const siwaconfig = fs.readFileSync('./db/siwa/config.json');
let auth = new AppleAuth(siwaconfig, fs.readFileSync('./db/siwa/AuthKey.p8').toString(), 'text');

module.exports.siwa_token = (req, res) => {
  res.send(siwa_auth._tokenGenerator.generate());
};

module.exports.siwa_auth = async (req, res) => {
  try {
    const response = await auth.accessToken(req.body.code);
    const idToken = jwt.decode(response.id_token);

    const user = {};
    user.id = idToken.sub;

    if (idToken.email) user.email = idToken.email;
    if (req.body.user) {
      const { name } = JSON.parse(req.body.user);
      user.name = name;
    }

    res.json(user);
  } catch (ex) {
    console.error(ex);
    res.send('An error occurred!');
  }
};

module.exports.siwa_refresh = async (req, res) => {
  try {
    const accessToken = await auth.refreshToken(req.query.refreshToken);
    res.json(accessToken);
  } catch (ex) {
    console.error(ex);
    res.send('An error occurred!');
  }
};
// End "SIWA"
// End "Login" Page
