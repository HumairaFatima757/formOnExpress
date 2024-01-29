const express = require('express');
const router = express.Router();
const userModel = require("./users");
const passport = require('passport');
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res,next)  {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res,next)  {
  res.render('login');
});

router.get('/profile', isLoggedIn, (req, res,next ) => {
  res.send("profile");
});

router.post('/register', (req, res) => {
  const { username, email} = req.body;
  const userData = new userModel({ username, email });

  userModel.register(userData, req.body.password)
    .then(function(){
      passport.authenticate("local")(req, res,function() {
        res.redirect("/profile");
      });
    })
    .catch(err => {
      console.error(err);
      res.redirect("/"); // Redirect to home in case of registration failure
    });
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}),function(req,res){

});

router.get('/logout',function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });

});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
