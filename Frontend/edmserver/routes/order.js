var express = require('express')
var router = express.Router()


// API Endpoints
const createFlowerOrderEndpoint = 'http://localhost:12001/order/create-order/flowers/' // "/{BID}/{Email}"
const createFoodOrderEndpoint = 'http://localhost:12001/order/create-order/food/' // "/{BID}/{Email}"
const getOrderByIDEndpoint = 'http://localhost:12001/order/fetch/' // "/{OID}"
const getAllOrdersByUserEndpoint = 'http://localhost:12001/order/fetch-all' // "/{UID}"
const cancelOrderEndpoint = 'http://localhost:12001/order/cancel' // "/{UID}/{OID}"


router.get('/:type/:orderid', async function(req, res, next) {
    const orderid = req.params.orderid;
    const type = req.params.type;

    let boolLog = false
    if(req.cookies && req.cookies.uid) {
        boolLog = true;
    }

    const response = await fetch((getOrderByIDEndpoint+type+"/"+orderid), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })

    console.log(`RESPONSE: ${response}`)

    if (response.ok) {
        const jsonData = await response.json();
        console.log(`JSON: ${JSON.stringify(jsonData)}`)
        const { order } = jsonData;
        
        console.log(`ORDER: ${order}`)

        const orderData = JSON.parse(order)

        console.log(`order: ${orderData}`)

        res.render('orderdetails', { 
            title: 'The Cloverpatch', 
            orderData: orderData,
            loggedInBool: boolLog,
            scriptName: "/javascripts/basketscript.js"
        });
    }
});


async function GetUserEmail(UID) {
    const response = await fetch(("http://localhost:12004/user/retrieve-data/"+UID), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })

    userData = await response.json()

    console.log(userData.data.email)

    return userData.data.email
}

// Create Flower Order
router.post("/create-order/flowers", async function(req, res, next) {
    try {
        const bid = req.cookies.uid
        const email = await GetUserEmail(bid)
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
        const bid = req.cookies.uid
        const email = await GetUserEmail(bid)
        const food = req.body

        console.log(`Food: ${JSON.stringify(food)}`)

        const response = await fetch(`http://localhost:12001/order/create-order/food/${bid}/${email}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(food)
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
router.get("/fetch/:type/:oid", async function(req, res, next) {
    try {
        const oid = req.params.oid;
        const type = req.params.type

        const response = await fetch((getOrderByIDEndpoint+type+"/"+oid), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { message, data } = jsonData;

            res.status(200).send(message)
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