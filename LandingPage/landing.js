// Verificar sesión al cargar la página
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

if (!currentUser || currentUser.role !== 'user') {
    window.location.href = './Login/login.html';
} else {
    // Mostrar información del usuario
    document.getElementById('userName').textContent = currentUser.fullname;
    document.getElementById('userFullname').textContent = currentUser.fullname;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userRole').textContent = currentUser.role.toUpperCase();
    document.getElementById('userId').textContent = currentUser.id;
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = './Login/login.html';
}