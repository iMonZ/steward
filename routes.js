// routes.js
const express = require('express');

const router = express.Router();
const { check, validationResult, matchedData } = require('express-validator');
// router.get('/', (req, res) => {
//     res.render('index');
// });
// routes.js

router.get('/whois', (req, res) => {
  res.render('whois');
});
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/whois', [
  check('domain')
    .isLength({ min: 1 })
    .trim()
    .bail(),

], (req, res) => {
  const errors = validationResult(req);
  res.render('whois', {
    data: req.body,
    errors: errors.mapped(),
  });
  const data = matchedData(req);
  console.log('Sanitized:', data);
});

module.exports = router;
