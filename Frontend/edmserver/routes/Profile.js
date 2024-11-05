var express = require('express')
var router = express.Router()

let pageData = {
    username: "",
    email: "",
    fullname: "",
    age: ""
}

router.get('/', function(req, res) {
    try {
        let profUser = req.session.user
        pageData.username = req.session.user.username
        pageData.email = req.session.user.email
        pageData.fullname = req.session.user.fullname
        pageData.age = req.session.user.age
        console.log(profUser)
    } catch (error) {
        console.log(error)
    }
    res.render('Profile', {
        title: "The Cloverpatch", 
        pageData,
        scriptName: "/javascripts/edm.js"
    })
})

module.exports = router; 