module.exports = {

  validateUsers(req, res, next) {

    if(req.method === "POST") {
      //req.checkBody("username", "must be at least 3 characters in length").isLength({min: 3});
      req.checkBody("email", "must be valid").isEmail();
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6})
      req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
    }

    const errors = req.validationErrors();

    if (errors) {
    //  console.log(errors);
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      return next();
    }
  }
/*
  validateSignIn(req, res, next) {

    if(req.method === "POST") {
      req.checkBody("email", "must be valid").isEmail();
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6})
    }

    const errors = req.validationErrors();

    if (errors) {
    //  console.log(errors);
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      return next();
    }
  }

  validateWikis(req, res, next) {

  if(req.method === "POST") {
    req.checkBody("title", "cannot be empty").isLength({min: 1});
    req.checkBody("body", "cannot be empty").isLength({min: 1});
  }

  const errors = req.validationErrors();

  if (errors) {
    //console.log(errors);
    req.flash("error", errors);
    return res.redirect(303, req.headers.referer)
  } else {
    return next();
    }
  }
*/
}
