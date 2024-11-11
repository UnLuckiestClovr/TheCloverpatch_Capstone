var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    const fList = getFood();
    const dList = getDrinks();

    let boolLog = false
    if(req.session === undefined) {
        boolLog = false
    } else {
        boolLog = (req.session.user !== null && req.session.user !== undefined)
        //- console.log("Session User: ", req.session.user)
    }
    res.render('CoffeeShopPage', {
            title: "The Cloverpatch",
            loggedInBool: boolLog,
            scriptName: "/javascripts/edm.js",
            FoodList: fList,
            DrinkList: dList
        })
})

async function getFood() {
    const response = await fetch('http://localhost:12003/products/fetch/food', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateInfo)
    })

    return JSON.parse(response).data
}

async function getDrinks() {
    const response = await fetch('http://localhost:12003/products/fetch/drinks', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateInfo)
    })

    return JSON.parse(response).data
}

module.exports = router;