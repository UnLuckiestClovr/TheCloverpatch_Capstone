var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let boolLog = false
  if(req.cookies && req.cookies.uid) {
    boolLog = true;
  }
  
  res.render('index', { 
    title: 'The Cloverpatch', 
    loggedInBool: boolLog,
    scriptName: "/javascripts/edm.js"
  });
});

module.exports = router;
