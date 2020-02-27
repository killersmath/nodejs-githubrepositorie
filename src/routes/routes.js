const _ = require('underscore');
const { stringify } = require('flatted');
const COOKIE = process.env.PROJECT_DOMAIN;

const getGitHubData = require('../controllers/api');

module.exports = (app, passport) => {
  //--- default route
  app.get('/', async (req, res) => {
    let data = {
      session: req.cookies[COOKIE] && JSON.parse(req.cookies[COOKIE])
    };

    if (data.session && data.session.token) {
      let githubData;
      try {
        githubData = await getGitHubData(data.session.token);
      } catch (error) {
        githubData = { error: error };
      }
      _.extend(data, githubData);
    }

    if (data.session) {
      data.session.token = 'mildly obfuscated.';
    }
    data.json = stringify(data, null, 2);

    res.render('main', data);
  });

  //--- delete the cookie and redirect to main page
  app.get('/logoff', function(req, res) {
    res.clearCookie(COOKIE);
    res.redirect('/');
  });

  //---- call api git hub auth api
  app.get('/auth/github', passport.authenticate('github'));

  //--- handle the result of auth
  app.get(
    '/login/github/return',
    passport.authenticate('github', {
      successRedirect: '/setcookie',
      failureRedirect: '/'
    })
  );

  //--- on successfuly auth then set the cookie and redirect to home page
  app.get('/setcookie', function(req, res) {
    const data = {
      user: {
        ...req.session.passport.user.profile._json,
        name: req.session.passport.user.profile.username
      },
      token: req.session.passport.user.token
    };

    res.cookie(COOKIE, JSON.stringify(data));
    res.redirect('/');
  });
};
