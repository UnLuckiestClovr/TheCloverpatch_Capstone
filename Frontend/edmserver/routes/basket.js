var express = require('express')
var router = express.Router()


router.get('/', async function(req, res, next) {
    const basket = await getUserBasket(req.cookies.uid)

    const basketData = basket.value

    console.log(basketData)

    let boolLog = false
    if(req.cookies && req.cookies.uid) {
        boolLog = true;
    }

    res.render('basketpage', { 
        title: 'The Cloverpatch', 
        basketData: basketData,
        loggedInBool: boolLog,
        scriptName: "/javascripts/basketscript.js"
    });
});


// API Endpoints
const addItemEndpoint = "http://localhost:12000/basket/add-item/"
const getBasketEndpoint = "http://localhost:12000/basket/get/"
const deleteBasketEndpoint = "http://localhost:12000/basket/delete/"
const removeItemFromBasketEndpoint = "http://localhost:12000/basket/delete-item/"

// Add Item
router.post('/add-item', async function(req, res, next) {
    try {
        const item = req.body;
        const bid = req.cookies.uid;

        const response = await fetch((addItemEndpoint+bid), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message } = jsonData;

            res.status(code).send(message)
        } else {
            res.sendStatus(500)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


async function getUserBasket(bid) {
    try {

        const response = await fetch((getBasketEndpoint+bid), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { value } = jsonData;

            return { value }
        } else {
            return {}
        }
    } catch (error) {
        console.log(error)
    }
}

// Get Basket
router.get('/get', async function(req, res, next) {
    try {
        const bid = req.cookies.uid;

        const basket = await getUserBasket(bid)

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message } = jsonData;

            res.status(code).send(message)
        } else {
            res.sendStatus(500)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// Clear Basket
router.delete('/delete', async function(req, res, next) {
    try {
        const bid = req.cookies.uid;

        const response = await fetch((deleteBasketEndpoint+bid), {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message } = jsonData;

            res.status(code).send(message)
        } else {
            res.sendStatus(500)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// Remove Item From Basket
router.delete('/delete-item/:itemid', async function(req, res, next) {
    try {
        const itemid = req.params.itemid;
        const bid = req.cookies.uid;

        const response = await fetch((removeItemFromBasketEndpoint+bid+"/"+itemid), {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message } = jsonData;

            res.status(code).send(message)
        } else {
            res.sendStatus(500)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


module.exports = router