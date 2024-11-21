try {
    const outputBox = document.getElementById('PriceOutput')
    
    let itemid = ''

    const buttons = document.querySelectorAll('.orderButton');
    buttons.forEach(function(button) {
        button.addEventListener('click', function () {
            const flowerSpecies = button.getAttribute('data-flower');
            const flowerCostPer = button.getAttribute('data-cost');
            itemid = button.getAttribute('data-iid')
            OrderFlowers(flowerSpecies, flowerCostPer);
        });
    });

    const orderPageView = document.getElementById('orderDetails')
    const orderedView = document.getElementById('ItemOrdered')

    orderPageView.style.display = 'block'
    orderedView.style.display = 'none'

    function switchView_OrderPage() {
        orderPageView.style.display = 'block'
        orderedView.style.display = 'none'
    }

    function switchView_OrderedPage() {
        orderPageView.style.display = 'none'
        orderedView.style.display = 'block'
    }


    const quantInput = document.getElementById('ProductQuantity')
    quantInput.value = "1"
    const quantity = parseInt(quantInput.value)
    const pricePer = parseFloat(productSelector.value)
    if(!isNaN(quantity)) {
        const total = (pricePer * quantity)
        const roundedTotal = (total.toFixed(2))
        console.log("Current Price: $", roundedTotal)
        outputBox.innerHTML = ("Final Cost: $" + roundedTotal)
    }

    function updateFinalPrice() {
        const quantity = parseInt(quantInput.value)
        const pricePer = parseFloat(productSelector.value)

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

    document.getElementById('ConfirmAdd').addEventListener('click', async function() {        
        try {
            const productName = document.getElementById("orderProductNameDisplay").innerText.replace("You Are Viewing: ", "").trim();
            const quantity = parseInt(quantInput.value)
            const pricePer = parseFloat(productSelector.value)
            const variant = productSelector.options[productSelector.selectedIndex].text.split(" - ")[0].trim()
            const finalPrice = parseFloat(pricePer*quantity).toFixed(2);

            const item = {
                "IID": itemid,
                "Name": productName,
                "Quantity": quantity,
                "Variant": variant,
                "Price": finalPrice
            }

            console.log(item)

            const response = await fetch('/basket/add/Flowers', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })

            if (response.ok) {
                switchView_OrderedPage()
            }

        } catch (error) {
            console.log(error)
        }
    })

    document.getElementById('CancelAdd').addEventListener('click', function() {
        itemid = ''
        orderOverlayOff()
        switchView_OrderPage()
    })

    document.getElementById('ReturnBtn').addEventListener('click', function() {
        itemid = ''
        orderOverlayOff()
        switchView_OrderPage()        
    })


    const productSelector = document.getElementById('ProductOptions')
    productSelector.addEventListener('change', function () {
        const selectedV = productSelector.value;
        console.log('Selected Product Value: ', selectedV)
        updateFinalPrice()
    })

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

    async function OrderFlowers(FlowerSpecies, FlowerCost) {
        console.log("Clicked Order on: ", FlowerSpecies);

        let displayName = document.getElementById('orderProductNameDisplay')
        displayName.innerHTML = ("You Are Viewing: " + FlowerSpecies)

        let options = document.querySelectorAll('#ProductOptions option')
        options.forEach(option => {
            let newValue;
            switch (option.textContent.split(' - ')[0]) {
                case 'Single Flowers':
                    newValue = FlowerCost;
                    break;
                case 'Bouquet':
                    newValue = FlowerCost * 8;
                    break;
                case 'Bouquet in Vase':
                    newValue = (FlowerCost * 8) + 6;
                    break;
                case 'Fresh Flowers in Full Pot':
                    newValue = (FlowerCost * 14) + 16;
                    break;
            }

            // Update the option's value and text
            option.value = parseFloat(newValue).toFixed(2);
            option.textContent = option.textContent.replace(/-\s*\$\d+\.\d{2}$/, `- $${parseFloat(newValue).toFixed(2)}`);
        });

        updateFinalPrice();

        orderOverlayOn();
    }

    function orderOverlayOn() {
        const overlayElement = document.getElementById('orderOverlay');
        overlayElement.style.display = 'block';
    }

    function orderOverlayOff() {
        const overlayElement = document.getElementById('orderOverlay');
        overlayElement.style.display = 'none';
        let displayName = document.getElementById('orderProductNameDisplay');
        displayName.innerHTML = ("You Are Ordering: ");
    }   
} catch (error) {
    console.log(error)
}