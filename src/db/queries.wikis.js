const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;

module.exports = {

  getAllWikis(callback){
    return Wiki.findAll({
    include: [{
      model: Collaborator, as: "collaborators", include: [
        {model: User }
      ]}
    ]
    })
    .then((wikis) => {
    //  console.log(wikis)
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
    },

  addWiki(newWiki, callback){
    return Wiki.create(newWiki)
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getWiki(id, callback){
    return Wiki.findById(id, {
    include: [
      {model: Collaborator, as: "collaborators", include: [
        {model: User }
      ]}
    ]
    })
    .then((wiki) => {
      console.log(wiki);
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteWiki(req, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      wiki.destroy()
      .then((res) => {
        callback(null, wiki);
      })
    })
    .catch((err) => {
      callback(err);
    })
  },

  updateWiki(req, updatedWiki, callback){

     return Wiki.findById(req.params.id)
     .then((wiki) => {
       if(!wiki){
         return callback("Wiki not found");
       }
       wiki.update(updatedWiki, {
         fields: Object.keys(updatedWiki)
       })
       .then(() => {
         //console.log(wiki);
         callback(null, wiki);
       })
       .catch((err) => {
         //console.log(err);
         callback(err);
       });
     });
   },

  privatePublicWiki(userId, callback){
    return Wiki.findAll({
      where: {
        userId: userId,
        private: true
      }
    })
    .then((updateState) => {
      updateState.forEach((wiki) => {
        wiki.updateAttributes({ private: false });
      });
    })
    .catch((err) => {
      callback(err);
    });

  },

  addCollaborator(req, callback){
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then((user) => {

      Collaborator.findOne({
        where: {
          wikiId: req.params.id,
          userId: user.id
        }
      }).then((res) => {
        console.log("res......")
        console.log(res);
        if (res !== null){
          throw new Error("user already exists")
          //return callback(err, "User is already a collaborator on this wiki");
        } else {

          Collaborator.create({
            wikiId: req.params.id,
            userId: user.id
          }).then((collaborator) => {
              return callback(null, collaborator);
          })
        };
      }).catch((err) => {
        callback(err, null);
      });

    }).catch((err) => {
      callback(err, null);
    });
  },


/*
  addCollaborator(req, callback){
  //  console.log(req.body.email);
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then((user) => {

      Collaborator.create({
        wikiId: req.params.id,
        userId: user.id
      })
    }).then((collaborator) =>{
    //  console.log(collaborator);
      callback(null, collaborator);
    }).catch((err) =>{
    //  console.log(err);
      callback(err, null);
    });
  },
*/
  removeCollaborator(req, callback) {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      Collaborator.destroy({
        where: {
          wikiId: req.params.id,
          userId: user.id
        }
      }).then((res) => {
        callback(null);
      })
    })
    .catch((err) => {
      callback(err);
    })
  },

  findCollaborators(wikiId, callback){
    return Wiki.findById(wikiId, {
    include: [
      {model: Collaborator, as: "collaborators", include: [
        {model: User }
      ]}
    ]
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  }
}
