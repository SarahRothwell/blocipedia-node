const Wiki = require("./models").Wiki;
const User = require("./models").User;

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

/*
  privatePublicWiki(req, callback){
    return Wiki.findAll({
      where: {
        wiki.userId: req.user.id,
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

  }
*/
}
