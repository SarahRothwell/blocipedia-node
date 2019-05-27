const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {

  createUser(newUser, callback){

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUser(id, callback){
    return User.findById(id)
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

//upgrade user role from 0 to 2
  upgradeUser(id, callback){
    //console.log('id from upgradeuser query.........');
  //  console.log(id);
    return User.findById(id)
    .then((user) => {
  //  console.log("user infor after user.findById(id)...........");
  //  console.log(user);
      if(!user){
        return callback("user not found");
      }
      user.update(
        {role: 2},
        {where: {id: id}}
      )
      .then((res) => {
      //  callback(err);
      })
      .catch((err) => {
    //console.log("catch err to user upgrade....")
      // console.log(err);
        callback(err);
      });
    });
  },

//downgrade user role from 2 to 0
  downgradeUser(id, callback){
    return User.findById(id)
    .then((user) => {
      if(!user){
        return callback("user not found");
      }
      user.update(
        {role: 0},
        {where: {id: id}}
      )
      .then((res) => {
      //  console.log("response to user downgrade....")
      //  console.log(res);
        callback(err);
      })
      .catch((err) => {
        callback(err);
      });
    });
  }

}
