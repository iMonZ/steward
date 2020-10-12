/* eslint-disable camelcase */
// Start "Some imports"
const fs = require('fs');
const AppleAuth = require('apple-auth');
const jwt = require('jsonwebtoken');
const axios = require('axios');
// End "Some imports"

// Start "Login" Page

// Start "SiwGentlent"
module.exports.siwgentlent_authGet = (req, res) => {
  // eslint-disable-next-line eqeqeq
  // eslint-disable-next-line eqeqeq
  if (!req.query.code == '') {
    axios({
      method: 'post',
      url: process.env.siwGentlent_OauthAPI,
      data: {
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: (`https://${process.env.STWurl}/siwgentlent_auth`),
        client_id: process.env.siwGentlent_ClientID,
        client_secret: process.env.siwGentlent_ClientSec,
      },
    }).then((RAWaccess_token) => {
      const { access_token } = RAWaccess_token.data;
      axios.get(`${process.env.siwGentlent_getProfile}?access_token=${access_token}`).then((userData) => {
        console.log(userData.data);
        const { display_name } = userData.data;
        res.render('loginsucc', { realname: display_name });
      }).catch((error) => {
        res.redirect(`https://${req.hostname}/login`);
        console.log(error);
      });
    });
  } else {
    res.redirect(`https://${req.hostname}/login`);
  }
};

// eslint-disable-next-line camelcase,prefer-destructuring
const siwGentlent_authURL = process.env.siwGentlent_authURL;

// End "SiwGentlent"
const siwaConfig = fs.readFileSync(process.env.siwaConfigPath);
const siwaAuth = new AppleAuth(siwaConfig, fs.readFileSync(process.env.siwaAuthPath).toString(), 'text');
module.exports.login = (req, res) => {
  if (req.hostname == process.env.STWurl) {
    res.render('login', { siwaAuthLink: siwaAuth.loginURL(), gentlentAuthLink: siwGentlent_authURL });
  } else if (req.hostname == process.env.GGurl) {
    res.redirect(`https://${process.env.GGurl}`);
  } else {
    res.send('Sorry wrong URL');
  }
};
// Start "SIWA"
module.exports.siwa_token = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  res.send(siwaAuth._tokenGenerator.generate());
};

module.exports.siwa_authPost = async (req, res) => {
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
    const realname = '$realname';
    res.render('loginsucc', { realname });
    // res.json(user);
    console.log(user.id);
    console.log(user.email);
  } catch (ex) {
    console.error(ex);
    res.send('Sorry wrong request! 😖');
  }
};
module.exports.siwa_authGet = (req, res) => {
  res.redirect(`https://${req.hostname}/login`);
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
