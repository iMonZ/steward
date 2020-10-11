// Start "Some imports"
const fs = require('fs');
const AppleAuth = require('apple-auth');
const jwt = require('jsonwebtoken');
// End "Some imports"

// Start "Login" Page

// Start "SiwGentlent"
module.exports.siwgentlent_auth = async (req, res) => {
  res.send('Nothing to see here');
};
// eslint-disable-next-line camelcase,prefer-destructuring
const siwGentlent_authURL = process.env.siwGentlent_authURL;

// End "SiwGentlent"
const siwaConfig = fs.readFileSync(process.env.siwaConfigPath);
const siwaAuth = new AppleAuth(siwaConfig, fs.readFileSync(process.env.siwaAuthPath).toString(), 'text');
module.exports.login = (req, res) => {
  res.render('login', { siwaAuthLink: siwaAuth.loginURL(), gentlentAuthLink: siwGentlent_authURL });
};

// Start "SIWA"
module.exports.siwa_token = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  res.send(siwaAuth._tokenGenerator.generate());
};

module.exports.siwa_auth = async (req, res) => {
  try {
    const response = await siwaAuth.accessToken(req.body.code);
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
    res.send('Sorry wrong request! 😖');
  }
};

module.exports.siwa_refresh = async (req, res) => {
  try {
    const accessToken = await siwaAuth.refreshToken(req.query.refreshToken);
    res.json(accessToken);
  } catch (ex) {
    console.error(ex);
    res.send('An error occurred!');
  }
};
// End "SIWA"
// End "Login" Page
