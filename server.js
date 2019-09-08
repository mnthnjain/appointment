const express = require('express');
const app = express();
const http = require('http');
const serviceHandler = require('./service-handler')
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./mongo')
const httpProxy = require('http-proxy');
const session = require('express-session')
const db = require('./mongo');
const { env, envSetup } = require('./constant')
const path = require("path");
const apiProxy = httpProxy.createProxyServer();
console.clear();

app.use(session({ secret: 'mySecret' })); //to make passport remember the user on other pages too.(Read about session store. I used express-sessions.)

app.use(bodyParser.json());

// passport authentication setup
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    cb(err, user);
  });
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log('user')
    User.findOne({
      username: username
    }, function (err, user) {
      console.log(user)
      if (err) {
        console.log(err)
        return done(err);
      }

      if (!user) {
        console.log('user not found')
        return done(null, false);
      }

      if (user.password != password) {
        console.log('some error')
        return done(null, false);
      }
      console.log('successfully loged in')
      return done(null, user);
    });
  }
));

// check authentication of user session
function isAuthenticated(req, res, next) {
  if (req.user)
    return next();
  else
    return res.status(401).json({
      error: 'User not authenticated'
    })

}

// authentication apis
app.post('/auth/login',
  passport.authenticate('local'),
  function (req, res) {
    res.send({ status: 200 })
  });

app.get('/auth/logout', function (req, res) {
  req.logOut();
  res.json({ status: 200 })
})

app.post('/auth/signup',
  function registerUser(req, res) {
    var newUser = db.User(req.body)
    newUser.save();
    res.send(newUser)
  }
)

app.all('/api/*', isAuthenticated, serviceHandler.router)

if (env === "dev") { 
  app.all('/*', (req, res) => { apiProxy.web(req, res, { target: 'http://localhost:4200', }); }) 
} else {
  // Run the app by serving the static files in the dist directory
  app.use(express.static(__dirname + '/appointment-client'));
  // For all GET requests, send back index.html so that PathLocationStrategy can be used
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/appointment-client/index.html'));
  });
}
app.listen(envSetup[env].port || 3000);

var server = http.createServer(app);

console.log('Running at Port ', envSetup[env].port);
