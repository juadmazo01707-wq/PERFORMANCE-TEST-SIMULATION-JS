const API_URL = "http://localhost:3000/";

// Base de datos de usuarios inicial
let usersData = {
    "users": [
        {
            "id": "1",
            "fullname": "Super Admin",
            "email": "admin@gmail.com",
            "pass": "admin",
            "role": "admin"
        },
        {
            "id": "2",
            "fullname": "Standard User",
            "email": "user@gmail.com",
            "pass": "user",
            "role": "user"
        }
    ],
    "products": []
};

// Cargar datos desde localStorage
const loadDataFromStorage = () => {
    const storedData = localStorage.getItem('usersData');
    if (storedData) {
        usersData = JSON.parse(storedData);
    } else {
        // Si no hay datos en localStorage, guardar los datos iniciales
        saveDataToStorage();
    }
};

// Guardar datos en localStorage
const saveDataToStorage = () => {
    localStorage.setItem('usersData', JSON.stringify(usersData));
};

// Guardar datos en el servidor (db.json)
const saveDataToServer = async () => {
    try {
        const response = await fetch(`${API_URL}users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            // Si la conexión funciona, actualizar todos los usuarios
            for (const user of usersData.users) {
                // Verificar si el usuario existe en el servidor
                const checkResponse = await fetch(`${API_URL}users?email=${user.email}`);
                const existingUsers = await checkResponse.json();

                if (existingUsers.length === 0) {
                    // Si no existe, crear el usuario en el servidor
                    await fetch(`${API_URL}users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(user)
                    });
                }
            }
            return true;
        }
    } catch (error) {
        console.warn('Server not available, using localStorage only:', error.message);
        return false;
    }
};

// Cargar datos desde el servidor
const loadDataFromServer = async () => {
    try {
        const response = await fetch(`${API_URL}users`);
        if (response.ok) {
            const serverUsers = await response.json();
            if (serverUsers && serverUsers.length > 0) {
                usersData.users = serverUsers;
                saveDataToStorage(); // Sincronizar con localStorage
                return true;
            }
        }
    } catch (error) {
        console.warn('Could not load from server, using localStorage:', error.message);
    }
    return false;
};

// Obtener todos los usuarios
const getUsers = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(usersData.users), 100);
    });
};

// Encontrar usuario por email
const getUserByEmail = async (email) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = usersData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            resolve(user);
        }, 100);
    });
};

// Crear nuevo usuario
const createUser = async (userData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Generar ID único
            const maxId = usersData.users.reduce((max, user) => {
                const userId = parseInt(user.id);
                return userId > max ? userId : max;
            }, 0);

            const newUser = {
                id: String(maxId + 1),
                ...userData
            };

            // Agregar a la lista local
            usersData.users.push(newUser);

            // Guardar en localStorage
            saveDataToStorage();

            // Intentar guardar en el servidor
            try {
                const response = await fetch(`${API_URL}users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser)
                });

                if (response.ok) {
                    console.log('User saved to server successfully');
                }
            } catch (serverError) {
                console.warn('Could not save to server, saved to localStorage only:', serverError.message);
            }

            resolve(newUser);
        } catch (error) {
            reject(error);
        }
    });
};

// Validar credenciales de login
const validateLogin = async (fullname, email, password, role) => {
    const users = await getUsers();
    const user = users.find(u =>
        u.fullname.toLowerCase() === fullname.toLowerCase() &&
        u.email.toLowerCase() === email.toLowerCase() &&
        u.pass === password &&
        u.role === role
    );

    if (!user) throw new Error('Invalid credentials or role mismatch');
    return user;
};

// Validar y registrar nuevo usuario
const validateSignup = async (fullname, email, password, confirmPassword) => {
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
    }
    
    // Validar longitud de contraseña
    if (password.length < 4) {
        throw new Error('La contraseña debe tener al menos 4 caracteres');
    }
    
    // Validar que el email no esté registrado
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error('El email ya está registrado');
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Formato de email inválido');
    }
    
    // Crear el usuario con rol por defecto
    return await createUser({ 
        fullname, 
        email, 
        pass: password, 
        role: "user" 
    });
};

// Guardar sesión
const saveSession = (user) => {
    sessionStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
    }));
};

// Obtener sesión actual
const getCurrentSession = () => {
    const session = sessionStorage.getItem('currentUser');
    return session ? JSON.parse(session) : null;
};

// Cerrar sesión
const clearSession = () => {
    sessionStorage.removeItem('currentUser');
};

// Redirigir según el rol
const redirectByRole = (user) => {
    if (user.role === 'admin') {
        window.location.href = '../DashBoard/dash.html';
    } else {
        window.location.href = '../landing.html';
    }
};

// Logout
const logout = () => {
    clearSession();
    window.location.href = '../Login/login.html';
};

// Función para mostrar el formulario de signup
const showSignupForm = () => {
    const loginContainer = document.getElementById('loginContainer');
    const signupContainer = document.getElementById('signupContainer');

    loginContainer.classList.add('d-none');
    signupContainer.classList.remove('d-none');
    signupContainer.classList.add('fade-in');

    // Limpiar el formulario de signup
    document.getElementById('signupForm').reset();
};

// Función para mostrar el formulario de login
const showLoginForm = () => {
    const loginContainer = document.getElementById('loginContainer');
    const signupContainer = document.getElementById('signupContainer');

    signupContainer.classList.add('d-none');
    loginContainer.classList.remove('d-none');
    loginContainer.classList.add('fade-in');

    // Limpiar el formulario de login
    document.getElementById('loginForm').reset();
};

// Función para exportar datos (útil para debugging)
const exportUsersData = () => {
    const dataStr = JSON.stringify(usersData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users-data.json';
    link.click();
    URL.revokeObjectURL(url);
};

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar datos desde localStorage primero
    loadDataFromStorage();

    // Intentar sincronizar con el servidor
    await loadDataFromServer();

    // Verificar si hay sesión activa
    const currentSession = getCurrentSession();
    if (currentSession) {
        redirectByRole(currentSession);
        return; // Salir si hay sesión activa
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullname = document.getElementById('loginFullname').value.trim();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const role = document.getElementById('loginRole').value;

            try {
                const user = await validateLogin(fullname, email, password, role);
                saveSession(user);
                alert('Login successful!');
                setTimeout(() => redirectByRole(user), 500);
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullname = document.getElementById('signupFullname').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            try {
                const newUser = await validateSignup(fullname, email, password, confirmPassword);

                console.log('New user created:', newUser);
                alert('Account created successfully! Please login.');
                showLoginForm();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Botón para mostrar Signup
    const showSignupBtn = document.getElementById('showSignup');
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSignupForm();
        });
    }

    // Botón para mostrar Login
    const showLoginBtn = document.getElementById('showLogin');
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }
});

// Funciones globales
window.logout = logout;
window.showSignupForm = showSignupForm;
window.showLoginForm = showLoginForm;
window.exportUsersData = exportUsersData;
window.usersData = usersData; // Para debugging en consola