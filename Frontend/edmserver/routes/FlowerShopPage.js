var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

    let boolLog = false
    if(req.cookies && req.cookies.uid) {
        boolLog = true;
    }
    
    res.render('FlowerShopPage', {
        title: "The Cloverpatch", 
        loggedInBool: boolLog,
        month: currentMonth,
        scriptName: "/javascripts/flowershop.js"
    })
})

module.exports = router;