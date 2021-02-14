const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db/models/database");
const config = require("../config.js");

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
    // Creating user
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
      // Querying user
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
        res.status(status);
        res.send(data);
      } else {
        user.validatePassword(password)
          .then(isValid => {
            // Handle authentication
            if (isValid) {
              // Create jwt token
              const token = jwt.sign({ username: username },
                config.secret,
                { expiresIn: "24h" });
              status = 200;
              data = {
                "message": "Success",
                "token": token 
              };
            } else {
              status = 200;
              data = {
                "message": "Wrong password",
                "data": user.id
              };
            }
            
            res.status(status);
            res.send(data);
          });
      }
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
