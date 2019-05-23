const express = require("express");
const router = express.Router();
const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
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
            to: 'test@example.com',
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
    })
    .catch((err) => {
      console.log(err)
    });
  },

  signInForm(req, res, next){
    res.render("users/sign_in");
  },

  signIn(req, res, next){
  passport.authenticate("local")(req, res, function () {
    if(!req.user){
      req.flash("notice", "Sign in failed. Please try again.")
      res.redirect("/users/sign_in");
    } else {
      req.flash("notice", "You've successfully signed in!");
      res.redirect("/");
    }
  })
},

  /*signIn(req, res, next){
    passport.authenticate("local", function(err, user, info){
      console.log(err);
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
*/
signOut(req, res, next){
  req.logout();
  req.flash("notice", "You've successfully signed out!");
  res.redirect("/");
}

}
