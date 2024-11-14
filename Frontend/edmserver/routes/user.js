var express = require('express')
var router = express.Router()


// Endpoint Links
const loginEndpoint = 'http://localhost:12004/user/login'
const registerEndpoint = 'http://0.0.0.0:12004/user/register'
const updateEndpoint = 'http://localhost:12004/user/update-user-info'
const changePasswordEndpoint = 'http://localhost:12004/user/update-user-password/'
const deleteEndpoint = 'http://localhost:12004/user/delete'
const accountDataEndpoint = 'http://localhost:12004/user/retrieve-data/'

function validateUsername(username) {
    const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return usernameRegex.test(username);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-]).+$/;
    return passwordRegex.test(password);
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function validateForm(uName, uPswrd, uEmail) {
    let errors = [];

    if (!validateUsername(uName)) {
        errors.push("Username must have all required parameters.");
    }
    if (!validatePassword(uPswrd)) {
        errors.push("Password must have all required parameters.");
    }
    if (!validateEmail(uEmail)) {
        errors.push("Invalid email.");
    }

    if (errors.length > 0) {
        return errors; // Return false if there are errors
    }

    return true; // Return true if all validations passed
}


router.get('/get', async function(req, res, next) {
    try {
        const userid = req.cookies.uid

        if (userid !== null) {
            const response = await fetch((accountDataEndpoint+userid), {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const jsonData = await response.json();
            res.status(200).send(jsonData)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// Login
router.post('/login', async function(req, res, next) {
    try 
    {
        const loginData = req.body

        console.log(loginData)

        const response = await fetch(loginEndpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        if (response.ok) {
            const jsonData = await response.json();
            const { code, message, data: userData } = jsonData;

            console.log(userData)

            // Sets Cookies for 1 Week
            await res.cookie('uid', userData.id, { httpOnly: true, maxAge: 604800000 })

            res.status(code).send(message);
        }
        else {
            res.status(500).send(message)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


// Register
router.post('/register', async function(req, res, next) {
    try 
    {
        console.log("User Register Called")
        const regData = req.body

        console.log(regData)

        console.log(JSON.stringify(regData))

        const errors = validateForm(regData.Usermame, regData.Password, regData.Email)

        if (errors.length > 0) {
            console.log("Registration Data Valid: Beginning Register Process")
            const response = await fetch(registerEndpoint, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(regData)
            })
    
            if (response.ok) {
                res.sendStatus(200)
            }
            else {
                res.sendStatus(500)
            }
        }
        else {
            console.log("Registration Data Invalid")
            res.status(400).send(JSON.stringify(errors))
        }

        
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


// Update
router.get('/update', async function(req, res, next) {
    try 
    {
        const updateInfo = req.body

        const response = await fetch(updateEndpoint, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateInfo)
        })

        if (response.ok) {
            res.sendStatus(200)
        }
        else {
            res.sendStatus(500)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


// Change Password
router.get('/update-user-password', async function(req, res, next) {
    try 
    {
        const email = req.cookie.email
        const updateInfo = req.body

        const response = await fetch(changePasswordEndpoint+email, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateInfo)
        })

        if (response.ok) {
            res.sendStatus(200)
        }
        else {
            res.sendStatus(500)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


// Delete User Account
router.get('/delete', async function(req, res, next) {
    try 
    {
        const deleteInfo = req.body

        const response = await fetch(deleteEndpoint, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteInfo)
        })

        res.clearCookie('uid');

        if (response.ok) {
            res.sendStatus(200)
        }
        else {
            res.sendStatus(500)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


// Log Out
router.post('/logout', (req, res) => {
    console.log('Started Logout Process. . .')

    try {
        res.clearCookie('uid');

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
})


module.exports = router