console.log("products javascript")
const queryString = window.location.search;

console.log(queryString);
const urlParams = new URLSearchParams(queryString);
console.log(urlParams)
const id = urlParams.get('id')

console.log(id);
// TODO use fetch to get product information for the id
fetch(`http://localhost:3000/api/products/${id}`)
    .then(data => {
        return data.json();
    })
    .then(product => {
        // insertProducts(products);
        insertProductDetails(product)
    });

// TODO create function to insert product details into page
function insertProductDetails(product) {
    console.log(product)
    document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
    document.getElementById("title").innerText = product.name;
    document.getElementById("price").innerText = product.price;
    document.getElementById("description").innerText = product.description;
    const selectElement = document.getElementById("colors")
    for (color in product.colors) {
        selectElement.innerHTML += `<option value="${product.colors[color]}">${product.colors[color]}</option>`
    }

}
// TODO m7 add a click event listener function add to cart button
const addToCart = document.getElementById("addToCart")
addToCart.addEventListener('click', () => {

    // start a new cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const selectedColor = document.getElementById("colors").value
    const selectedQuantity = parseInt(document.getElementById("quantity").value)
    // TODO find the id color and quantity that the user has selected


    // TODO if the product is not already added to the cart simply add it to the cart
    let found = cart.find(item => item.id === id && item.color === selectedColor);

    // TODO if the product and color is already in the cart simply increase the quantity
    if (!found) {
        cart.push({
            color: selectedColor,
            quantity: selectedQuantity,
            id: id
        })
    } else {
        found.quantity += selectedQuantity;
    }

    // TODO code the event listener function so it adds the product on the page to the cart in local storage
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Item added to cart");
    console.log(cart);
});