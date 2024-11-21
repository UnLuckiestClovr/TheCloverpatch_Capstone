var express = require('express')
var router = express.Router()


async function getBothBaskets(bid) {
    try {
        const response = await fetch((`http://localhost:12000/basket/get-all/${bid}`), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log(response)

        if (response.ok) {
            const jsonData = await response.json();
            const { flowers, food } = jsonData;

            return { flowers, food }
        } else {
            return {}
        }
    } catch (error) {
        console.log(error)
    }
}


router.get('/', async function(req, res, next) {
    const baskets = await getBothBaskets(req.cookies.uid)

    const flowers = baskets.flowers
    const food = baskets.food

    console.log(baskets)

    let boolLog = false
    if(req.cookies && req.cookies.uid) {
        boolLog = true;
    }

    res.render('basketpage', { 
        title: 'The Cloverpatch', 
        flowerBasket: flowers,
        foodBasket: food,
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

// Get All Baskets
router.get("/get-all", async function(req, res, next) {
    try {
        const bid = req.cookies.uid;

        const response = await fetch((`http://localhost:12000/basket/get-all/${bid}`), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { flowers, food } = jsonData;

            res.status(200).send({ flowers, food })
        } else {
            return {}
        }
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
            const { message } = jsonData;

            res.status(200).send(message)
        } else {
            res.sendStatus(500)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


module.exports = router