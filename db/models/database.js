const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_SCHEMA || "postgres",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: process.env.DB_SSL == "true",
    },
  }
);

const db = {};
const userModel = require("./user");

//define models 
db.user = userModel(sequelize, Sequelize.DataTypes);

//associate models
Object.keys(db).forEach( (model) => {
  if(db[model].associate){
    db[model].associate(db);  
  }
});

db.testConnection = async (seq) => {
  try {
    await seq.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to database: ", error);
  }
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;