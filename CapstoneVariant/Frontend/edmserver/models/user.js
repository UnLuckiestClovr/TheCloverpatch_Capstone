var dal = require('../dal/Mongo_CRUD')

class User {
    constructor(username, email, u_name, age) {
        this.username = username
        this.email = email
        this.u_name = u_name
        this.age = age
    }
}

async function getUser(username) {
    const jsonData = dal.READ(username)
    return jsonData
}

async function createUser(userData) {
    const boolName = await validateUsername(userData.username)
    const boolPswrd = await validatePassword(userData.password)
    if(boolName == true && boolPswrd == true) {
        await dal.CREATE(userData.username, userData.email, userData.u_name, userData.u_age, userData.q1Ans, userData.q2Ans, userData.q3Ans)
        await hashPasswordThenStore(userData.username, userData.password)
    }

    if(boolName == false) {
        console.log("Username is not Valid")
    }
    if(boolPswrd == false){
        console.log("Password is not Valid")
    }
}

async function updateUser(userData) {
    try {
        dal.UPDATE(userData)
        return true
    }
    catch (error) {
        return false
    }
}

async function hashPasswordThenStore(username, plainPswrd) {
    await dal.StoreHash(username, plainPswrd)
}

async function login(loginData) {
    const valid = await dal.LOGIN(loginData)
    if(valid) {
        return true
    } else {
        return false
    }
}

async function validateUsername(username) {
    const taken = await dal.validUsername(username)
    if(!taken) {
        const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[1-9]).+$")
        const valid = regex.test(username)
        return valid
    }
    else {return false}
}

async function validatePassword(password) {
    const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[1-9])(?=.*[_)(+=!@#$%^&*]).+$")
    return regex.test(password)
}


module.exports = {
    User: User,
    u_CREATE: createUser,
    u_GET: getUser,
    u_UPDATE: updateUser,
    u_Login: login
}