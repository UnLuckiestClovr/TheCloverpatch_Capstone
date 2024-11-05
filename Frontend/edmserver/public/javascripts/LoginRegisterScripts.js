// - - - - - - - - - - - - - - - Login Scripts - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const loginRegTab = document.getElementById('userLoginOrReg')
const profileTab = document.getElementById('userProfile')

// const user = fetch('/users', {
//     method: "GET",
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(response.body)
// })

const outputTextBox = document.getElementById('OutputBox')
const regErrors = document.getElementById('regErrors')

async function LoginInvalid() {
    outputTextBox.innerHTML = "Login Unsuccessful: Username or Password Incorrect"
}

// - - - - - - - - - - - - - - - - - - - - RegLogin Page Scripts - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

try {
    document.getElementById('loginBTN').addEventListener('click', async () => {
        const uName = await document.getElementById('uLogin').value
        const uPswrd = await document.getElementById('pLogin').value

        console.log("User Input: ", {uName, uPswrd})

        if(uName === "" || uPswrd === "") {
            console.log('Inputs cannot be Empty')
            return
        }
        console.log("Inputs were Filled")

        const loginAuth = {
            AuthString: uName,
            Password: uPswrd
        }

        try {
            const response = await fetch('/users/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginAuth)
            })

            if(response.ok) {
                console.log("Login Successful")
                window.location.href = "/Profile"
            } else {
                LoginInvalid()
                console.log("Login Failure")
            }
        } catch (error) {
            //console.log(error)
        }
    })


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


    document.getElementById('registerBTN').addEventListener('click', async() => {
        const uName = await document.getElementById('uReg').value
        const uPswrd = await document.getElementById('pReg').value
        const uEmail = await document.getElementById('eReg').value

        if(uName === "" || uPswrd === "" || uEmail === "") {
            regErrors.innerHTML = "<p> Profile Inputs cannot be Empty. </p>"
            return
        }

        if (!validateForm()) { return; }

        const newUser = {
            Username: uName,
            Password: uPswrd,
            Email: uEmail
        }

        try {
            const response = await fetch('/users/register', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            if(response.ok) {
                window.location.href = "/LoginorRegister"
            } else {
                console.log("Registry Failure")
            }
        } catch (error) {
            console.log(error)
        }
    })

    const LoginView = document.getElementById('LoginView')
    const RegisterView = document.getElementById('RegisterView')
    const RegSwitch = document.getElementById('regViewSwitch')
    const LoginSwitch = document.getElementById('logViewSwitch')

    LoginSwitch.addEventListener('click', function () {
        changeViewtoLogin()
    })

    RegSwitch.addEventListener('click', function () {
        changeViewtoRegister()
    })

    function changeViewtoLogin() {
        LoginView.style.display = "block"
        RegisterView.style.display = "none"
    }

    function changeViewtoRegister() {
        RegisterView.style.display = "block"
        LoginView.style.display = "none"
    }
} catch (error) {}