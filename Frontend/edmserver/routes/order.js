var express = require('express')
var router = express.Router()

// API Endpoints
const createFoodOrderEndpoint = 'http://localhost:8080/order/create-order/food' // "/{BID}/{Email}"
const createFlowerOrderEndpoint = 'http://localhost:8080/order/create-order/flower' // "/{BID}/{Email}"
const getOrderByIDEndpoint = 'http://localhost:8080/order/fetch' // "/{OID}"
const getAllOrdersByUserEndpoint = 'http://localhost:8080/order/fetch-all' // "/{UID}"
const cancelOrderEndpoint = 'http://localhost:8080/order/cancel' // "/{UID}/{OID}"


// Create Food Order
router.post("/create-order/food", async function(req, res, next) {
    try {

        const email = req.cookies.email
        const bid = req.cookies.uid

        const response = await fetch((createFoodOrderEndpoint+"/"+bid+"/"+email), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message } = jsonData;

            res.status(code).send(message)
        }


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// Create Flower Order
router.post("/create-order/flower", async function(req, res, next) {
    try {

        const email = req.cookies.email
        const bid = req.cookies.uid
        const addInfo = req.body

        const response = await fetch((createFlowerOrderEndpoint+"/"+bid+"/"+email), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addInfo)
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message } = jsonData;

            res.status(code).send(message)
        }


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// Fetch Order by ID
router.get("/fetch/:oid", async function(req, res, next) {
    try {
        const oid = req.params.oid;

        const response = await fetch((getOrderByIDEndpoint+"/"+oid), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addInfo)
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message, data } = jsonData;

            res.status(code).send(message)
        }


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// Fetch All of a User's Orders
router.get("/fetch-all:uid", async function(req, res, next) {
    try {
        const uid = req.params.uid;

        const response = await fetch((getAllOrdersByUserEndpoint+"/"+uid), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message } = jsonData;

            res.status(code).send(message)
        }


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// Cancel Order
router.get("/cancel/:oid", async function(req, res, next) {
    try {
        const oid = req.params.oid;

        const response = await fetch((cancelOrderEndpoint+"/"+oid), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message } = jsonData;

            res.status(code).send(message)
        }


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


module.exports = router