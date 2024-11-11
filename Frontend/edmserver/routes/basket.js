var express = require('express')
var router = express.Router()

// API Endpoints
const addItemEndpoint = "http//localhost:8080/basket/add-item/"
const getBasketEndpoint = "http//localhost:8080/basket/get/"
const deleteBasketEndpoint = "http//localhost:8080/basket/delete/"
const removeItemFromBasketEndpoint = "http//localhost:8080/basket/delete-item/"

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

// Get Basket
router.get('/get', async function(req, res, next) {
    try {
        const bid = req.cookies.uid;

        const response = await fetch((getBasketEndpoint+bid), {
            method: "GET",
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