const axios = require('axios');

// The "/whois" Page
module.exports.whois = (req, res) => {
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
