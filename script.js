const phoneNumber = "27633763229";
const ADMIN_PASSWORD = "Nexel2026";

let products = JSON.parse(localStorage.getItem("products")) || [];
let isAdminLoggedIn = false;
let currentCategoryFilter = "All";

const container = document.getElementById("productContainer");

// ====================
// CUSTOMER FUNCTIONS
// ====================

function loadProducts(filter = "All") {
    container.innerHTML = "";

    const filtered = filter === "All" ? products : products.filter(p => p.category === filter);

    if (filtered.length === 0) {
        container.innerHTML = "<p style='text-align:center; color: #D4AF37; padding: 40px;'>No products available in this category</p>";
        return;
    }

    filtered.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<div class="no-image">No Image</div>'}
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <p class="category">${product.category}</p>
            <button onclick="orderProduct('${product.name}')" class="order-btn">
                Order on WhatsApp
            </button>
        `;
        container.appendChild(card);
    });
}

function filterProducts(category) { 
    loadProducts(category); 
}

function orderProduct(productName) {
    const message = `Hello Nexel Clothing, I would like to order: ${productName}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
}

// ====================
// ADMIN LOGIN FUNCTIONS
// ====================

function showLogin() { 
    document.getElementById("loginModal").style.display = "flex"; 
    document.getElementById("adminPassword").focus();
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("adminPassword").value = "";
}

function checkPassword() {
    const input = document.getElementById("adminPassword").value;
    if (input === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        document.getElementById("adminPanel").style.display = "block";
        document.getElementById("loginModal").style.display = "none";
        document.getElementById("adminPassword").value = "";
        showCategoryProducts("All");
    } else {
        alert("❌ Wrong Password");
        document.getElementById("adminPassword").value = "";
    }
}

function logout() {
    isAdminLoggedIn = false;
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("adminPassword").value = "";
    loadProducts();
}

// ====================
// ADMIN PRODUCT FUNCTIONS
// ====================

function addProduct() {
    const name = document.getElementById("productName").value.trim();
    const price = document.getElementById("productPrice").value.trim();
    const category = document.getElementById("productCategory").value;
    const imageInput = document.getElementById("productImage");

    // Validation
    if (!name) { 
        alert("❌ Please enter a product name"); 
        return; 
    }
    if (!price) { 
        alert("❌ Please enter a price"); 
        return; 
    }
    if (!category) { 
        alert("❌ Please select a category"); 
        return; 
    }

    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newProduct = { 
                name, 
                price, 
                category, 
                image: e.target.result,
                addedDate: new Date().toLocaleString()
            };
            products.push(newProduct);
            localStorage.setItem("products", JSON.stringify(products));
            
            // Clear form
            document.getElementById("productName").value = "";
            document.getElementById("productPrice").value = "";
            document.getElementById("productCategory").value = "";
            document.getElementById("productImage").value = "";
            document.getElementById("fileName").textContent = "No file chosen";
            document.getElementById("imagePreview").innerHTML = "";
            
            // Show success message
            const successMsg = document.getElementById("successMessage");
            successMsg.style.display = "block";
            setTimeout(() => { successMsg.style.display = "none"; }, 3000);
            
            // Refresh displays
            loadProducts();
            showCategoryProducts(currentCategoryFilter);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        alert("❌ Please select an image");
    }
}

function deleteProduct(index) {
    if (confirm("Are you sure you want to delete this product?")) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        loadProducts();
        showCategoryProducts(currentCategoryFilter);
    }
}

function showCategoryProducts(category) {
    currentCategoryFilter = category;
    const adminList = document.getElementById("adminProductsList");
    
    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    event.target.classList.add("active");

    const filtered = category === "All" ? products : products.filter(p => p.category === category);

    if (filtered.length === 0) {
        adminList.innerHTML = "<p style='text-align:center; color: #D4AF37; padding: 20px;'>No products in this category</p>";
        return;
    }

    adminList.innerHTML = "";
    filtered.forEach((product, index) => {
        const realIndex = products.indexOf(product);
        const card = document.createElement("div");
        card.classList.add("admin-product-card");

        card.innerHTML = `
            <div class="admin-product-image">
                ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<div class="no-image">No Image</div>'}
            </div>
            <div class="admin-product-info">
                <h4>${product.name}</h4>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Added:</strong> ${product.addedDate || 'N/A'}</p>
                <button onclick="deleteProduct(${realIndex})" class="delete-btn">Delete Product</button>
            </div>
        `;
        adminList.appendChild(card);
    });
}

// File input preview
document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById("productImage");
    if (fileInput) {
        fileInput.addEventListener("change", function() {
            const fileName = this.files[0]?.name || "No file chosen";
            document.getElementById("fileName").textContent = fileName;

            // Show image preview
            if (this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById("imagePreview").innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(this.files[0]);
            } else {
                document.getElementById("imagePreview").innerHTML = "";
            }
        });
    }

    loadProducts();
});

// Close modal when clicking outside
window.addEventListener("click", function(event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
        closeLogin();
    }
});