var express = require('express');
var router = express.Router();

router.get('/', function(req, res) { 
    let boolLog = false
    if(req.session === undefined) {
        boolLog = false
    } else {
        boolLog = (req.session.user !== null && req.session.user !== undefined)
        //- console.log("Session User: ", req.session.user)
    }
    
    res.render('RegisterorLoginPage', {
        title: "The Cloverpatch", 
        loggedInBool: boolLog,
        scriptName: "/javascripts/LoginRegisterScripts.js"
    })
})

module.exports = router;