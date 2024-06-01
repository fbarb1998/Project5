const productCache = [];

// Retrieve cart data from local storage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
insertCartItems(cart);

// Function to insert product details into page
function insertCartItems(cart) {
    const totalQuantityElement = document.getElementById('totalQuantity');
    const totalPriceElement = document.getElementById('totalPrice');
    let totalQuantity = 0;
    let totalPrice = 0;

    for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];

        fetch(`http://localhost:3000/api/products/${cartItem.id}`)
            .then(response => response.json())
            .then(product => {
                if (!productCache.some((p) => p._id === product._id)) {
                    productCache.push(product);
                }
                totalQuantity += cartItem.quantity;
                totalPrice += product.price * cartItem.quantity;
                totalQuantityElement.innerText = totalQuantity;
                totalPriceElement.innerText = totalPrice.toFixed(2);

                insertCartItem(cartItem, product);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
            });
    }
}

// Function to update total quantity on the page
function updateCartTotalQuantity(totalQuantity) {
    const totalQuantityElement = document.getElementById('totalQuantity');
    totalQuantityElement.innerText = totalQuantity;
}

// Function to update total price on the page
function updateCartTotalPrice(cart) {
    const totalPriceElement = document.getElementById('totalPrice');
    let total = 0;
    for (const item of cart) {
        const cartItemProduct = productCache.find((p) => p._id === item.id);
        if (cartItemProduct) {
            const cartItemPrice = cartItemProduct.price;
            total += cartItemPrice * item.quantity;
        } else {
            console.error('Product not found in cache', item.id);
        }
    }
    totalPriceElement.innerText = total.toFixed(2);
}

// Function to insert a cart item into the page
function insertCartItem(cartItem, product) {
    const article = document.createElement('article');
    article.classList.add('cart__item');
    article.dataset.id = product._id;
    article.dataset.color = cartItem.color;
    article.innerHTML = `
    <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="Photo of ${product.name}">
    </div>
    <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${cartItem.color}</p>
            <p>€${product.price}</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Quantity : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Delete</p>
            </div>
        </div>
    </div>
`;

    const cartItemsSection = document.getElementById('cart__items');
    article.querySelector('.itemQuantity').addEventListener('change', handleQuantityChange);
    article.querySelector('.deleteItem').addEventListener('click', handleRemoveProduct);

    cartItemsSection.appendChild(article);
}

// Function to handle changes in quantity
function handleQuantityChange(event) {
    const input = event.target;

    // Get the id using input.closest("article")
    const article = input.closest("article");
    const id = article.dataset.id;
    const color = article.dataset.color;
    const quantity = parseInt(input.value);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const foundIndex = cart.findIndex(item => item.id === id && item.color === color);

    if (foundIndex !== -1) {
        // Update the quantity of the item in the cart
        cart[foundIndex].quantity = quantity;

        // Save updated cart to local storage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update the total quantity on page
        updateCartTotalQuantity(getTotalQuantity(cart));

        // Update the total price displayed on page
        updateCartTotalPrice(cart);
    }
}

// Function to handle removing a product from the cart
function handleRemoveProduct(event) {
    const button = event.target;

    // Ensure button is within an article with dataset attribute
    const article = button.closest("article");
    if (!article || !article.dataset.id || !article.dataset.color) {
        console.error("Unable to find product information.");
        return;
    }

    const id = article.dataset.id;
    const color = article.dataset.color;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const foundIndex = cart.findIndex(item => item.id === id && item.color === color);

    if (foundIndex !== -1) {
        cart.splice(foundIndex, 1);

        // Save updated cart to local storage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update totals on page
        updateCartTotalQuantity(getTotalQuantity(cart));
        updateCartTotalPrice(cart);

        // Remove item from page
        article.remove();
    }
}

// Function to calculate total quantity in the cart
function getTotalQuantity(cart) {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

document.addEventListener('DOMContentLoaded', function () {
    const orderForm = document.querySelector('.cart__order__form');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const emailInput = document.getElementById('email');

    // Function to display error message
    function displayErrorMessage(input, message) {
        const errorElement = input.nextElementSibling;
        errorElement.innerText = message;
    }

    // Event listener for form submission
    orderForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Validate form fields
        let isValid = true;

        // Check for no numbers in first name
        if (!/^[A-Za-z]+$/.test(firstNameInput.value.trim())) {
            isValid = false;
            displayErrorMessage(firstNameInput, 'Please enter a valid first name.');
        }

        // Check for no numbers in last name
        if (!/^[A-Za-z]+$/.test(lastNameInput.value.trim())) {
            isValid = false;
            displayErrorMessage(lastNameInput, 'Please enter a valid last name.');
        }

        // Validate address (allow letters, numbers, spaces, commas)
        if (!/^[A-Za-z0-9\s,]+$/.test(addressInput.value.trim())) {
            isValid = false;
            displayErrorMessage(addressInput, 'Please enter a valid address.');
        }

        // Validate city format (allow letters and spaces)
        if (!/^[A-Za-z\s]+$/.test(cityInput.value.trim())) {
            isValid = false;
            displayErrorMessage(cityInput, 'Please enter a valid city.');
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            isValid = false;
            displayErrorMessage(emailInput, 'Please enter a valid email address.');
        }

        // If form is valid, proceed with order confirmation
        if (isValid) {
            const contact = {
                firstName: firstNameInput.value.trim(),
                lastName: lastNameInput.value.trim(),
                address: addressInput.value.trim(),
                city: cityInput.value.trim(),
                email: emailInput.value.trim()
            };

            // Retrieve cart from local storage
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            // Placeholder for cart items
            const cartItems = cart.map(item => item.id);

            // Create contact object and product table
            const orderData = {
                contact: contact,
                products: cartItems
            };

            // Step 1: Send POST request to API
            placeOrder(orderData);
        }
    });
});

// Function to clear the cart
function clearCart() {
    localStorage.removeItem("cart");
    updateCartTotalQuantity(0);
    updateCartTotalPrice([]);
}
// Step 1: Send POST Request to API
function placeOrder(orderData) {
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            const orderId = data.orderId;
            // Clear cart and redirect
            clearCart();
            redirectToConfirmationPage(orderId);
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
        console.error("Order Id is undefined.")
    }
}