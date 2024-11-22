var express = require('express')
var router = express.Router()


router.get('/', async function(req, res) {
    try {
        let boolLog = false
        if(req.cookies && req.cookies.uid) {
            boolLog = true;
        }

        let jsonData = {}
        if (boolLog) {
            const response = await fetch(("http://localhost:12004/user/retrieve-data/"+req.cookies.uid), {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const flowersResponse = await fetch(('http://localhost:12001/order/fetch-all/flowers/'+req.cookies.uid), {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const foodResponse = await fetch(('http://localhost:12001/order/fetch-all/food/'+req.cookies.uid), {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            jsonData = await response.json();
            const flowerOrders = await flowersResponse.json();
            const foodOrders = await foodResponse.json()

            console.log("Orders:")
            console.log(flowerOrders)
            console.log(foodOrders)

            let flOrders = []
            let foOrders = []

            if (flowerOrders.success) { flOrders = JSON.parse(flowerOrders.orders) }
            if (foodOrders.success) { foOrders = JSON.parse(foodOrders.orders) }

            res.render('Profile', {
                title: "The Cloverpatch", 
                loggedInBool: boolLog,
                pageData: jsonData.data,
                flowerOrders: flOrders,
                cafeOrders: foOrders,
                scriptName: "/javascripts/edm.js"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router; 