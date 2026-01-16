// === USER DATA & CREDENTIALS ===
const credentials = {
    "KrishAbes": "Krish@123",
    "ManikAbes": "Manik@123",
    "KrishnaAbes": "Krishna@123"
};

const userRealNames = {
    "KrishAbes": "Krish Kumar",
    "ManikAbes": "Manik Mehra",
    "KrishnaAbes": "Krishna Kholiya",
    "GuestUser": "Demo Guest"
};

// Store balances separately
const userWallets = {
    "KrishAbes": 10.0,
    "ManikAbes": 10.0,
    "KrishnaAbes": 10.0,
    "GuestUser": 0.0
};

let currentUser = null; 

// === AUTHENTICATION LOGIC ===

function validateLogin() {
    const idInput = document.getElementById('login-id').value;
    const passInput = document.getElementById('login-pass').value;
    const errorMsg = document.getElementById('login-error');

    if (credentials[idInput] && credentials[idInput] === passInput) {
        loginSuccess(idInput);
    } else {
        errorMsg.innerText = "Invalid ID or Password.";
        document.querySelector('.auth-box').style.animation = "shake 0.3s";
        setTimeout(() => document.querySelector('.auth-box').style.animation = "", 300);
    }
}

// === NEW: MOCK SOCIAL LOGIN ===
function mockSocialLogin(provider) {
    // 1. Alert for the Judges
    alert(`(Demo) Simulating OAuth Redirect to ${provider}...`);
    
    // 2. Log in as a specific user automatically
    loginSuccess("KrishAbes"); // Default to your main profile for the demo
}

function loginSuccess(userId) {
    currentUser = userId; 
    
    document.getElementById('auth-overlay').style.display = 'none';
    const app = document.getElementById('main-app');
    app.classList.remove('blur-content');
    app.classList.add('active');

    document.getElementById('profile-name').innerHTML = `<i class="fas fa-user-circle"></i> ${userRealNames[userId]}`;
    document.getElementById('user-balance').innerText = userWallets[userId].toFixed(1);
    document.getElementById('login-error').innerText = "";
}

function logout() {
    document.getElementById('auth-overlay').style.display = 'flex';
    const app = document.getElementById('main-app');
    app.classList.add('blur-content');
    app.classList.remove('active');

    document.getElementById('login-id').value = "";
    document.getElementById('login-pass').value = "";
    currentUser = null; 
}

function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const btns = document.querySelectorAll('.tab-btn');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        btns[0].classList.add('active');
        btns[1].classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        btns[0].classList.remove('active');
        btns[1].classList.add('active');
    }
}

// === MAIN APP LOGIC ===
let currentMode = 'learn'; 

const prices = {
    'Python': { learn: 2.0, teach: 3.0 },
    'Piano': { learn: 1.0, teach: 1.5 },
    'French': { learn: 1.5, teach: 2.0 }
};

function setMode(mode) {
    currentMode = mode;
    document.getElementById('learn-btn').classList.toggle('active', mode === 'learn');
    document.getElementById('teach-btn').classList.toggle('active', mode === 'teach');
    
    updateCard('python-price', prices.Python);
    updateCard('piano-price', prices.Piano);
    updateCard('french-price', prices.French);
}

function updateCard(elementId, priceObj) {
    const el = document.getElementById(elementId);
    if (currentMode === 'learn') {
        el.innerHTML = `- ${priceObj.learn}`;
        el.style.color = '#ff4757'; 
    } else {
        el.innerHTML = `+ ${priceObj.teach}`;
        el.style.color = '#2ed573'; 
    }
}

function transact(skill, learnCost, teachEarn) {
    if (!currentUser) return; 

    const amount = currentMode === 'learn' ? learnCost : teachEarn;
    let currentBalance = userWallets[currentUser];

    if (currentMode === 'learn') {
        if (currentBalance >= amount) {
            userWallets[currentUser] -= amount;
            alert(`Success! You spent ${amount} X-Coins to learn ${skill}.`);
        } else {
            alert("Insufficient Balance! Try teaching a skill or buying coins.");
            return;
        }
    } else {
        userWallets[currentUser] += amount;
        alert(`Great! You earned ${amount} X-Coins for teaching ${skill}.`);
    }
    updateBalanceDisplay();
}

function calcBuy() {
    const coins = document.getElementById('buy-input').value;
    const cost = coins * 50; 
    document.getElementById('buy-cost').innerText = cost;
}

function buyCoins() {
    if (!currentUser) return;
    const coins = parseFloat(document.getElementById('buy-input').value);
    userWallets[currentUser] += coins;
    alert(`Purchased ${coins} X-Coins for ₹${coins * 50}`);
    updateBalanceDisplay();
}

function calcRedeem() {
    const coins = document.getElementById('redeem-input').value;
    const value = coins * 30; 
    document.getElementById('redeem-value').innerText = value;
}

function redeemCoins() {
    if (!currentUser) return;
    const coins = parseFloat(document.getElementById('redeem-input').value);
    if (userWallets[currentUser] >= coins) {
        userWallets[currentUser] -= coins;
        alert(`Redeemed ${coins} X-Coins. ₹${coins * 30} sent to your bank.`);
        updateBalanceDisplay();
    } else {
        alert("Not enough coins to redeem!");
    }
}

function updateBalanceDisplay() {
    if (currentUser) {
        document.getElementById('user-balance').innerText = userWallets[currentUser].toFixed(1);
    }
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}