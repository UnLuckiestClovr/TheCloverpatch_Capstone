var express = require('express')
var router = express.Router()

let pageData = {
    username: "",
    email: "",
    fullname: "",
    age: "",
    q1Ans: "",
    q2Ans: "",
    q3Ans: ""
}

router.get('/', function(req, res) {
    try {
        let profUser = req.session.user
        pageData.username = req.session.user.username
        pageData.email = req.session.user.email
        pageData.fullname = req.session.user.fullname
        pageData.age = req.session.user.age
        pageData.q1Ans = req.session.user.q1Ans
        pageData.q2Ans = req.session.user.q2Ans
        pageData.q3Ans = req.session.user.q3Ans
        console.log(profUser)
    } catch (error) {
        console.log(error)
    }
    res.render('Profile', {title: "The Cloverpatch", pageData})
})

module.exports = router; 