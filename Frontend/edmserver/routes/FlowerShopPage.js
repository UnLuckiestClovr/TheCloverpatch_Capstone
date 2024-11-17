var express = require('express');
var router = express.Router();

router.get('/', async function(req, res) {
    const flowerlist = await GetFlowers() 

    let boolLog = false
    if(req.cookies && req.cookies.uid) {
        boolLog = true;
    }

    res.render('FlowerShopPage', {
        title: "The Cloverpatch", 
        loggedInBool: boolLog,
        flowers: flowerlist,
        scriptName: "/javascripts/flowershop.js"
    })
})


async function GetFlowers() 
{
    try {
        const response = await fetch('http://0.0.0.0:12002/flowers/get-current-month', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const flowers = await JSON.parse(data.flowers);

        console.log(flowers)

        return flowers;
    } catch (error) {
        console.log(error)
        return []
    }
}

module.exports = router;