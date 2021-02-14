const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      }, 
      password: {
        type: DataTypes.STRING(64)
      }
    },
    {}
  );
  
  User.prototype.generateHash = function(password) {
    return bcrypt.hash(password, 8)
      .then(hash => { this.password = hash; })
      .catch(err => { console.log("error"); });
  }

  User.prototype.validatePassword = function(password) {
    return bcrypt.compare(password, this.password)
      .then(result => { return result; })
      .catch(err => { console.log("error", err); });
  }
  return User;
};