var express = require('express')
var router = express.Router()


router.get('/', async function(req, res) {
    try {
        let boolLog = false
        if(req.cookies && req.cookies.uid) {
            boolLog = true;
        }

        let jsonData = {}
        if (boolLog) {
            const response = await fetch(("http://localhost:12004/user/retrieve-data/"+req.cookies.uid), {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            console.log(response)

            jsonData = await response.json();

            const userData = jsonData.data

            console.log(jsonData)

            res.render('Profile', {
                title: "The Cloverpatch", 
                loggedInBool: boolLog,
                pageData: userData,
                scriptName: "/javascripts/edm.js"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router; 