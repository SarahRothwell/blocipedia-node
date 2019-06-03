const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;

module.exports = {

  getAllWikis(callback){
    return Wiki.all()

    .then((wikis) => {
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
    return Wiki.findById(id)
    .then((wiki) => {
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
  //  console.log(req.body.email);
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then((user) => {
      //console.log(user.id);
    //  console.log(req.params.id);

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

  removeCollaborator(req, callback){
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then((user) => {

      Collaborator.destory({
        wikiId: req.params.id,
        userId: user.id
      })
    }).catch((err) =>{
      callback(err, null);
    });
  },

  findCollaborators(req, callback){
    //console.log("FIND COLLABORATORS...............")
  //  console.log(req.params.id);
    return Wiki.findById(req.params.id, {
    include: [
      {model: Collaborator, as: "collaborators", include: [
        {model: User }
      ]}
    ]
    })
    .then((wiki) => {
  //  console.log("findCollaborators() output in queries.wiki file...............")
  //  console.log(wiki);
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  }
}
