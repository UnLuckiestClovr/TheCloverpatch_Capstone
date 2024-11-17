try {
    const buttons = document.querySelectorAll('.orderButton');
    buttons.forEach(function(button) {
        button.addEventListener('click', function () {
            const flowerSpecies = button.getAttribute('data-flower');
            const flowerCostPer = button.getAttribute('data-cost');
            OrderFlowers(flowerSpecies, flowerCostPer);
        });
    });

    const addBTN = document.getElementById('ConfirmAdd')
    const cancelButton = document.getElementById('CancelAdd')
    const productSelector = document.getElementById('ProductOptions')
    const quantInput = document.getElementById('ProductQuantity')
    const incBtn = document.getElementById('increaseQuantityButton')
    const decBtn = document.getElementById('decreaseQuantityButton')
    const outputBox = document.getElementById('PriceOutput')

    const orderPageView = document.getElementById('orderDetails')
    const orderedView = document.getElementById('ItemOrdered')
    const returnBtn = document.getElementById('ReturnBtn')

    orderPageView.style.display = 'block'
    orderedView.style.display = 'none'

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

    addBTN.addEventListener('click', function() {        
        switchView_OrderedPage()
    })

    cancelButton.addEventListener('click', function() {
        orderOverlayOff()
    })

    returnBtn.addEventListener('click', function() {
        orderOverlayOff()
    })

    productSelector.addEventListener('change', function () {
        const selectedV = productSelector.value;
        console.log('Selected Product Value: ', selectedV)
        updateFinalPrice()
    })

    incBtn.addEventListener('click', function () {
        console.log("Increasing Quantity")
        const currentV = parseInt(quantInput.value)
        quantInput.value = (currentV + 1)
        updateFinalPrice()
    })

    decBtn.addEventListener('click', function () {
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

    function switchView_OrderPage() {
        orderPageView.style.display = 'block'
        orderedView.style.display = 'none'
    }

    function switchView_OrderedPage() {
        orderPageView.style.display = 'none'
        orderedView.style.display = 'block'
    }

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