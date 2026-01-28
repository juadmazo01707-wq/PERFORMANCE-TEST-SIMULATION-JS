// Sample orders data
let ordersData = [
    {
        id: '#1024',
        user: 'Alice Smith',
        date: 'Oct 27, 14:30',
        status: 'Preparing',
        total: 45.00,
        email: 'alice.smith@example.com',
        phone: '+1 (555) 123-4567',
        items: [
            { quantity: 2, name: 'Burger Classico', notes: 'Extra cheese, No onions', price: 24.00 },
            { quantity: 1, name: 'Truffle Fries', notes: 'Large', price: 8.00 },
            { quantity: 1, name: 'Vanilla Shake', notes: '', price: 5.00 },
            { quantity: 1, name: 'Chocolate Cake', notes: '', price: 8.00 }
        ]
    },
    {
        id: '#1023',
        user: 'Bob Jones',
        date: 'Oct 27, 14:15',
        status: 'Pending',
        total: 12.50,
        email: 'bob.jones@example.com',
        phone: '+1 (555) 234-5678',
        items: [
            { quantity: 1, name: 'Caesar Salad', notes: 'No croutons', price: 12.50 }
        ]
    },
    {
        id: '#1022',
        user: 'Charlie Day',
        date: 'Oct 27, 13:50',
        status: 'Delivered',
        total: 32.00,
        email: 'charlie.day@example.com',
        phone: '+1 (555) 345-6789',
        items: [
            { quantity: 2, name: 'Margherita Pizza', notes: 'Extra basil', price: 32.00 }
        ]
    },
    {
        id: '#1021',
        user: 'Diana Prince',
        date: 'Oct 27, 13:45',
        status: 'Delivered',
        total: 55.00,
        email: 'diana.prince@example.com',
        phone: '+1 (555) 456-7890',
        items: [
            { quantity: 3, name: 'Ribeye Steak', notes: 'Medium rare', price: 55.00 }
        ]
    },
    {
        id: '#1020',
        user: 'Evan Wright',
        date: 'Oct 27, 13:30',
        status: 'Ready',
        total: 22.00,
        email: 'evan.wright@example.com',
        phone: '+1 (555) 567-8901',
        items: [
            { quantity: 1, name: 'Fish Tacos', notes: '', price: 15.00 },
            { quantity: 1, name: 'Iced Tea', notes: '', price: 7.00 }
        ]
    },
    {
        id: '#1019',
        user: 'Fiona Green',
        date: 'Oct 27, 13:15',
        status: 'Preparing',
        total: 38.50,
        email: 'fiona.green@example.com',
        phone: '+1 (555) 678-9012',
        items: [
            { quantity: 2, name: 'Chicken Wings', notes: 'Spicy', price: 38.50 }
        ]
    },
    {
        id: '#1018',
        user: 'George Miller',
        date: 'Oct 27, 13:00',
        status: 'Delivered',
        total: 18.75,
        email: 'george.miller@example.com',
        phone: '+1 (555) 789-0123',
        items: [
            { quantity: 1, name: 'Club Sandwich', notes: '', price: 18.75 }
        ]
    },
    {
        id: '#1017',
        user: 'Hannah Lee',
        date: 'Oct 27, 12:45',
        status: 'Ready',
        total: 42.00,
        email: 'hannah.lee@example.com',
        phone: '+1 (555) 890-1234',
        items: [
            { quantity: 1, name: 'Seafood Platter', notes: '', price: 42.00 }
        ]
    }
];

let currentPage = 1;
let selectedOrderIndex = 0;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    updateStats();
    displayOrderDetails(ordersData[0], 0);
});

// Load orders into table
function loadOrders() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';

    ordersData.forEach((order, index) => {
        const row = document.createElement('tr');
        row.classList.add('order-row');
        if (index === selectedOrderIndex) {
            row.classList.add('selected');
        }
        
        row.onclick = () => selectOrder(index);
        
        row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>
                <div class="user-name">${order.user}</div>
            </td>
            <td>
                <div class="order-date">${order.date}</div>
            </td>
            <td>
                <span class="badge badge-${order.status.toLowerCase()}">${order.status}</span>
            </td>
            <td><strong>$${order.total.toFixed(2)}</strong></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="event.stopPropagation(); viewOrder(${index})" title="View details">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); editOrder(${index})" title="Edit order">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); deleteOrder(${index})" title="Delete order">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Select order and display details
function selectOrder(index) {
    selectedOrderIndex = index;
    
    // Update table row selection
    const rows = document.querySelectorAll('.order-row');
    rows.forEach((row, i) => {
        if (i === index) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    });
    
    displayOrderDetails(ordersData[index], index);
}

// Display order details in side panel
function displayOrderDetails(order, index) {
    document.getElementById('detailOrderId').textContent = order.id;
    document.getElementById('detailOrderStatus').textContent = order.status;
    document.getElementById('detailOrderStatus').className = `badge badge-${order.status.toLowerCase()}`;
    
    document.getElementById('detailCustomerName').textContent = order.user;
    document.getElementById('detailCustomerEmail').textContent = order.email;
    document.getElementById('detailCustomerPhone').textContent = order.phone;
    
    // Display items
    const itemsList = document.getElementById('orderItemsList');
    itemsList.innerHTML = '';
    
    order.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-row';
        itemDiv.innerHTML = `
            <span class="item-quantity">${item.quantity}x</span>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
            </div>
            <div class="item-price">$${item.price.toFixed(2)}</div>
        `;
        itemsList.appendChild(itemDiv);
    });
    
    // Calculate totals
    const subtotal = order.total;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    document.getElementById('detailSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('detailTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('detailTotal').textContent = `$${total.toFixed(2)}`;
    
    // Set status select
    document.getElementById('statusSelect').value = order.status;
}

// Update statistics
function updateStats() {
    const totalOrders = ordersData.length;
    const pendingOrders = ordersData.filter(order => order.status === 'Pending').length;
    const todayRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
    
    document.getElementById('totalOrders').textContent = totalOrders.toLocaleString();
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('todayRevenue').textContent = `$${todayRevenue.toLocaleString()}`;
}

// Update order status
function updateOrderStatus() {
    const newStatus = document.getElementById('statusSelect').value;
    ordersData[selectedOrderIndex].status = newStatus;
    
    // Update UI
    loadOrders();
    displayOrderDetails(ordersData[selectedOrderIndex], selectedOrderIndex);
    updateStats();
    
    // Show success message
    showNotification('Order status updated successfully!');
}

// View order details
function viewOrder(index) {
    selectOrder(index);
    // Scroll to details panel on mobile
    if (window.innerWidth < 1200) {
        document.getElementById('orderDetailsPanel').scrollIntoView({ behavior: 'smooth' });
    }
}

// Edit order (placeholder)
function editOrder(index) {
    alert(`Edit order ${ordersData[index].id} - This feature will be implemented soon`);
}

// Delete order
function deleteOrder(index) {
    if (confirm(`Are you sure you want to delete order ${ordersData[index].id}?`)) {
        ordersData.splice(index, 1);
        
        // If deleted order was selected, select first order
        if (index === selectedOrderIndex) {
            selectedOrderIndex = 0;
        } else if (index < selectedOrderIndex) {
            selectedOrderIndex--;
        }
        
        loadOrders();
        if (ordersData.length > 0) {
            displayOrderDetails(ordersData[selectedOrderIndex], selectedOrderIndex);
        }
        updateStats();
        
        showNotification('Order deleted successfully!');
    }
}

// Add new order (placeholder)
function addOrder() {
    const newOrder = {
        id: `#${1025 + ordersData.length}`,
        user: 'New Customer',
        date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
        total: 0.00,
        email: 'customer@example.com',
        phone: '+1 (555) 000-0000',
        items: []
    };
    
    ordersData.unshift(newOrder);
    selectedOrderIndex = 0;
    
    loadOrders();
    displayOrderDetails(ordersData[0], 0);
    updateStats();
    
    showNotification('New order created!');
}

// Change page
function changePage(direction) {
    const totalPages = 12;
    currentPage += direction;
    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    // Update active page button
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page == currentPage) {
            btn.classList.add('active');
        }
    });
    
    // In a real application, you would fetch new data here
    console.log(`Loading page ${currentPage}`);
}

// Add click handlers for page buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.page-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', function() {
            currentPage = parseInt(this.dataset.page);
            document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            console.log(`Loading page ${currentPage}`);
        });
    });
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('currentUser');
        window.location.href = '../Login/login.html';
    }
}

// Show notification (simple alert for now)
function showNotification(message) {
    // You can replace this with a better notification system
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #000000ff;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


// Verificar sesión al cargar la página
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = '../Login/login.html';
} else {
    // Cargar datos del usuario
    if (currentUser.fullname) {
        console.log('Welcome, ' + currentUser.fullname);
    }
    // Obtener datos de usuarios
    const usersData = JSON.parse(localStorage.getItem('usersData'));
    if (usersData && usersData.users) {
        console.log('Total users:', usersData.users.length);
    }
}