// =====================
// 1. PRODUCTS DATA
// =====================
const products = [
    {
        id: 1,
        category: "Waffle",
        name: "Waffle with Berries",
        price: 6.50,
        image: "images/image-waffle-desktop.jpg"
    },
    {
        id: 2,
        category: "Crème Brûlée",
        name: "Vanilla Bean Crème Brûlée",
        price: 7.00,
        image: "images/image-creme-brulee-desktop.jpg"
    },
    {
        id: 3,
        category: "Baklava",
        name: "Sweet Baklava",
        price: 8.00,
        image: "images/image-baklava-desktop.jpg"
    },
    {
        id: 4,
        category: "Cake",
        name: "Wedding cake",
        price: 10.00,
        image: "images/image-cake-desktop.jpg"
    }
];

// =====================
// 2. CART STATE
// =====================
let cart = [];

// Load cart from localStorage
const savedCart = localStorage.getItem("cart");
if (savedCart) {
    cart = JSON.parse(savedCart);
}

// =====================
// 3. SAVE CART
// =====================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// =====================
// 4. RENDER PRODUCTS
// =====================
function renderProducts() {
    const productGrid = document.getElementById("product-grid");
    productGrid.innerHTML = "";

    products.forEach(product => {
        const inCart = cart.find(item => item.id === product.id);

        productGrid.innerHTML += `
            <div class="product-item">
                <div class="image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-img">

                    ${
                        inCart
                        ? `<button class="add-to-cart-btn active">
                              ${inCart.quantity} in Cart
                           </button>`
                        : `<button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                              Add to Cart
                           </button>`
                    }
                </div>

                <p class="category">${product.category}</p>
                <h3 class="name">${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
            </div>
        `;
    });
}

// =====================
// 5. CART FUNCTIONS
// =====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateUI();
}

function increaseQuantity(productId) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity++;
    updateUI();
}

function decreaseQuantity(productId) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateUI();
    }
}

// =====================
// 6. UI UPDATES
// =====================
function updateUI() {
    renderProducts();
    renderCart();
    updateCartCount();
    saveCart();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").innerText = count;
}

// =====================
// 7. CART RENDER
// =====================
function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCartDiv = document.getElementById("empty-cart");
    const activeCartDiv = document.querySelector(".active-cart");
    const orderTotalElement = document.getElementById("order-total");

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        emptyCartDiv.style.display = "block";
        activeCartDiv.style.display = "none";
        return;
    }

    emptyCartDiv.style.display = "none";
    activeCartDiv.style.display = "block";

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <p class="item-name">${item.name}</p>

                    <div class="qty-controls">
                        <button onclick="decreaseQuantity(${item.id})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseQuantity(${item.id})">+</button>
                    </div>

                    <span class="item-price">@ $${item.price.toFixed(2)}</span>
                    <span class="item-subtotal">$${itemTotal.toFixed(2)}</span>
                </div>

                <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
            </div>
            <hr>
        `;
    });

    orderTotalElement.innerText = `$${total.toFixed(2)}`;
}

// =====================
// 8. CONFIRM ORDER
// =====================
function confirmOrder() {
    if (cart.length === 0) return;

    const modal = document.getElementById("order-modal");
    const modalItemsContainer = document.getElementById("modal-items-container");
    const modalTotalPrice = document.getElementById("modal-total-price");

    modalItemsContainer.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        modalItemsContainer.innerHTML += `
            <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee;">
                <div style="display:flex; gap:10px; align-items:center;">
                    <img src="${item.image}" width="50" style="border-radius:5px;">
                    <div>
                        <p style="margin:0; font-weight:bold;">${item.name}</p>
                        <span style="color:#C73B0F;">${item.quantity}x</span>
                        <span style="margin-left:10px;">@ $${item.price.toFixed(2)}</span>
                    </div>
                </div>

                <strong>$${itemTotal.toFixed(2)}</strong>
            </div>
        `;
    });

    modalTotalPrice.innerText = `$${total.toFixed(2)}`;
    modal.style.display = "flex";
}

// =====================
// 9. NEW ORDER
// =====================
function startNewOrder() {
    cart = [];
    updateUI();
    document.getElementById("order-modal").style.display = "none";
}

// =====================
// 10. INIT
// =====================
renderProducts();
updateUI();

// =====================
// 11. EVENT LISTENERS
// =====================
document.addEventListener("DOMContentLoaded", () => {
    document
        .querySelector(".confirm-btn")
        .addEventListener("click", confirmOrder);

    document
        .getElementById("new-order-btn")
        .addEventListener("click", startNewOrder);
});