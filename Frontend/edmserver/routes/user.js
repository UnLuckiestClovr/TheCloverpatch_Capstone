var express = require('express')
var router = express.Router()


// Endpoint Links
const loginEndpoint = 'http://localhost:5122/user/login'
const registerEndpoint = 'http://localhost:5122/user/register'
const updateEndpoint = 'http://localhost:5122/user/update-user-info'
const deleteEndpoint = 'http://localhost:5122/user/delete'

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
    const regErrors = document.getElementById('regErrors');
    regErrors.innerHTML = ''; // Clear previous errors
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
        regErrors.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
        return false; // Return false if there are errors
    }

    return true; // Return true if all validations passed
}

// Login
router.get('/login', async function(req, res, next) {
    try 
    {
        const loginData = req.body

        const response = await fetch(loginEndpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        if (response.ok) {
            res.sendStatus(200)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


// Register
router.get('/register', async function(req, res, next) {
    try 
    {
        const regData = req.body

        validateForm(regData.Usermame, regData.Password, regData.Email)

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

        if (response.ok) {
            res.sendStatus(200)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


// Log Out
router.post('/', (req, res) => {
    console.log('Started Logout Process. . .')
    req.session.destroy((err) => {
        if (err) {
            console.error('Error Logging Out:', err)
            res.sendStatus(500)
        } else {
            res.redirect('/LoginorRegister')
        }
    })
})


module.exports = router