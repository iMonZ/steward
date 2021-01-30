const axios = require('axios');

// The "/whois" Page
module.exports.whoisGet = (req, res) => {
  // The code thats get executed
  const { query } = req;
  const json = JSON.stringify(query);
  if (req.query.server) {
    const whoisquerry = encodeURIComponent(req.query.server);
    const whoisurl = `https://${process.env.whoisURL}?query=${whoisquerry}`;
    axios.get(whoisurl)

      .then((body) => {
        res.type('text/plain').send(body.data);
      }).catch((error) => {
        console.log(error);
        res.send('Error ☹️');
      });
  } else {
    res.render('whois');
  }
};

module.exports.whoisPost = async (req, res) => {
  res.redirect(`https://${req.hostname}/whois?server=${req.body.domain}`);
};
