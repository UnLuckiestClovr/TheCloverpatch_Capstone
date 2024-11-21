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

            const ordersResponse = await fetch(('http://localhost:12001/order/fetch-all/'+req.cookies.uid), {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            jsonData = await response.json();
            orderList = await ordersResponse.json();

            const userData = jsonData.data
            const userOrders = JSON.parse(orderList.orders)

            console.log("Orders:")
            console.log(userOrders)

            res.render('Profile', {
                title: "The Cloverpatch", 
                loggedInBool: boolLog,
                pageData: userData,
                flowerOrders: userOrders,
                scriptName: "/javascripts/edm.js"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router; 