var express = require('express')
var router = express.Router()

router.post('/', (req, res) => {
    console.log('Started Logout Process. . .')
    req.session.destroy((err) => {
        if (err) {
            console.error('Error Logging Out:', err)
            res.sendStatus(500)
        } else {
            res.redirect('/LoginorRegister')
        }
    })
})

module.exports = router