var express = require('express');
var router = express.Router();
var DateTimeHandler = require('../dal/DatetimeFunctions')

router.get('/', function(req, res) {
    var currentMonth = DateTimeHandler.GETMONTH()

    let boolLog = false
    if(req.session === undefined) {
        boolLog = false
    } else {
        boolLog = (req.session.user !== null && req.session.user !== undefined)
        //- console.log("Session User: ", req.session.user)
    }
    res.render('FlowerShopPage', {
        title: "The Cloverpatch", 
        loggedInBool: boolLog,
        month: currentMonth
    })
})

module.exports = router;