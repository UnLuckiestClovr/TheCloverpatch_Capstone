try {
    const orderOverlay = document.getElementById('orderOverlay');
    const orderDetails = document.getElementById('orderDetails');
    const orderedView = document.getElementById('ItemOrdered');
    const errorbox = document.getElementById('ERRORBOX');

    orderOverlay.style.display = 'none'
    orderDetails.style.display = 'block'
    orderedView.style.display = 'none'


    document.getElementById('EnactOrderFromBasketBTN').addEventListener('click', async () => {
        orderOverlay.style.display = 'block'
        orderDetails.style.display = 'block'
        orderedView.style.display = 'none'
    })

    document.getElementById('cancelOrder').addEventListener('click', async () => { // Cancel Order [ Returns you to basic Basket View ]
        orderOverlay.style.display = 'none'
        orderDetails.style.display = 'block'
        orderedView.style.display = 'none'
    })

    document.getElementById('ConfirmOrder').addEventListener('click', async () => { // Confirm Order [ Confirms Order, sends Order Request, if successful it gives you a small view of "Success" ]
        const recName = await document.getElementById('NameInput').value;
        const phone = await document.getElementById('PhoneInput').value;
        const add1 = await document.getElementById('AddressInput1').value;
        const add2 = await document.getElementById('AddressInput2').value;
        const state = await document.getElementById('StateInput').value;
        const zip = await document.getElementById('ZipInput').value;

        const cardNum = await document.getElementById('AddressInput2').value;
        const exDate = await document.getElementById('NameInput').value;
        const cvv = await document.getElementById('NameInput').value;

        if(recName === "" || phone === "" || add1 === "" || add2 === "" || state === "" || zip === "") {
            errorbox.innerHTML = "Inputs Cannot be left Empty"
            return
        }

        if (cardNum === "" || exDate === ""|| cvv ==="") {
            errorbox.innerHTML = "Card Information Invalid"
            return
        }

        const addInfo = {
            "RecipientName": recName,
            "PhoneNumber": phone,
            "AddressLine1": add1,
            "AddressLine2": add2,
            "State": state,
            "Zipcode": zip
        }

        console.log(addInfo)

        const response = await fetch('/order/create-order', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addInfo)
        })

        if (response.ok) {
            await fetch('/basket/delete', {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            orderDetails.style.display = 'none'
            orderedView.style.display = 'block'
        } 
        else {
            errorbox.innerHTML = response.message
        }

    })

    document.getElementById('ReturnBtn').addEventListener('click', async () => {
        window.location.href = "/profile"
    })
} catch (error) {
    console.log(error)
}