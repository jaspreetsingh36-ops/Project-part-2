// Frontend/auth.js - Authentication system
const API_BASE_URL = window.location.origin;

class AuthService {
    static isAuthenticated() {
        return localStorage.getItem('currentUser') !== null;
    }

    static getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    static getToken() {
        const currentUser = this.getCurrentUser();
        return currentUser ? currentUser.token : null;
    }

    static async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('currentUser', JSON.stringify(data));
            return data;
        } catch (error) {
            throw new Error(error.message || 'Invalid email or password');
        }
    }

    static async register(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Email already exists');
        }
    }

    static logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Navigation Management
function updateNavigation() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
        // User is logged in
        navLinks.innerHTML = `
            <li><a href="index.html" class="${isActivePage('index.html') ? 'active' : ''}">Home</a></li>
            <li><a href="cars.html" class="${isActivePage('cars.html') ? 'active' : ''}">Available Cars</a></li>
            <li><a href="add-car.html" class="${isActivePage('add-car.html') ? 'active' : ''}">Add Car</a></li>
            <li><a href="#" id="logoutBtn">Logout (${currentUser.user.email})</a></li>
        `;
    } else {
        // User is logged out
        navLinks.innerHTML = `
            <li><a href="index.html" class="${isActivePage('index.html') ? 'active' : ''}">Home</a></li>
            <li><a href="cars.html" class="${isActivePage('cars.html') ? 'active' : ''}">Available Cars</a></li>
            <li><a href="login.html" class="${isActivePage('login.html') ? 'active' : ''}">Login</a></li>
            <li><a href="register.html" class="${isActivePage('register.html') ? 'active' : ''}">Register</a></li>
        `;
    }

    // Add logout event listener
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AuthService.logout();
        });
    }
}
