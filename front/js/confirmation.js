

// Step 3: Display Order Number on Confirmation Page
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    console.log(urlParams)

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
