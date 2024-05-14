console.log("cart javascript");

// Retrieve cart data from local storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
insertCartItems(cart)

// Function to insert product details into page
function insertCartItems(cart) {
    const totalQuantityElement = document.getElementById('totalQuantity')
    const totalPriceElement = document.getElementById('totalPrice')
    let totalQuantity = 0;
    let totalPrice = 0;

    for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];

        fetch(`http://localhost:3000/api/products/${cartItem.id}`)
            .then(response => response.json())
            .then(product => {
                totalQuantity += cartItem.quantity
                totalPrice += product.price * cartItem.quantity;
                totalQuantityElement.innerText = totalQuantity;
                totalPriceElement.innerText = totalPrice;

                insertCartItem(cartItem, product);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
            });
    }
}
function updateCartTotalQuantity(totalQuantity) {
    const totalQuantityElement = document.getElementById('totalQuantity');
    totalQuantityElement.innerText = totalQuantity;
}

// Function to handle changes in quantity
function handleQuantityChange(event) {
    const input = event.target;
    // FIX ME get the id using imput.closest("article")
    const article = input.closest("article");
    const id = article.dataset.id;
    const color = article.dataset.color;
    const quantity = parseInt(input.value);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const foundIndex = cart.findIndex(item => item.id === id && item.color === color);
    console.log(foundIndex)

    if (foundIndex !== -1) {
        cart[foundIndex].quantity = quantity;
        // TODO update totals on page// updateCart(cart);
        // TODO save updated cart to local storage
    }
}

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
    console.log(product);

    const cartItemsSection = document.getElementById('cart__items');
    article.querySelector('.itemQuantity').addEventListener('change', handleQuantityChange);
    article.querySelector('.deleteItem').addEventListener('click', handleRemoveProduct);

    cartItemsSection.appendChild(article);
}


// Display the recap table on the cart page
// window.addEventListener('DOMContentLoaded', () => {
//     const recapTable = document.getElementById("recap-table");
//     recapTable.style.display = "block"; // Show the recap table

//     const groupedCart = groupCartItems(cart);
//     generateRecapTable(groupedCart);

//     // Add event listeners for quantity change and product removal
//     document.querySelectorAll('.itemQuantity').forEach(input => {
//         input.addEventListener('change', handleQuantityChange);
//     });

//     document.querySelectorAll('.deleteItem').forEach(button => {
//         button.addEventListener('click', handleRemoveProduct);
//     });
// });

// Function to handle removing a product from the cart
function handleRemoveProduct(event) {
    const button = event.target;
    const id = button.closest("article").dataset.id;
    const color = button.closest("article").dataset.color;
    console.log(id)
    console.log(color)

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const foundIndex = cart.findIndex(item => item.id === id && item.color === color);
    console.log(foundIndex)

    if (foundIndex !== -1) {
        cart.splice(foundIndex, 1);
        console.log(cart)
        // TODO update totals on page// updateCart(cart);
        // TODO remove item from page
        // TODO save updated cart to local storage

    }
}