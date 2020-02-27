const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const crypto = require('crypto');
const GithubStrategy = require('passport-github');

module.exports = (app, passport) => {
  //--- setup passport session

  let scopes = ['notifications', 'user:email', 'user:name', 'read:org', 'repo'];
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/login/github/return',
        scope: scopes.join(' ')
      },
      function(token, tokenSecret, profile, cb) {
        return cb(null, { profile: profile, token: token });
      }
    )
  );
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(cookieParser());
  app.use(
    expressSession({
      secret: crypto.randomBytes(64).toString('hex'),
      resave: true,
      saveUninitialized: true
    })
  );
};
