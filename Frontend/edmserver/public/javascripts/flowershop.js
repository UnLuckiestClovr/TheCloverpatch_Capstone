const buttons = document.querySelectorAll('.orderButton');
buttons.forEach(function(button) {
    button.addEventListener('click', function () {
        const flowerSpecies = button.getAttribute('data-flower');
        OrderFlowers(flowerSpecies);
    });
});
        
const orderBtn = document.getElementById('ConfirmOrder')
const cancelButton = document.getElementById('cancelOrder')
const productSelector = document.getElementById('ProductOptions')
const quantInput = document.getElementById('ProductQuantity')
const incBtn = document.getElementById('increaseQuantityButton')
const decBtn = document.getElementById('decreaseQuantityButton')
const outputBox = document.getElementById('PriceOutput')
const NameInput = document.getElementById('NameInput')
const AddressInput = document.getElementById('AddressInput')
const PhoneInput = document.getElementById('PhoneInput')
const EmailInput = document.getElementById('EmailInput')

const orderPageView = document.getElementById('orderDetails')
const orderedView = document.getElementById('ItemOrdered')
const returnBtn = document.getElementById('ReturnBtn')

orderPageView.style.display = 'block'
orderedView.style.display = 'none'

NameInput.value = ""
AddressInput.value = ""
PhoneInput.value = ""
EmailInput.value = ""

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
    if(!isNaN(quantity)) {
        const total = (pricePer * quantity)
        const roundedTotal = (total.toFixed(2))
        console.log("Current Price: $", roundedTotal)
        outputBox.innerHTML = ("Final Cost: $" + roundedTotal)
    }
}

orderBtn.addEventListener('click', function() {
    const NameInput = document.getElementById('NameInput').value;
    const AddressInput = document.getElementById('AddressInput').value;
    const PhoneInput = document.getElementById('PhoneInput').value;
    const EmailInput = document.getElementById('EmailInput').value;
            
    if (NameInput !== "" && AddressInput !== "" && PhoneInput !== "" && EmailInput !== "") {
        switchView_OrderedPage();
    }
    else{console.log("Fields Required")}
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

async function OrderFlowers(FlowerSpecies) {
    console.log("Clicked Order on: ", FlowerSpecies);
    let displayName = document.getElementById('orderProductNameDisplay')
    displayName.innerHTML = ("You Are Ordering: " + FlowerSpecies)
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