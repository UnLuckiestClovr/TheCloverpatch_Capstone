var express = require('express');
var dal = require('../dal/Mongo_CRUD')
var router = express.Router();

const docArray = ['Question1', 'Question2', 'Question3']

router.get('/', function(req) {

})

router.get('/q1', async function(req, res, next) {
    try {
        const graphData = await dal.statGET('Question1')
        res.json({
            Ans1: graphData.Coffee,
            Ans2: graphData.Hot_Cocoa,
            Ans3: graphData.Tea,
            Ans4: graphData.None
        })
    }
    catch (error) {console.log(error)}
})

router.get('/q2', async function(req, res, next) {
    try {
        const graphData = await dal.statGET('Question2')
        res.json({
            Ans1: graphData.Vanilla,
            Ans2: graphData.Chocolate,
            Ans3: graphData.Strawberry,
            Ans4: graphData.Neopolitan,
            Ans5: graphData.Other
        })
    }
    catch (error) {console.log(error)}
})

router.get('/q3', async function(req, res, next) {
    try {
        const graphData = await dal.statGET('Question3')
        res.json({
            Ans1: graphData.Red,
            Ans2: graphData.Orange,
            Ans3: graphData.Yellow,
            Ans4: graphData.Green,
            Ans5: graphData.Blue,
            Ans6: graphData.Purple,
            Ans7: graphData.Violet
        })
    }
    catch (error) {console.log(error)}
})

module.exports = router