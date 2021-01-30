const axios = require('axios');

// The "/whois" Page
module.exports.whoisGet = (req, res) => {
  // The code thats get executed
  // if (!req.query.server === '') {
  const { query } = req;
  const json = JSON.stringify(query);
  console.log(`Test: ${json}`);
  if (!req.query.server) {
    console.log('Ist server nicht NULL');

    console.log('request gesendet');
    const whoisquerry = encodeURIComponent(req.query.server);
    const whoisurl = `https://${process.env.whoisURL}?query=${whoisquerry}`;
    axios.get(whoisurl)

      .then((body) => {
        res.type('text/plain').send(body.data);
      }).catch((error) => {
        console.log(error);
        res.send('Error ☹️');
        // console.log(error);
      });
  } else {
    res.render('whois');
    console.log('request nicht gesendet');
  }
};

module.exports.whoisPost = async (req, res) => {
  res.redirect(`https://${req.hostname}/whois?server=${req.body.domain}`);
};
