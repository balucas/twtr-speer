module.exports = (sequelize, DataTypes) => {
  const User= sequelize.define(
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

  return User;
};
