try {
    // OVERlAY SCRIPTS
    const addOverlay = document.getElementById('BasketAddOverlay')
    const productDetails = document.getElementById('productDetails')
    const addedView = document.getElementById('productAdded')


    addOverlay.style.display = 'none'
    productDetails.style.display = 'block'
    addedView.style.display = 'none'


    function ShowOverlay() {
        addOverlay.style.display = 'block'
        productDetails.style.display = 'block'
        addedView.style.display = 'none'
    }

    function HideOverlay() {
        addOverlay.style.display = 'none'
        productDetails.style.display = 'block'
        addedView.style.display = 'none'
    }


    function ShowAddDetails() {
        addOverlay.style.display = 'block'
        productDetails.style.display = 'block'
        addedView.style.display = 'none'
    }

    function ShowAddedView() {
        addOverlay.style.display = 'block'
        productDetails.style.display = 'none'
        addedView.style.display = 'block'
    }

    document.getElementById('CancelAdd').addEventListener('click', function() {
        HideOverlay()
    })

    document.getElementById('ReturnBtn').addEventListener('click', function() {
        HideOverlay()    
    })


    // MATH SCRIPTS AND PRICE FUNCTIONS
    const confirmBTN = document.getElementById('ConfirmAdd')
    const outputBox = document.getElementById('PriceOutput')
    const quantInput = document.getElementById('ProductQuantity')

    function updateFinalPrice() {
        const quantity = parseInt(quantInput.value)
        const pricePer = parseFloat(confirmBTN.getAttribute('data-costper'))

        if (parseInt(quantity) <= 0) {
            quantInput.value = 1
            quantity = 1
        }

        if(!isNaN(quantity)) {
            const total = (pricePer * quantity)
            const roundedTotal = (total.toFixed(2))
            outputBox.innerHTML = ("Final Cost: $" + roundedTotal)
        }
    }

    document.getElementById('increaseQuantityButton').addEventListener('click', function () {
        console.log("Increasing Quantity")
        const currentV = parseInt(quantInput.value)
        quantInput.value = (currentV + 1)
        updateFinalPrice()
    })

    document.getElementById('decreaseQuantityButton').addEventListener('click', function () {
        console.log("Decreasing Quantity")
        const currentV = parseInt(quantInput.value)
        if (currentV > 1) {
            quantInput.value = (currentV - 1)
        }
        updateFinalPrice()
    })

    quantInput.addEventListener('input', function() {
        updateFinalPrice()
    })
    
    
    // CONFIRM BASKET ADD

    const buttons = document.querySelectorAll('.basketButton');
    buttons.forEach(function(button) {
        button.addEventListener('click', function () {
            const productName = button.getAttribute('data-product');
            const productID = button.getAttribute('data-iid')
            const productIDRequired = button.getAttribute('data-idrequired')
            const productCostPer = button.getAttribute('data-cost');

            confirmBTN.setAttribute('data-iid', productID)
            confirmBTN.setAttribute('data-product', productName)
            confirmBTN.setAttribute('data-idrequired', productIDRequired)
            confirmBTN.setAttribute('data-costper', productCostPer)

            ShowOverlay()
            updateFinalPrice()
        });
    });


    confirmBTN.addEventListener('click', async function() {
        try {

            const productName = confirmBTN.getAttribute('data-product');
            const productIDRequired = (confirmBTN.getAttribute('data-idrequired') === 'true');
            const productID = confirmBTN.getAttribute('data-iid')
            const quantity = parseInt(quantInput.value)
            const finalPrice = parseFloat(quantity*parseFloat(confirmBTN.getAttribute('data-costper'))).toFixed(2)

            const product = {
                "IID": productID,
                "Name": productName,
                "Quantity": quantity,
                "IDRequired": productIDRequired,
                "Price": parseFloat(finalPrice).toFixed(2)
            }


            console.log(product)

            const response = await fetch('/basket/add/Food', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })

            if (response.ok) {
                ShowAddedView();
            }

        } catch (error) {
            console.log(error)
        }
    })
} catch (error) {
    console.log(error)
}