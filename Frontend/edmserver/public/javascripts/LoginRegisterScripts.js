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
            const response = await fetch('/user/login', {
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


    document.getElementById('registerBTN').addEventListener('click', async() => {
        try {
            const uName = await document.getElementById('uReg').value
            const uPswrd = await document.getElementById('pReg').value
            const uEmail = await document.getElementById('eReg').value
            
            regErrors.innerHTML = ''; // Clear previous errors

            if(uName === "" || uPswrd === "" || uEmail === "") {
                regErrors.innerHTML = "<p> Profile Inputs cannot be Empty. </p>"
                return
            }

            const newUser = {
                Username: uName,
                Password: uPswrd,
                Email: uEmail
            }

            const response = await fetch('/user/register', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })

            console.log(response)
            if(response.ok) {
                window.location.href = "/LoginorRegister"
            } else {
                console.log(response)
                console.log("Registry Failure")
                const data = await response.json();
                console.log(data)
                const errors = await JSON.parse(data.body);
                console.log(error)
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


