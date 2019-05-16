const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

module.exports = {
  signUp(req, res, next){
    res.render("users/signup");
  },

  create(req, res, next){

    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/signup");
      } else {
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = {
            to: req.body.email,
            from: 'sarahhrothwell@gmail.com',
            subject: 'Blocipiedia Account Activated',
            text: 'Thank you for joining Blocipiedia!',
            html: '<strong>Blocipedia - #1 source for everything</strong>',
          };
          sgMail.send(msg);


        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        })
      }
    });
  },

  signInForm(req, res, next){
    res.render("users/sign_in");s
  },

  signIn(req, res, next){
    passport.authenticate("local", function(err, user, info){
      if(err){
        return next(err);
      }
      if(!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        return res.redirect('/users/sign_in');
        }
        req.logIn(user, function(err) {
          if(err) {
            return next(err);
          }
          req.flash("notice", "You've successfully signed in!");
          return res.redirect('/');
        });
      })(req, res, next);
    },

signOut(req, res, next){
  req.logout();
  req.flash("notice", "You've successfully signed out!");
  res.redirect("/");
}

}
