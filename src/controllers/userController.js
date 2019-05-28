const express = require("express");
const router = express.Router();
const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const User = require("../../src/db/models").User;
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const stripe = require('stripe')('sk_test_iFasGfPrv4hKmyC0yxVDRS6V00FcpXjwqx');

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

//render account page with user plan options
  upgradeForm(req, res, next){
    res.render("users/upgrade");
  },

//upgrade user account to Premium
upgradeCharge(req, res, next){
    let amount = 1500;

    stripe.customers.create({
      email: req.body.email,
      card: req.body.id
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "Sample Charge",
        currency: "usd",
        customer: customer.id
      }))
    .then(charge => res.send(charge))
    .catch(err => {
      console.log("Error:", err);
      res.status(500).send({error: "Purchase Failed"});
    });
  },

//change user role from 0 to 2
  upgradeUser(req, res, next){
    userQueries.upgradeUser(req.user.id);
    req.flash("notice", "Congrats! You are a premium user!");
    res.redirect("/");
  },

//render page to downgrade user account
  downgradeForm(req, res, next){
    res.render("users/downgrade");
  },

//change user role from 2 to 0
  downgradeUser(req, res, next){
    userQueries.downgradeUser(req.user.id);
    wikiQueries.privatePublicWiki(req.user.id);
    req.flash("notice", "You are no longer a premium user!");
    res.redirect("/");
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

signOut(req, res, next){
  req.logout();
  req.flash("notice", "You've successfully signed out!");
  res.redirect("/");
}

}
