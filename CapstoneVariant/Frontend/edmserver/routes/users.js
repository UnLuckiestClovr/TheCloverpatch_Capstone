var express = require('express');
const User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  try{
    let user = req.session.user
    User.u_GET(user)

    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
  }
});

router.post('/register', async function(req, res, next) {
  console.log("Running Register")
  try {
    let user = req.body
    console.log(user)
    await User.u_CREATE(user)

    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
  }
})

router.post('/login', async function(req, res, next) {
  try {
    const loginData = req.body
    const logSuccess = await User.u_Login(loginData)
    if(logSuccess) {
      let username = loginData.username
      let userData = await User.u_GET(username)
      let fullname = userData.u_name
      let age = userData.u_age
      let email = userData.email
      let q1Ans = userData.q1Ans
      let q2Ans = userData.q2Ans
      let q3Ans = userData.q3Ans
      req.session.user = { username, fullname, email, age, q1Ans, q2Ans, q3Ans }
      res.sendStatus(200)
    } else {
      res.sendStatus(500)
    }
  } catch (error) {
    console.log(error)
  }
})

router.patch('/update', async function(req, res, next) {
  try {
    const userCurrentData = await User.u_GET(req.session.user.username)
    const updateData = req.body

    const uData = {
      currentData: userCurrentData,
      newData: updateData
    }

    const updateSuccess = await User.u_UPDATE(uData)
    if(updateSuccess) {
      const userData = await User.u_GET(updateData.username)
      let username = userData.username
      let fullname = userData.u_name
      let age = userData.u_age
      let email = userData.email
      let q1Ans = userData.q1Ans
      let q2Ans = userData.q2Ans
      let q3Ans = userData.q3Ans
      req.session.user = { username, fullname, email, age, q1Ans, q2Ans, q3Ans }
      res.sendStatus(200)
    } else {
      res.sendStatus(500)
    }
  } catch (error) {
    console.log(error)
  }
})

router.patch('/updatequestionaire', async function(req,res, next) {
  try {
    const userCurrentData = await User.u_GET(req.session.user.username)
    const updateData = req.body

    const uData = {
      currentData: userCurrentData,
      newData: updateData
    }

    const updateSuccess = await User.u_UPDATE(uData)
    if(updateSuccess) {
      const userData = await User.u_GET(req.session.user.username)
      let username = userData.username
      let fullname = userData.u_name
      let age = userData.u_age
      let email = userData.email
      let q1Ans = userData.q1Ans
      let q2Ans = userData.q2Ans
      let q3Ans = userData.q3Ans
      req.session.user = { username, fullname, email, age, q1Ans, q2Ans, q3Ans }

      res.sendStatus(200)
    } else {
      res.sendStatus(500)
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router; 
