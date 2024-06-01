// Step 1: Send POST Request to API
function placeOrder(contactDetails, cartItems) {
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contact: contactDetails,
            items: cartItems
        })
    })
        .then(response => response.json())
        .then(data => {
            const orderId = data.orderId;
            redirectToConfirmationPage(orderId); // Redirect to confirmation page after placing the order
        })
        .catch(error => {
            console.error('Error placing order:', error);
            // Handle error
        });
}

// Step 2: Redirect to Confirmation Page
function redirectToConfirmationPage(orderId) {
    if (orderId) {
        window.location.href = `confirmation.html?orderId=${orderId}`;
    } else {
        console.error("Order Id is undefined.");
    }
}

// Step 3: Display Order Number on Confirmation Page
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    const orderNumberElement = document.getElementById('orderNumber');
    if (orderNumberElement) {
        if (orderId) {
            orderNumberElement.textContent = orderId;
            console.log(orderId); // Corrected logging orderId instead of orderNumber
        } else {
            orderNumberElement.textContent = 'Order number not found.';
        }
    }
});
