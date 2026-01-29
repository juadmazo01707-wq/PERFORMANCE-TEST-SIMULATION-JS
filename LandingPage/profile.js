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
        loadUserProfile(testUser);
    } else {
        loadUserProfile(currentUser);
    }
    
    loadOrders();
});

// Cargar información del perfil
function loadUserProfile(user) {
    document.getElementById('userName').textContent = user.fullname;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    
    // Calcular estadísticas
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.userId === user.id);
    
    document.getElementById('totalOrders').textContent = userOrders.length;
    
    // Calcular puntos de lealtad (10 puntos por cada dólar gastado)
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    const loyaltyPoints = Math.floor(totalSpent * 10);
    document.getElementById('loyaltyPoints').textContent = loyaltyPoints;
}

// Cargar órdenes
function loadOrders() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    const ordersContainer = document.getElementById('ordersContainer');
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4 p-5 text-center">
                <i class="fa-solid fa-receipt text-muted mb-3" style="font-size: 3rem;"></i>
                <h5 class="fw-bold mb-2">No orders yet</h5>
                <p class="text-muted mb-3">Start ordering delicious food from our menu!</p>
                <a href="../landing.html" class="btn btn-success">Browse Menu</a>
            </div>
        `;
        return;
    }
    
    // Ordenar por fecha (más reciente primero)
    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Mostrar solo las 4 órdenes más recientes
    const recentOrders = userOrders.slice(0, 4);
    
    ordersContainer.innerHTML = recentOrders.map(order => {
        const date = new Date(order.date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        return `
            <div class="card border-0 shadow-sm rounded-4 mb-3">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="bg-success bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                                <i class="fa-solid fa-${getStatusIcon(order.status)} text-success"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold mb-1">#${order.id}</h5>
                                <small class="text-muted">${formattedDate} • ${order.items.length} Item${order.items.length > 1 ? 's' : ''}</small>
                            </div>
                        </div>
                        <div class="text-end">
                            <h5 class="fw-bold mb-1">$${order.total.toFixed(2)}</h5>
                            <span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2 flex-wrap">
                        <button class="btn btn-sm btn-outline-secondary" onclick="viewReceipt('${order.id}')">
                            View Receipt
                        </button>
                        ${order.status === 'Delivered' ? `
                            <button class="btn btn-sm btn-success" onclick="reorder('${order.id}')">
                                Reorder
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Obtener icono según el estado
function getStatusIcon(status) {
    switch(status) {
        case 'Preparing': return 'fire-burner';
        case 'Delivered': return 'check';
        case 'Cancelled': return 'xmark';
        default: return 'clock';
    }
}

// Obtener clase de badge según el estado
function getStatusBadgeClass(status) {
    switch(status) {
        case 'Preparing': return 'bg-warning text-dark';
        case 'Delivered': return 'bg-success';
        case 'Cancelled': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

// Ver recibo
function viewReceipt(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Order not found');
        return;
    }
    
    let receiptHTML = `
        ORDER RECEIPT
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Order ID: ${order.id}
        Date: ${new Date(order.date).toLocaleString()}
        Status: ${order.status}
        
        ITEMS:
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
    order.items.forEach(item => {
        receiptHTML += `\n${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`;
        if (item.note) {
            receiptHTML += `\n   Note: ${item.note}`;
        }
    });
    
    receiptHTML += `
        
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Subtotal: $${order.subtotal.toFixed(2)}
        Tax (8%): $${order.tax.toFixed(2)}
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        TOTAL: $${order.total.toFixed(2)}
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        Thank you for your order!
    `;
    
    alert(receiptHTML);
}

// Reordenar
function reorder(orderId) {
    if (confirm('Do you want to add these items to your cart and go to the menu?')) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.id === orderId);
        
        if (order) {
            // Guardar los items en sessionStorage para que el landing.html los cargue
            sessionStorage.setItem('reorderItems', JSON.stringify(order.items));
            window.location.href = './landing.html';
        }
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        sessionStorage.removeItem('currentUser');
        window.location.href = './landing.html';
    }
}

// View All button
document.getElementById('viewAllBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Aquí podrías implementar una página separada para ver todas las órdenes
    alert('This feature would show all orders in a separate page.');
});