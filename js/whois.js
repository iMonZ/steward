const axios = require('axios');

// The "/whois" Page
module.exports.whoisGet = (req, res) => {
  // The code thats get executed
  // eslint-disable-next-line eqeqeq
  if (!req.query.server == '') {
    const whoisquerry = encodeURIComponent(req.query.server);
    const whoisurl = `https://www.gentlentapis.com/tools/v1/whois?query=${whoisquerry}`;
    axios.get(whoisurl)

      .then((body) => {
        res.type('text/plain').send(body.data);
      }).catch((error) => {
      // res.type("text/plain").send(error + error2.bo)
        res.send('Error ☹️');
        console.log(error);
      // res.send(error[ 'response'])
      });
  } else {
    res.render('whois');
  }
};

module.exports.whoisPost = async (req, res) => {
  // eslint-disable-next-line no-template-curly-in-string
  res.redirect('https://${req.hostname}/whois?server=${req.body.domain}');
};
