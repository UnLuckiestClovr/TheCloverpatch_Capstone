var express = require('express');
var router = express.Router();

router.get('/', async function(req, res) {
    const fList = await getFood();
    const dList = await getDrinks();

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
    try {
        const response = await fetch('http://0.0.0.0:12003/products/fetch/food', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const food = await JSON.parse(data.food);

        console.log
        console.log(food)

        return food;
    } catch (error) {
        console.log(error)
        return []
    }
    
}

async function getDrinks() {
    try {
        const response = await fetch('http://0.0.0.0:12003/products/fetch/drinks', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const drinks = await JSON.parse(data.drinks);

        console.log(drinks)

        return drinks;
    } catch (error) {
        console.log(error)
        return []
    }
}

module.exports = router;