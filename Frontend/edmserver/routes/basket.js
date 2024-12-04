var express = require('express')
var router = express.Router()


const BASKET_HOST = process.env.BASKET_HOST || 'localhost:12000';


async function getBothBaskets(bid) {
    try {
        const response = await fetch((`http://${BASKET_HOST}/basket/get-all/${bid}`), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

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


// Add Item
router.post('/add/Flowers', async function(req, res, next) {
    try {
        const item = req.body;
        const bid = req.cookies.uid;

        const response = await fetch(`http://${BASKET_HOST}/basket/add/Flowers/${bid}`, {
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

        const response = await fetch(`http://${BASKET_HOST}/basket/add/Food/${bid}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
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


async function getUserBasket(bid, type) {
    try {

        const response = await fetch(`http://${BASKET_HOST}/basket/get/${type}/${bid}`, {
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

        const response = await fetch((`http://${BASKET_HOST}/basket/get-all/${bid}`), {
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

//Update Basket Item Quantity
router.patch('/update/quantity/:type/:quant/:iid', async function(req, res, next) {
    try {
        const bid = req.cookies.uid;
        const type = req.params.type;
        const quant = req.params.quant;
        const iid = req.params.iid

        console.log(`Endpoint Call: http://${BASKET_HOST}/basket/update-quantity/${type}/${bid}/${quant}/${iid}`)
        
        const response = await fetch(`http://${BASKET_HOST}/basket/update-quantity/${type}/${bid}/${quant}/${iid}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: {}
        })

        if (response.ok) {
            res.status(200).send(response.json())
        } else {
            const errorData = await response.json();  // Await the JSON response for error
            console.log(errorData);
            res.status(500).send(errorData);
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

        const response = await fetch(`http://${BASKET_HOST}/basket/delete/${type}/${bid}`, {
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

        const response = await fetch(`http://${BASKET_HOST}/basket/delete-item/${type}/${bid}/${itemid}`, {
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