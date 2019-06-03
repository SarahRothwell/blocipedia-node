const express = require("express");
const router = express.Router();
const wikiQueries = require("../db/queries.wikis.js");
const userQueries = require("../db/queries.users.js");
const Authorizer = require("../policies/wiki");
const markdown = require( "markdown" ).markdown;

 module.exports = {

   index(req, res, next){
      wikiQueries.getAllWikis((err, wikis) => {
        if(err){
          res.redirect(500, "static/index");
        } else {
          res.render("wikis", {wikis});
        }
      });
   },

   new(req,res,next){
     res.render("wikis/new");
   },

   create(req, res, next){
     let newWiki = {
       title: req.body.title,
       body: req.body.body,
       private: req.body.private,
       userId: req.user.id
     };
     wikiQueries.addWiki(newWiki, (err, wiki) => {
       if(err){
         res.redirect(500, "wikis/new");
       } else {
         res.redirect(303, `/wikis/${wiki.id}`);
       }
     });
   },

   show(req, res, next){

     wikiQueries.getWiki(req.params.id, (err, wiki) => {

       if(err || wiki == null){
         res.redirect(404, "/");
       } else {
         wiki.body = markdown.toHTML(wiki.body);
         res.render("wikis/show", {wiki});
       }
     });
   },

   destroy(req, res, next){
     wikiQueries.deleteWiki(req, (err, wiki) => {
       if(err){
         res.redirect(500, `/wikis/${req.params.id}`)
       } else {
         res.redirect(303, "/wikis")
       }
     });
   },

   edit(req, res, next){
     wikiQueries.getWiki(req.params.id, (err, wiki) => {
       if(err || wiki == null){
         res.redirect(404, "/");
       } else {
         res.render("wikis/edit", {wiki});
       }
     });
   },

   update(req, res, next){
     wikiQueries.updateWiki(req, req.body, (err, wiki) => {
       if(err || wiki == null){
         res.redirect(404, `wikis/${req.params.id}/edit`);
       } else {
         res.redirect(303, "/wikis");
       }
     });
   },

   //show all collaborators for a wiki on wiki/collaborator.ejs
   findCollaborators(req, res, next){
      wikiQueries.findCollaborators(req.params.id, (err, wiki) => {
        console.log("this is the wiki id:" +req.params.id);
        console.log("wiki" +wiki)
        if(err || req.params.id == null){
          res.redirect(404, "/");
        } else {
          res.render("wikis/collaborators", {wiki});
        //  res.render(`/wikis/collaborators`, {wiki, collaborators, users});
       }
      });

    },

//add a collaborator to a wiki
   addCollaborator(req, res, next){
      wikiQueries.addCollaborator(req, (err, collaborator) => {
        if(err){
          req.flash("notice", "Collaborator was not added");
          res.redirect(500, "/")
        } else {
          req.flash("notice", "Congrats! You have added a new collaborator");
          res.redirect("/");
        }
      });
   },

//delete a collaborator from a wiki
   removeCollaborator(req, res, next){
      wikiQueries.removeCollaborator((err, collaborator) => {
        if(err){
          res.redirect(500, `/wikis/${req.params.id}`)
        } else {
          res.redirect(`wikis/${req.params.id}`);
        }
      });
   },
 }
