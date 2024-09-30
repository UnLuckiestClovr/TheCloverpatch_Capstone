try {
    document.getElementById('LogoutBTN').addEventListener('click', async function() {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok) {
            console.log("Logged Out")
            window.location.href = "/LoginorRegister"
        } else {
            console.log("Issue within Logout")
        }
    })


} catch (error) {}