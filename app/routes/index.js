const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('homepage')
});

router.get('/sign-in-via-ln', function(req, res, next) {
  const name = req.user.name.givenName;
  const family = req.user.name.familyName;
  const photo = req.user.photos[1].value;
  const email = req.user.emails[0].value;

  const data = { name, family, photo, email }
  res.render('auth-user-page', { data })
});

module.exports = router;
