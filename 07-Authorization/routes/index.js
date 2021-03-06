var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var requireRole = require('../requireRole');
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.REMOTE_ADDR_CALLBACK || process.env.AUTH0_CALLBACK_URL || 'http://autent.devhernand.com/callback'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login', env: env ,static_path: 'public'});
});

router.get('/login',
  function(req, res){
    res.redirect('/');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/url-if-something-fails',
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
  });

router.get('/admin',
  requireRole('admin'),
  function(req, res) {
    res.render('admin', {static_path: 'public'});
  });

router.get('/unauthorized', function(req, res) {
  res.render('unauthorized', {env: env,static_path: 'public'});
});


module.exports = router;
