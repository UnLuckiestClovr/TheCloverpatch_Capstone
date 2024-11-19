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
const addItemEndpoint = "http://localhost:12000/basket/add/"
const getBasketEndpoint = "http://localhost:12000/basket/get/"
const deleteBasketEndpoint = "http://localhost:12000/basket/delete/"
const removeItemFromBasketEndpoint = "http://localhost:12000/basket/delete-item/"

// Add Item
router.post('/add/Flowers', async function(req, res, next) {
    try {
        const item = req.body;
        const bid = req.cookies.uid;

        const response = await fetch((addItemEndpoint+"Flowers"+"/"+bid), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message } = jsonData;

            res.status(200).send(message)
        } else {
            res.sendStatus(500)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post('/add/Food', async function(req, res, next) {
    try {
        const item = req.body;
        const bid = req.cookies.uid;

        const response = await fetch((addItemEndpoint+"Food"+"/"+bid), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message } = jsonData;

            res.status(200).send(message)
        } else {
            res.sendStatus(500)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


async function getUserBasket(bid, type) {
    try {

        const response = await fetch((getBasketEndpoint+type+"/"+bid), {
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
router.get('/get/:type', async function(req, res, next) {
    try {
        const bid = req.cookies.uid;
        const type = req.params.type

        const basket = await getUserBasket(bid, type)

        res.status(200).send(basket)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// Clear Basket
router.delete('/delete/:type', async function(req, res, next) {
    try {
        const bid = req.cookies.uid;
        const type = req.params.type

        const response = await fetch((deleteBasketEndpoint+type+"/"+bid), {
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
router.delete('/delete/:type/:itemid', async function(req, res, next) {
    try {
        const itemid = req.params.itemid;
        const type = req.params.type
        const bid = req.cookies.uid;

        const response = await fetch((removeItemFromBasketEndpoint+type+"/"+bid+"/"+itemid), {
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