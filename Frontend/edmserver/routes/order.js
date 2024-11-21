var express = require('express')
var router = express.Router()


// API Endpoints
const createFlowerOrderEndpoint = 'http://localhost:12001/order/create-order/flowers/' // "/{BID}/{Email}"
const createFoodOrderEndpoint = 'http://localhost:12001/order/create-order/food/' // "/{BID}/{Email}"
const getOrderByIDEndpoint = 'http://localhost:12001/order/fetch/' // "/{OID}"
const getAllOrdersByUserEndpoint = 'http://localhost:12001/order/fetch-all' // "/{UID}"
const cancelOrderEndpoint = 'http://localhost:12001/order/cancel' // "/{UID}/{OID}"


router.get('/:orderid', async function(req, res, next) {
    const orderid = req.params.orderid;

    let boolLog = false
    if(req.cookies && req.cookies.uid) {
        boolLog = true;
    }

    const response = await fetch((getOrderByIDEndpoint+orderid), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        const jsonData = await response.json();
        const { order } = jsonData;

        const orderData = JSON.parse(order)

        console.log(orderData)

        res.render('orderdetails', { 
            title: 'The Cloverpatch', 
            orderData: orderData,
            loggedInBool: boolLog,
            scriptName: "/javascripts/basketscript.js"
        });
    }
});


// Create Flower Order
router.post("/create-order/flowers", async function(req, res, next) {
    try {

        const email = req.cookies.email
        const bid = req.cookies.uid
        const addInfo = req.body

        const response = await fetch((createFlowerOrderEndpoint+bid+"/"+email), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addInfo)
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { message } = jsonData;

            console.log(jsonData)

            res.status(200).send(message)
        }


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// Create Food Order
router.post("/create-order/food", async function(req, res, next) {
    try {

        const email = req.cookies.email
        const bid = req.cookies.uid

        const response = await fetch((createFoodOrderEndpoint+bid+"/"+email), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { message } = jsonData;

            console.log(jsonData)

            res.status(200).send(message)
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

        const response = await fetch((getOrderByIDEndpoint+oid), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
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
            }
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
router.delete("/cancel/:oid", async function(req, res, next) {
    try {
        const oid = req.params.oid;

        const response = await fetch((cancelOrderEndpoint+"/"+oid), {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
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