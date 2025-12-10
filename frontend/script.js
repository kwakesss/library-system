// API Base URL - Update with your backend URL
const API_BASE_URL = 'http://localhost:3000/api';

// Global state
let currentUser = null;
let books = [];
let authors = [];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const searchInput = document.getElementById('searchInput');
const authorFilter = document.getElementById('authorFilter');
const booksContainer = document.getElementById('booksContainer');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userGreeting = document.getElementById('userGreeting');

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
        currentUser = JSON.parse(userData);
        updateNavigation();
        return true;
    }
    return false;
}

// Update navigation based on auth state
function updateNavigation() {
    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userGreeting) {
            userGreeting.textContent = `Welcome, ${currentUser.full_name}`;
            userGreeting.style.display = 'block';
        }
        
        // Show admin link if user is admin
        const adminLink = document.getElementById('adminLink');
        if (adminLink) {
            adminLink.style.display = currentUser.role === 'admin' ? 'block' : 'none';
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userGreeting) {
            userGreeting.style.display = 'none';
        }
    }
}

// API Request Helper
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: defaultHeaders,
            ...options
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Request failed');
        }
        
        return await response.json();
    } catch (error) {
        showAlert(error.message, 'error');
        throw error;
    }
}

// Show alert message
function showAlert(message, type = 'success') {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    mainContent.prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Load books
async function loadBooks() {
    try {
        if (!booksContainer) return;
        booksContainer.innerHTML = '<div class="loading">Loading books...</div>';
        
        const search = searchInput ? searchInput.value : '';
        const author = authorFilter ? authorFilter.value : '';
        
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (author) queryParams.append('author', author);
        
        books = await apiRequest(`/books?${queryParams}`);
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Load authors for filter
async function loadAuthors() {
    try {
        authors = await apiRequest('/authors');
        if (authorFilter) {
            authorFilter.innerHTML = '<option value="">All Authors</option>' +
                authors.map(author => 
                    `<option value="${author.author_id}">${author.name}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Error loading authors:', error);
    }
}

// Display books in grid
function displayBooks(books) {
    if (!booksContainer) return;
    
    if (books.length === 0) {
        booksContainer.innerHTML = '<div class="loading">No books found</div>';
        return;
    }
    
    booksContainer.innerHTML = books.map(book => `
        <div class="book-card">
            <div class="book-card-header">
                <h3 class="book-title">${book.title}</h3>
            </div>
            <div class="book-card-body">
                <p class="book-author"><strong>Author:</strong> ${book.author_name}</p>
                <p class="book-isbn"><strong>ISBN:</strong> ${book.isbn}</p>
                <p><strong>Year:</strong> ${book.published_year}</p>
                <p><strong>Available:</strong> ${book.copies_available} copies</p>
                <p><strong>Status:</strong> 
                    <span class="book-status status-${book.copies_available > 0 ? 'available' : 'unavailable'}">
                        ${book.copies_available > 0 ? 'Available' : 'Not Available'}
                    </span>
                </p>
                <div style="margin-top: 15px;">
                    ${currentUser && currentUser.role !== 'admin' ? `
                        <button onclick="borrowBook(${book.book_id})" 
                                class="btn btn-primary" 
                                ${book.copies_available === 0 ? 'disabled' : ''}
                                style="width: 100%">
                            Borrow Book
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Borrow a book
async function borrowBook(bookId) {
    if (!currentUser) {
        showAlert('Please login to borrow books', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to borrow this book?')) return;
    
    try {
        await apiRequest('/borrow', {
            method: 'POST',
            body: JSON.stringify({ book_id: bookId })
        });
        
        showAlert('Book borrowed successfully!');
        loadBooks();
        
        // If on dashboard page, reload borrowed books
        if (window.location.pathname.includes('dashboard.html')) {
            loadMyBooks();
        }
    } catch (error) {
        console.error('Error borrowing book:', error);
    }
}

// Return a book
async function returnBook(recordId) {
    if (!confirm('Are you sure you want to return this book?')) return;
    
    try {
        await apiRequest(`/return/${recordId}`, {
            method: 'POST'
        });
        
        showAlert('Book returned successfully!');
        loadMyBooks();
        loadBooks();
    } catch (error) {
        console.error('Error returning book:', error);
    }
}

// Load user's borrowed books
async function loadMyBooks() {
    try {
        const myBooks = await apiRequest('/my-books');
        displayMyBooks(myBooks);
    } catch (error) {
        console.error('Error loading borrowed books:', error);
    }
}

// Display borrowed books
function displayMyBooks(books) {
    const container = document.getElementById('borrowedBooksContainer');
    if (!container) return;
    
    if (books.length === 0) {
        container.innerHTML = '<div class="loading">You have no borrowed books</div>';
        return;
    }
    
    container.innerHTML = books.map(book => `
        <div class="book-card">
            <div class="book-card-header">
                <h3 class="book-title">${book.title}</h3>
            </div>
            <div class="book-card-body">
                <p><strong>Author:</strong> ${book.author_name}</p>
                <p><strong>Borrowed on:</strong> ${new Date(book.borrow_date).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${new Date(new Date(book.borrow_date).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                ${!book.return_date ? `
                    <button onclick="returnBook(${book.record_id})" class="btn btn-secondary" style="width: 100%; margin-top: 10px;">
                        Return Book
                    </button>
                ` : `
                    <p><strong>Returned on:</strong> ${new Date(book.return_date).toLocaleDateString()}</p>
                `}
            </div>
        </div>
    `).join('');
}

// Initialize page
async function initPage() {
    checkAuth();
    updateNavigation();
    
    if (document.getElementById('booksContainer')) {
        await loadAuthors();
        await loadBooks();
        
        // Add event listeners for search/filter
        if (searchInput) {
            searchInput.addEventListener('input', debounce(loadBooks, 300));
        }
        
        if (authorFilter) {
            authorFilter.addEventListener('change', loadBooks);
        }
    }
    
    if (document.getElementById('borrowedBooksContainer')) {
        if (currentUser) {
            await loadMyBooks();
        } else {
            window.location.href = 'login.html';
        }
    }
}

// Debounce helper for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Event Listeners
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const data = await apiRequest('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            
            showAlert('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const full_name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            return;
        }
        
        try {
            await apiRequest('/register', {
                method: 'POST',
                body: JSON.stringify({ full_name, email, password })
            });
            
            showAlert('Registration successful! Please login.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } catch (error) {
            console.error('Registration error:', error);
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        currentUser = null;
        window.location.href = 'index.html';
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);
