var express = require('express');
var router = express.Router();
const db = require("../db/models/database");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST register user */
router.post("/register", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    const err = {
      "error": "missing_field", 
      "message": "Missing field(s)"
    };
    res.status(400);
    res.send(err);
  } else {
    const newUser = db.user.build({
      username: username
    });
    newUser.generateHash(password)
      .then(() => {
        const reg = newUser.save();
        return reg;
      })
      .then((reg) => {
        const data = {
          "message": "user created",
          "data": reg.id
        }
        res.status(200);
        res.send(data);
      })
     .catch(error => {
        const err = {
          "error": "db_error", 
          "message": "Database error",
          "data": error
        };
        res.status(500);
        res.send(err);
    });
  }
})

/* GET login user */
router.get("/login", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    const err = {
      "error": "missing_field", 
      "message": "Missing field(s)"
    };
    res.status(400);
    res.send(err);
  } else {
    try{
      const user = await db.user.findOne({
        where:{
          username: username
        }
      });
      
      let status = 0;
      let data = {};
      
      if (user == null) {
        status = 404;
        data = {
          "message": "Username not found"
        }
      } else {
        //user.validatePassword(password);
        status = 200;
        data = {
          "message": "Success",
          "data": user
        }
      }
      res.status(status);
      res.send(data);
    } catch(error) {
      const err = {
        "error": "db_error", 
        "message": "Database error",
        "data": error
      };
      res.status(500);
      res.send(err);
    }
  }
})
module.exports = router;
