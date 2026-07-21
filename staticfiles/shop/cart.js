// Cart Drawer Toggle Functionality
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');

function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
}

if (openCartBtn) openCartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Shopping Cart Core Logic
let cart = JSON.parse(localStorage.getItem('electro_cart')) || [];

function saveCart() {
    localStorage.setItem('electro_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(id, name, price) {
    const parsedPrice = parseFloat(price);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parsedPrice,
            quantity: 1
        });
    }

    saveCart();
    openCart(); // Show drawer immediately after adding
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    saveCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function updateCartUI() {
    const cartBadge = document.getElementById('cart-badge-count');
    const itemsContainer = document.getElementById('cart-items-container');
    const totalPriceDisplay = document.getElementById('cart-total-price');

    // 1. Update Badge Count
    const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartBadge) {
        cartBadge.textContent = totalItemsCount;
    }

    // 2. Populate Cart Items
    if (itemsContainer) {
        itemsContainer.innerHTML = '';

        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <p>Your trolley is empty.</p>
                </div>
            `;
        } else {
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn decrease-qty-btn" data-id="${item.id}">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-qty-btn" data-id="${item.id}">+</button>
                        <button class="remove-item-btn" data-id="${item.id}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                `;
                itemsContainer.appendChild(itemEl);
            });

            // Bind events for quantity change
            document.querySelectorAll('.decrease-qty-btn').forEach(btn => {
                btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
            });
            document.querySelectorAll('.increase-qty-btn').forEach(btn => {
                btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
            });
            document.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
            });
        }
    }

    // 3. Update Total Price
    const grandTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (totalPriceDisplay) {
        totalPriceDisplay.textContent = `$${grandTotal.toFixed(2)}`;
    }
}

// Bind "Add to Cart" Buttons from the DOM
function initAddToCartListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const price = btn.dataset.price;
            addToCart(id, name, price);
        });
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    initAddToCartListeners();
});
