try {
    // JOINT SCRIPTS
    document.querySelectorAll('.ItemRemovalBTN').forEach(function(button) {
        button.addEventListener('click', async function () {
            itemid = button.getAttribute('data-iid')
            itemtype = button.getAttribute('data-type')

            await fetch(`/basket/delete/${itemtype}/${itemid}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            document.getElementById(itemid).remove()
        });
    });

    document.getElementById('ReturnBtn').addEventListener('click', async () => {
        window.location.href = "/basket"
    })


    async function INCREASE(iid, quant) {
        try {
            quant++;
            const quantElement = document.getElementById(`Quant_${iid}`)
            quantElement.innerHTML = `Quantity: ${quant}`
        } catch (error) {
            console.log(error)
        }
    }

    async function DECREASE(iid, quant) {
        try {
            quant--;
            console.log(quant)
            const quantElement = document.getElementById(`Quant_${iid}`)
            quantElement.innerHTML = `Quantity: ${quant}`
        } catch (error) {
            console.log(error)
        }
    }


    document.querySelectorAll('.quantity-btn').forEach(function(button) {
        button.addEventListener('click', async function () {
            let iid = button.getAttribute('data-iid')
            let action = button.getAttribute('data-action')
            let quant = await parseInt(await document.getElementById(`Quant_${iid}`).innerText.replace('Quantity: ', ''));

            console.log(`IID: ${iid} | Quantity: ${quant}`)

            if (action === 'increase') {
                await INCREASE(iid, quant);
            }
            else if (action === 'decrease') {
                if (quant === 1) {return}
                await DECREASE(iid, quant);
            }
        });
    })


    // ARTICLE TABS
    function showArticle(articleId) {
        // Hide all articles
        const articles = document.querySelectorAll('.baskArticle');
        articles.forEach(article => {
            article.classList.remove('active');
        });
    
        // Show the selected article
        const selectedArticle = document.getElementById(articleId);
        selectedArticle.classList.add('active');
    
        // Update active tab
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = Array.from(tabs).find(tab => tab.id === articleId.replace('View', 'Tab'));
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
    
    document.getElementById('FlowerBasketTab').addEventListener('click', () => {
        showArticle('FlowerBasketView')
    })
    
    document.getElementById('FoodBasketTab').addEventListener('click', () => {
        showArticle('FoodBasketView')
    })
} catch (error) {
    console.log(error)
}

try {
    // FLOWER STUFF ----------------------------------------------------------------------
    const flowerOrderOverlay = document.getElementById('flowerOrderOverlay');
    const flowerOrderDetails = document.getElementById('flowerOrderDetails');
    const flowerOrderedView = document.getElementById('flowerItemOrdered');
    const flowererrorbox = document.getElementById('flower_ERRORBOX');

    flowerOrderOverlay.style.display = 'none'
    flowerOrderDetails.style.display = 'block'
    flowerOrderedView.style.display = 'none'


    document.getElementById('flEnactOrderFromBasketBTN').addEventListener('click', async () => {
        flowerOrderOverlay.style.display = 'block'
        flowerOrderDetails.style.display = 'block'
        flowerOrderedView.style.display = 'none'
    })

    document.getElementById('flCancelOrder').addEventListener('click', async () => { // Cancel Order [ Returns you to basic Basket View ]
        flowerOrderOverlay.style.display = 'none'
        flowerOrderDetails.style.display = 'block'
        flowerOrderOverlay.style.display = 'none'
    })


    document.getElementById('flConfirmOrder').addEventListener('click', async () => { // Confirm Order [ Confirms Order, sends Order Request, if successful it gives you a small view of "Success" ]
        const recName = await document.getElementById('flNameInput').value;
        const phone = await document.getElementById('flPhoneInput').value;
        const add1 = await document.getElementById('flAddressInput1').value;
        const add2 = await document.getElementById('flAddressInput2').value;
        const state = await document.getElementById('flStateInput').value;
        const zip = await document.getElementById('flZipInput').value;

        const cardNum = await document.getElementById('flCardNumInput').value;
        const exDate = await document.getElementById('flExpiryDateInput').value;
        const cvv = await document.getElementById('flCVVInput').value;

        flowererrorbox.innerHTML = ""

        let errors = []
        if (recName === "") {
            errors.push("Name Cannot be Left Empty.\n")
        }
        if (phone === "") {
            errors.push("Phone Number Cannot be Left Empty.\n")
        }
        if (add1 === "") {
            errors.push("Address Line 1 Cannot be Left Empty.\n")
        }
        if (state === "") {
            errors.push("State Cannot be Left Empty.\n")
        }
        if (zip === "") {
            errors.push("Zipcode Cannot be Left Empty.\n")
        }
        if (cardNum === "") {
            errors.push("Card Number Cannot be Left Empty.\n")
        }
        if (exDate === "") {
            errors.push("Expiration Date Cannot be Left Empty.\n")
        }
        if (cvv ==="") {
            errors.push("CVV Cannot be Left Empty.\n")
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                flowererrorbox.innerHTML += error
            });
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

        const response = await fetch('/order/create-order/flowers', {
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

            flowerOrderDetails.style.display = 'none'
            flowerOrderedView.style.display = 'block'
        } 
        else {
            flowererrorbox.innerHTML = response.message
        }

    })
} catch (error) {
    console.log(error)
}

try {
    // FOOD STUFF ------------------------------------------------------------
    const foodOrderOverlay = document.getElementById('foodOrderOverlay');
    const foodOrderDetails = document.getElementById('foodOrderDetails');
    const foodOrderedView = document.getElementById('foodItemOrdered');
    const fooderrorbox = document.getElementById('food_ERRORBOX');

    foodOrderOverlay.style.display = 'none'
    foodOrderDetails.style.display = 'block'
    foodOrderedView.style.display = 'none'


    document.getElementById('foEnactOrderFromBasketBTN').addEventListener('click', async () => {
        foodOrderOverlay.style.display = 'block'
        foodOrderDetails.style.display = 'block'
        foodOrderedView.style.display = 'none'
    })

    document.getElementById('foCancelOrder').addEventListener('click', async () => { // Cancel Order [ Returns you to basic Basket View ]
        foodOrderOverlay.style.display = 'none'
        foodOrderDetails.style.display = 'block'
        foodOrderOverlay.style.display = 'none'
    })

    // FOOD ORDER BUTTON
    document.getElementById('foConfirmOrder').addEventListener('click', async () => { // Confirm Order [ Confirms Order, sends Order Request, if successful it gives you a small view of "Success" ]
        const recName = await document.getElementById('foNameInput').value;
        const phone = await document.getElementById('foPhoneInput').value;

        const cardNum = await document.getElementById('foCardNumInput').value;
        const exDate = await document.getElementById('foExpiryDateInput').value;
        const cvv = await document.getElementById('foCVVInput').value;


        fooderrorbox.innerHTML = ""

        let errors = []
        if (recName === "") {
            errors.push("Name Cannot be Left Empty.\n")
        }
        if (phone === "") {
            errors.push("Phone Number Cannot be Left Empty.\n")
        }
        if (cardNum === "") {
            errors.push("Card Number Cannot be Left Empty.\n")
        }
        if (exDate === "") {
            errors.push("Expiration Date Cannot be Left Empty.\n")
        }
        if (cvv ==="") {
            errors.push("CVV Cannot be Left Empty.\n")
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                fooderrorbox.innerHTML += error
            });
            return
        }

        

        const response = await fetch('/order/create-order/food', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })

        if (response.ok) {
            await fetch('/basket/delete', {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            foodOrderDetails.style.display = 'none'
            foodOrderedView.style.display = 'block'
        } 
        else {
            fooderrorbox.innerHTML = response.message
        }

    })



} catch (error) {
    console.log(error)
}