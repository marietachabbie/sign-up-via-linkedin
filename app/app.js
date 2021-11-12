const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const indexRouter = require('./routes');

const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const session = require('express-session')

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(connectLiveReload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "SESSION_SECRET" }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);

const LINKEDIN_KEY = '';
const LINKEDIN_SECRET = '';
passport.use(
  new LinkedInStrategy(
    {
      clientID: LINKEDIN_KEY,
      clientSecret: LINKEDIN_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      process.nextTick(() => {
        return done(null, profile);
      });
    }
  )
);

app.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { state: "" })
);

app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/sign-in-via-ln",
    failureRedirect: "/",
  })
);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
