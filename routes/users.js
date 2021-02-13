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
    await newUser.generateHash(password);
    await newUser.save();
    
    const data = {
      "message": "user created" 
    }
    res.status(200);
    res.send(data);
  }
})
module.exports = router;
