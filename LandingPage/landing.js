function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = './Login/login.html';
}

// Base de datos de productos del menú
const menuItems = [
    {
        id: 1,
        name: "Classic Beef Burger",
        category: "burgers",
        price: 8.99,
        description: "Premium beef patty with cheddar cheese, lettuce, tomato, and special sauce",
        image: "./LandingPage/img/image-hamburguer1.png",
        note: ""
    },
    {
        id: 2,
        name: "Double Bacon Melt",
        category: "burgers",
        price: 12.50,
        description: "Two patties, crispy bacon, melted swiss cheese, and caramelized onions",
        image: "./LandingPage/img/image-hamburguer2.png",
        note: ""
    },
    {
        id: 3,
        name: "Golden Fries",
        category: "sides",
        price: 3.99,
        description: "Freshly cut potatoes fried to perfection with sea salt",
        image: "./LandingPage/img/image-fries.png",
        note: "Extra salt"
    },
    {
        id: 4,
        name: "Cola Zero",
        category: "drinks",
        price: 2.50,
        description: "Chilled zero sugar cola with ice and a slice of lemon",
        image: "./LandingPage/img/image-drink.png",
        note: ""
    },
    {
        id: 5,
        name: "Donut Box",
        category: "desserts",
        price: 6.00,
        description: "Assorted glazed and frosted donuts",
        image: "./LandingPage/img/image-deseerts.png",
        note: ""
    },
    {
        id: 6,
        name: "Pepperoni Slice",
        category: "pizza",
        price: 4.50,
        description: "Large NY style slice with double pepperoni",
        image: "./LandingPage/img/image-pizza.png",
        note: ""
    },
    {
        id: 7,
        name: "Veggie Burger",
        category: "burgers",
        price: 9.99,
        description: "Plant-based patty with avocado, sprouts, and tahini sauce",
        image: "./LandingPage/img/image-hamburguer3.jpeg",
        note: ""
    },
    {
        id: 8,
        name: "Onion Rings",
        category: "sides",
        price: 4.50,
        description: "Crispy beer-battered onion rings with ranch dip",
        image: "./LandingPage/img/image-onions.jpeg",
        note: ""
    },
    {
        id: 9,
        name: "Lemonade",
        category: "drinks",
        price: 3.00,
        description: "Fresh squeezed lemonade with mint",
        image: "./LandingPage/img/image-drink2.jpeg",
        note: ""
    }
];

// Carrito de compras
let cart = [];
let currentCategory = 'all';

// Verificar sesión al cargar la página
window.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Si no hay usuario, crear uno de prueba
        const testUser = {
            id: 'user-001',
            fullname: 'Alex Student',
            email: 'alex.dev@university.edu',
            role: 'customer'
        };
        sessionStorage.setItem('currentUser', JSON.stringify(testUser));
    }
    
    // Verificar si hay items para reordenar
    const reorderItems = sessionStorage.getItem('reorderItems');
    if (reorderItems) {
        const items = JSON.parse(reorderItems);
        items.forEach(item => {
            const menuItem = menuItems.find(mi => mi.name === item.name);
            if (menuItem) {
                for (let i = 0; i < item.quantity; i++) {
                    addToCart(menuItem.id);
                }
            }
        });
        sessionStorage.removeItem('reorderItems');
        alert('Items from your previous order have been added to your cart!');
    }
    
    // Cargar el menú
    renderMenu();
    
    // Configurar event listeners
    setupEventListeners();
});

// Configurar todos los event listeners
function setupEventListeners() {
    // Filtros de categoría
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('btn-dark');
                b.classList.add('btn-outline-secondary');
            });
            this.classList.remove('btn-outline-secondary');
            this.classList.add('btn-dark');
            
            currentCategory = this.getAttribute('data-category');
            renderMenu();
        });
    });
    
    // Búsqueda
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = menuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
        renderMenu(filteredItems);
    });
    
    // Clear all button
    document.getElementById('clearAllBtn').addEventListener('click', function(e) {
        e.preventDefault();
        cart = [];
        updateCart();
    });
    
    // My Orders link - Toggle cart visibility
    document.getElementById('myOrdersLink').addEventListener('click', function(e) {
        e.preventDefault();
        const orderCard = document.getElementById('orderCard');
        if (orderCard.style.display === 'none') {
            orderCard.style.display = 'block';
        } else {
            orderCard.style.display = 'none';
        }
    });
    
    // Confirm order button
    document.getElementById('confirmOrderBtn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Calcular totales
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const total = subtotal + tax;
        
        // Crear nueva orden
        const newOrder = {
            id: 'ORD-' + Math.floor(Math.random() * 10000),
            userId: currentUser.id,
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                note: item.note
            })),
            subtotal: subtotal,
            tax: tax,
            total: total,
            status: 'Preparing',
            date: new Date().toISOString()
        };
        
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        alert(`Order confirmed! Order ID: ${newOrder.id}`);
        cart = [];
        updateCart();
    });
}

// Renderizar el menú
function renderMenu(items = null) {
    const container = document.getElementById('menuContainer');
    const itemsToRender = items || (currentCategory === 'all' ? menuItems : menuItems.filter(item => item.category === currentCategory));
    
    container.innerHTML = itemsToRender.map(item => `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card border-0 shadow-sm h-100 rounded-4">
                <div class="bg-light rounded-top-4 d-flex align-items-center justify-content-center position-relative" style="height: 180px; overflow: hidden;">
                    <span class="badge bg-white text-dark position-absolute top-0 start-0 m-3 text-uppercase">${item.category}</span>
                    <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="fw-bold m-0">${item.name}</h6>
                        <span class="text-success fw-bold">$${item.price.toFixed(2)}</span>
                    </div>
                    <p class="small text-muted mb-3">${item.description}</p>
                    <button class="btn btn-light w-100 mt-auto fw-bold py-2" onclick="addToCart(${item.id})">
                        <i class="fa-solid fa-cart-plus"></i> Add to order
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Agregar al carrito
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCart();
}

// Actualizar el carrito
function updateCart() {
    const orderCount = document.getElementById('orderCount');
    const orderItemsContainer = document.getElementById('orderItemsContainer');
    const orderDivider = document.getElementById('orderDivider');
    const orderSummary = document.getElementById('orderSummary');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    orderCount.textContent = totalItems;
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="text-muted text-center">Your order is empty</p>';
        orderDivider.style.display = 'none';
        orderSummary.style.display = 'none';
    } else {
        orderItemsContainer.innerHTML = cart.map(item => `
            <div class="d-flex align-items-center mb-3">
                <div class="bg-light rounded-3 me-3 flex-shrink-0 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; overflow: hidden;">
                    <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="small fw-bold mb-0">${item.name}</h6>
                            ${item.note ? `<small class="text-muted">${item.note}</small>` : ''}
                        </div>
                        <span class="small fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="d-flex align-items-center gap-2 mt-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${item.id})">-</button>
                        <span class="small">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${item.id})">+</button>
                        <button class="btn btn-sm btn-link text-danger text-decoration-none p-0 ms-2" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const total = subtotal + tax;
        
        document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
        
        orderDivider.style.display = 'block';
        orderSummary.style.display = 'block';
    }
}

// Aumentar cantidad
function increaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

// Disminuir cantidad
function decreaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateCart();
    }
}

// Eliminar del carrito
function removeFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    updateCart();
}

// Logout
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        sessionStorage.removeItem('currentUser');
        window.location.href = './Login/login.html';
    }
}