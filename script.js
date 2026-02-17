const phoneNumber = "27633763229";
const ADMIN_PASSWORD = "Nexel2026";

let products = JSON.parse(localStorage.getItem("products")) || [];

const container = document.getElementById("productContainer");

function loadProducts(filter = "All") {
    container.innerHTML = "";

    const filtered = filter === "All" ? products : products.filter(p => p.category === filter);

    filtered.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            ${product.image ? `<img src="${product.image}">` : ""}
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <p style="font-size:14px; opacity:0.7;">${product.category}</p>
            <button onclick="orderProduct('${product.name}')">
                Order on WhatsApp
            </button>
            ${isAdminLoggedIn ? `<button onclick="deleteProduct(${index})" style="margin-top:10px;">Delete Product</button>` : ""}
        `;
        container.appendChild(card);
    });
}

function filterProducts(category) { loadProducts(category); }

function addProduct() {
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const category = document.getElementById("productCategory").value;
    const imageInput = document.getElementById("productImage");

    if (!name || !price) { alert("Please fill all fields"); return; }

    const reader = new FileReader();
    reader.onload = function(e) {
        products.push({ name, price, category, image: e.target.result });
        localStorage.setItem("products", JSON.stringify(products));
        loadProducts();
    };

    if (imageInput.files[0]) reader.readAsDataURL(imageInput.files[0]);
}

function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
}

function orderProduct(productName) {
    const message = `Hello Nexel Clothing, I would like to order: ${productName}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
}

let isAdminLoggedIn = false;

function showLogin() { document.getElementById("loginModal").style.display = "flex"; }

function checkPassword() {
    const input = document.getElementById("adminPassword").value;
    if (input === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        document.getElementById("adminPanel").style.display = "block";
        document.getElementById("loginModal").style.display = "none";
        loadProducts();
    } else alert("Wrong Password");
}

loadProducts();