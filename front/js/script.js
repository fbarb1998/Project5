const itemSection = document.getElementById("items");

fetch('http://localhost:3000/api/products')
    .then(data => {
        return data.json();
    })
    .then(products => {
        insertProducts(products);
    });

const productsHolder = document.getElementById('items');

function insertProducts(products) {
    console.log(products)
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        console.log(product);
        // TODO stick html product into the homepage
        itemSection.innerHTML += `<a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
      </a>`;
    }
}
