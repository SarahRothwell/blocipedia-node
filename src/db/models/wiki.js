'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull:false
    },
    body: {
      type: DataTypes.STRING,
      allowNull:false
    },
    private:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull:false,
  /*    set: function(value) {
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        this.setDataValue('private', value);
      }
      */
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Wiki.associate = function(models) {

    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };

  return Wiki;
};
