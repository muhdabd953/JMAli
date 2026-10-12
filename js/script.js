/*
====================================

JM FARM WEBSITE

This is our JavaScript file.

JavaScript makes the website
interactive.

SECTION GUIDE:
1. Product and order storage keys
2. Product list and default catalog data
3. Customer storefront rendering
4. Admin product management logic
5. Order dashboard and staff notifications
6. Customer order form workflow

This project is currently a frontend prototype
for JM Ali. It is designed so it can later grow
into a real database-backed ecommerce system.

====================================
*/

// ================================
// STORAGE KEYS
// These names are used to save data in the browser.
// Later, these will be replaced by real database tables.
// ================================
const ORDER_STORAGE_KEY = "jmAliOrders";
const STAFF_NOTIFICATION_STORAGE_KEY = "jmAliStaffNotifications";
const PRODUCT_CATEGORIES = ["Vegetables", "Fruits", "Seafood"];
const PRODUCTS_API_URL = "./api/products.php";
const AUTH_API_URL = "./api/auth.php";
const DEFAULT_PRODUCT_IMAGE = "./Images/products/fruit/red_apple.avif";
const LANGUAGE_STORAGE_KEY = "jmAliLanguage";
const UI_TRANSLATIONS = {
    "JM Ali | Fresh Groceries": "JM Ali | Barangan Runcit Segar",
    "Home": "Laman Utama", "Products": "Produk", "About": "Tentang Kami", "Contact": "Hubungi Kami",
    "Log in": "Log masuk", "Sign up": "Daftar", "Log out": "Log keluar",
    "Open shopping cart": "Buka troli", "Language": "Pilihan bahasa", "Shop categories": "Kategori belian",
    "Main navigation": "Navigasi utama", "JM Ali Logo": "Logo JM Ali",
    "Promotion items": "Barangan promosi", "All products": "Semua produk",
    "Promotions": "Promosi", "Vegetables": "Sayur-sayuran", "Fruits": "Buah-buahan", "Fish": "Ikan",
    "Ikan Bilis": "Ikan bilis", "More": "Lagi", "Search products": "Cari produk",
    "Search products...": "Cari produk...", "Search": "Cari", "Shop highlights": "Sorotan kedai",
    "Promotion Items": "Barangan Promosi", "View All Items": "Lihat Semua Barangan",
    "Browse the catalog": "Lihat katalog", "All Products": "Semua Produk", "Category": "Kategori",
    "All categories": "Semua kategori", "Fish & seafood": "Ikan & makanan laut", "Seafood": "Makanan laut",
    "Sort by": "Susun mengikut", "Name: A to Z": "Nama: A hingga Z", "Name: Z to A": "Nama: Z hingga A",
    "Price: low to high": "Harga: rendah ke tinggi", "Price: high to low": "Harga: tinggi ke rendah",
    "No products available yet. Please check back soon.": "Produk belum tersedia. Sila semak semula nanti.",
    "No promotion items available yet.": "Tiada barangan promosi buat masa ini.",
    "No products match your search or category.": "Tiada produk sepadan dengan carian atau kategori anda.",
    "Promotion items are temporarily unavailable.": "Barangan promosi tidak tersedia buat sementara waktu.",
    "Products are temporarily unavailable.": "Produk tidak tersedia buat sementara waktu.",
    "Why choose us": "Mengapa pilih kami", "Built for everyday freshness": "Kesegaran untuk setiap hari",
    "Farm Fresh": "Segar dari ladang",
    "We source quality produce from trusted growers and local suppliers.": "Kami mendapatkan hasil berkualiti daripada pekebun dan pembekal tempatan yang dipercayai.",
    "Fast Delivery": "Penghantaran pantas",
    "Receive your order quickly with dependable local delivery support.": "Pesanan anda dihantar dengan pantas melalui khidmat penghantaran tempatan yang boleh dipercayai.",
    "Friendly Service": "Layanan mesra",
    "Our team is ready to help with custom orders and product guidance.": "Pasukan kami sedia membantu dengan pesanan khas dan maklumat produk.",
    "Get in touch": "Hubungi kami", "Contact JM Ali": "Hubungi JM Ali",
    "Our location": "Lokasi kami", "Our Location": "Lokasi Kami", "Contact Us": "Hubungi kami",
    "Open location in Google Maps": "Buka lokasi di Google Maps",
    "Have a question or need help with an order? Call us directly.": "Ada soalan atau perlukan bantuan dengan pesanan? Hubungi kami terus.",
    "Pembekal Sayur Segar": "Fresh Vegetable Supplier",
    "Fresh groceries delivered with care.": "Barangan runcit segar dihantar dengan penuh perhatian.",
    "© 2026 JM Ali. All Rights Reserved.": "© 2026 JM Ali. Hak cipta terpelihara.",
    "Your Cart": "Troli Anda", "Close cart": "Tutup troli", "Total": "Jumlah",
    "Continue Shopping": "Teruskan membeli-belah", "Send Order": "Hantar pesanan",
    "Place Your Order": "Buat Pesanan", "Close order form": "Tutup borang pesanan",
    "Full Name": "Nama penuh", "Your name": "Nama anda", "Phone Number": "Nombor telefon",
    "Enter a valid Malaysian mobile number, for example 012-3456789.": "Masukkan nombor telefon bimbit Malaysia yang sah, contohnya 012-3456789.",
    "Delivery Address": "Alamat penghantaran", "Your address": "Alamat anda", "Order Items": "Senarai barang",
    "Example: 2 kg tomatoes, 1 kg carrots": "Contoh: 2 kg tomato, 1 kg lobak merah",
    "Notes / Delivery Instructions": "Nota / Arahan penghantaran", "Optional": "Pilihan", "Cancel": "Batal",
    "Confirm Your Details": "Sahkan Maklumat Anda", "Close order review": "Tutup semakan pesanan",
    "Edit Details": "Edit maklumat", "Confirm & Send": "Sahkan & hantar", "Order Confirmed": "Pesanan Disahkan",
    "Close confirmation": "Tutup pengesahan", "Added to Cart": "Ditambah ke troli", "Add to Cart": "Tambah ke troli",
    "Product quantity": "Kuantiti produk", "Remove": "Buang",
    "Your cart is empty. Add products or enter items manually.": "Troli anda kosong. Tambah produk atau masukkan barang secara manual.",
    "Your cart is empty. Add products to begin your order.": "Troli anda kosong. Tambah produk untuk memulakan pesanan.",
    "Fresh groceries": "Barangan runcit segar",
    "Please enter your name, phone, address, and order items.": "Sila masukkan nama, nombor telefon, alamat dan senarai barang.",
    "Please check your details before sending": "Sila semak maklumat anda sebelum menghantar",
    "Customer": "Pelanggan", "Order": "Pesanan", "Notes": "Nota", "Order sent successfully": "Pesanan berjaya dihantar",
    "Order number": "Nombor pesanan", "Date": "Tarikh", "Items": "Barang", "Delivery details": "Maklumat penghantaran",
    "Our team will contact you to confirm delivery.": "Pasukan kami akan menghubungi anda untuk mengesahkan penghantaran.",
    "Your cart is empty. Add a product before sending an order.": "Troli anda kosong. Tambah produk sebelum menghantar pesanan.",
    "Create your account": "Cipta akaun anda", "Reset your password": "Tetapkan semula kata laluan",
    "Choose a new password": "Pilih kata laluan baharu", "Create account": "Cipta akaun",
    "Send reset link": "Hantar pautan tetapan semula", "Update password": "Kemas kini kata laluan",
    "Close account dialog": "Tutup dialog akaun", "Account access": "Akses akaun", "Email address": "Alamat e-mel",
    "Password": "Kata laluan", "Forgot password?": "Lupa kata laluan?", "Confirm new password": "Sahkan kata laluan baharu",
    "I am signing up as": "Saya mendaftar sebagai", "Individual": "Individu", "Restaurant": "Restoran",
    "Keep me signed in on this device until I log out": "Kekalkan saya log masuk pada peranti ini sehingga saya log keluar",
    "Your passwords do not match.": "Kata laluan anda tidak sepadan.",
    "Please submit a valid account request.": "Sila hantar permintaan akaun yang sah.",
    "This request method is not supported.": "Kaedah permintaan ini tidak disokong.",
    "Choose log in or sign up to continue.": "Pilih log masuk atau daftar untuk meneruskan.",
    "Enter a valid email address.": "Masukkan alamat e-mel yang sah.",
    "Your password must be at least 8 characters.": "Kata laluan mestilah sekurang-kurangnya 8 aksara.",
    "Enter your name (up to 120 characters).": "Masukkan nama anda (maksimum 120 aksara).",
    "Choose Individual or Restaurant.": "Pilih Individu atau Restoran.",
    "An account with this email already exists. Log in instead.": "Akaun dengan e-mel ini sudah wujud. Sila log masuk.",
    "Your account could not be created. Please try again.": "Akaun anda tidak dapat dicipta. Sila cuba lagi.",
    "Email or password is incorrect.": "E-mel atau kata laluan tidak betul.",
    "This reset link is invalid or has expired.": "Pautan tetapan semula ini tidak sah atau telah tamat tempoh.",
    "Password reset email is not configured yet. Please contact JM Ali.": "E-mel tetapan semula kata laluan belum dikonfigurasi. Sila hubungi JM Ali.",
    "If an account exists for this email, password reset instructions have been sent.": "Jika akaun dengan e-mel ini wujud, arahan tetapan semula kata laluan telah dihantar.",
    "Your password has been updated. You can now log in.": "Kata laluan anda telah dikemas kini. Anda kini boleh log masuk.",
    "Account service is unavailable. Please try again later.": "Perkhidmatan akaun tidak tersedia. Sila cuba lagi nanti.",
    "Account request failed. Please try again.": "Permintaan akaun gagal. Sila cuba lagi."
};
const MALAY_TO_ENGLISH = Object.fromEntries(Object.entries(UI_TRANSLATIONS).map(([english, malay]) => [malay, english]));
let currentLanguage = (() => {
    try {
        return localStorage.getItem(LANGUAGE_STORAGE_KEY) === "ms" ? "ms" : "en";
    } catch (error) {
        return "en";
    }
})();
const cartItems = [];
let storefrontProducts = [];
let pendingOrder;

function localizedText(value) {
    if (currentLanguage === "ms") {
        if (value.startsWith("Quantity for ")) {
            return `Kuantiti untuk ${value.slice("Quantity for ".length)}`;
        }
        return UI_TRANSLATIONS[value] || value;
    }
    if (value.startsWith("Kuantiti untuk ")) {
        return `Quantity for ${value.slice("Kuantiti untuk ".length)}`;
    }
    return MALAY_TO_ENGLISH[value] || value;
}

function translatePage() {
    document.documentElement.lang = currentLanguage;
    document.title = localizedText("JM Ali | Fresh Groceries");
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
        const text = node.nodeValue;
        const trimmed = text.trim();
        if (trimmed) {
            const translated = localizedText(trimmed);
            if (translated !== trimmed) {
                node.nodeValue = text.replace(trimmed, translated);
            }
        }
    }

    document.querySelectorAll("[placeholder], [title], [aria-label], img[alt]").forEach((element) => {
        ["placeholder", "title", "aria-label", "alt"].forEach((attribute) => {
            if (element.hasAttribute(attribute)) {
                element.setAttribute(attribute, localizedText(element.getAttribute(attribute)));
            }
        });
    });
    document.querySelectorAll("[data-language]").forEach((button) => {
        const selected = button.dataset.language === currentLanguage;
        button.setAttribute("aria-pressed", String(selected));
        button.classList.toggle("active", selected);
    });
}

function setLanguage(language) {
    currentLanguage = language === "ms" ? "ms" : "en";
    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    } catch (error) {
        console.warn("Could not save the language preference.", error);
    }
    translatePage();
}

function initLanguageSwitch() {
    document.querySelectorAll("[data-language]").forEach((button) => {
        button.addEventListener("click", () => setLanguage(button.dataset.language));
    });
    translatePage();
    const languageObserver = new MutationObserver(translatePage);
    languageObserver.observe(document.body, { childList: true, subtree: true });
}

const defaultOrders = [
    { id: "#1048", customer: "Rahim", items: "2 x Mango, 1 x Apple", date: "2026-08-16", status: "Paid", total: "RM 94.00" },
    { id: "#1049", customer: "Sadia", items: "3 x Tomato, 2 x Onion", date: "2026-08-16", status: "Pending", total: "RM 56.60" },
    { id: "#1050", customer: "Karim", items: "1 x Tuna, 2 x Cucumber", date: "2026-08-15", status: "Shipped", total: "RM 118.40" },
    { id: "#1051", customer: "Nora", items: "4 x Carrot, 1 x Broccoli", date: "2026-08-15", status: "Cancelled", total: "RM 42.10" },
    { id: "#1052", customer: "Afiq", items: "2 x Watermelon, 1 x Pineapple", date: "2026-08-14", status: "Paid", total: "RM 86.00" }
];

// ================================
// PRODUCT STORAGE
// These functions save and read product data.
// In the future, this will connect to a backend API.
// ================================
async function getProductsFromDatabase() {
    const response = await fetch(PRODUCTS_API_URL);

    if (!response.ok) {
        throw new Error(`Products request failed with status ${response.status}.`);
    }

    return response.json();
}

function mapDatabaseProduct(product) {
    return {
        id: product.id,
        name: product.name,
        price: `RM ${Number(product.current_price).toFixed(2)} / ${product.unit}`,
        priceValue: Number(product.current_price),
        image: product.image_url,
        category: normalizeCategory(product.category)
    };
}

function normalizeCategory(category) {
    if (!category) {
        return "Vegetables";
    }

    const normalized = String(category).trim();
    return PRODUCT_CATEGORIES.includes(normalized) ? normalized : "Vegetables";
}

// ================================
// CUSTOMER STORE FRONT
// These functions render products on the homepage.
// They show the product list to shoppers.
// ================================
function createProductCard(product, isAdmin = false) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="card-body">
            <span class="product-category-label">${product.category}</span>
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <input class="product-quantity" type="number" min="1" value="1" aria-label="Quantity for ${product.name}">
            ${isAdmin ? "" : '<button type="button">Add to Cart</button>'}
        </div>
    `;
    return card;
}

function getSavedProducts() {
    return [];
}

function saveProducts() {
    // Product data is managed by the database API now.
}

function renderAdminProducts() {
    const list = document.getElementById("admin-product-list");

    if (list) {
        list.innerHTML = '<tr><td colspan="5">No products have been added yet.</td></tr>';
    }
}

function deleteProduct() {
    // Product deletion will be handled by the database API.
}

function openProductModalForEdit() {
    // Product editing will be handled by the database API.
}

async function renderStorefrontProducts() {
    const promotionContainer = document.getElementById("promotion-products");
    const allProductsContainer = document.getElementById("all-products-grid");

    if (!promotionContainer || !allProductsContainer) {
        return;
    }

    try {
        storefrontProducts = (await getProductsFromDatabase()).map(mapDatabaseProduct);
        renderPromotionItems();
        renderAllProducts();
        bindProductQuickOrderButtons();
    } catch (error) {
        console.error("Could not load products from the database:", error);
        promotionContainer.innerHTML = '<p class="empty-products">Promotion items are temporarily unavailable.</p>';
        allProductsContainer.innerHTML = '<p class="empty-products">Products are temporarily unavailable.</p>';
    }
}

function getSortedStorefrontProducts() {
    const searchTerm = (document.getElementById("storefront-search-input")?.value || "").trim().toLowerCase();
    const category = document.getElementById("storefront-category-filter")?.value || "All";
    const sortOrder = document.getElementById("storefront-sort")?.value || "name-asc";
    const products = storefrontProducts.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = category === "All" || product.category === category;
        return matchesSearch && matchesCategory;
    });

    products.sort((first, second) => {
        if (sortOrder === "name-desc") {
            return second.name.localeCompare(first.name);
        }
        if (sortOrder === "category") {
            return first.category.localeCompare(second.category) || first.name.localeCompare(second.name);
        }
        if (sortOrder === "price-asc") {
            return first.priceValue - second.priceValue;
        }
        if (sortOrder === "price-desc") {
            return second.priceValue - first.priceValue;
        }
        return first.name.localeCompare(second.name);
    });

    return products;
}

function renderPromotionItems() {
    const container = document.getElementById("promotion-products");
    if (!container) {
        return;
    }

    const promotionItems = storefrontProducts.slice(0, 4);
    container.innerHTML = promotionItems.length
        ? ""
        : '<p class="empty-products">No promotion items available yet.</p>';
    promotionItems.forEach((product) => container.appendChild(createProductCard(product)));
}

function renderAllProducts() {
    const container = document.getElementById("all-products-grid");
    if (!container) {
        return;
    }

    const products = getSortedStorefrontProducts();
    container.innerHTML = products.length
        ? ""
        : '<p class="empty-products">No products match your search or category.</p>';
    products.forEach((product) => container.appendChild(createProductCard(product)));
    bindProductQuickOrderButtons();
}

function initStorefrontControls() {
    const searchForm = document.getElementById("storefront-search");
    const categoryFilter = document.getElementById("storefront-category-filter");
    const sortSelect = document.getElementById("storefront-sort");

    searchForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        renderAllProducts();
        document.getElementById("all-products")?.scrollIntoView({ behavior: "smooth" });
    });
    categoryFilter?.addEventListener("change", renderAllProducts);
    sortSelect?.addEventListener("change", renderAllProducts);

    document.querySelectorAll("[data-category-filter]").forEach((shortcut) => {
        shortcut.addEventListener("click", () => {
            if (categoryFilter) {
                categoryFilter.value = shortcut.dataset.categoryFilter || "All";
                renderAllProducts();
            }
        });
    });
}

function setAuthStatus(message, isError = false) {
    const status = document.getElementById("auth-status");
    if (!status) {
        return;
    }

    status.textContent = localizedText(message);
    status.classList.toggle("error", isError);
}

function renderAuthUser(user) {
    const actions = document.getElementById("auth-actions");
    const userLabel = document.getElementById("auth-user");
    const logoutButton = document.getElementById("auth-logout");

    if (!actions || !userLabel || !logoutButton) {
        return;
    }

    actions.hidden = Boolean(user);
    userLabel.hidden = !user;
    logoutButton.hidden = !user;
    if (user) {
        const accountType = localizedText(user.account_type === "restaurant" ? "Restaurant" : "Individual");
        userLabel.textContent = `${user.full_name} · ${accountType}`;
    }
}

async function requestCustomerAuth(method, data = {}) {
    const response = await fetch(AUTH_API_URL, {
        method,
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: method === "GET" ? undefined : JSON.stringify({ ...data, language: currentLanguage })
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Account request failed. Please try again.");
    }

    return result;
}

function initCustomerAuth() {
    const modal = document.getElementById("auth-modal");
    const form = document.getElementById("auth-form");
    const tabs = document.getElementById("auth-tabs");
    const nameField = document.getElementById("auth-name-field");
    const emailField = document.getElementById("auth-email-field");
    const passwordField = document.getElementById("auth-password-field");
    const confirmPasswordField = document.getElementById("auth-confirm-password-field");
    const accountTypeField = document.getElementById("auth-account-type-field");
    const nameInput = document.getElementById("auth-name");
    const emailInput = document.getElementById("auth-email");
    const passwordInput = document.getElementById("auth-password");
    const confirmPasswordInput = document.getElementById("auth-confirm-password");
    const submitButton = document.getElementById("auth-submit");
    const loginTab = document.getElementById("auth-tab-login");
    const signupTab = document.getElementById("auth-tab-signup");
    const forgotPasswordButton = document.getElementById("auth-forgot-password");
    let mode = "login";
    let closeTimer;
    let resetToken = "";

    if (!modal || !form) {
        return;
    }

    const closeModal = () => {
        if (modal.classList.contains("hidden")) {
            return;
        }

        modal.classList.remove("is-open");
        modal.classList.add("is-closing");
        modal.setAttribute("aria-hidden", "true");
        window.clearTimeout(closeTimer);

        const finishClose = () => {
            modal.classList.add("hidden");
            modal.classList.remove("is-closing");
            form.reset();
            document.getElementById("auth-remember").checked = true;
            setAuthStatus("");
            resetToken = "";
        };
        closeTimer = window.setTimeout(
            finishClose,
            window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 260
        );
    };

    const setMode = (newMode) => {
        mode = newMode;
        const isSignup = mode === "signup";
        const isResetRequest = mode === "reset-request";
        const isResetPassword = mode === "reset-password";
        const isLogin = mode === "login";
        nameField.hidden = !isSignup;
        emailField.hidden = isResetPassword;
        passwordField.hidden = isResetRequest;
        confirmPasswordField.hidden = !isResetPassword;
        accountTypeField.hidden = !isSignup;
        tabs.hidden = isResetRequest || isResetPassword;
        forgotPasswordButton.hidden = !isLogin;
        document.querySelector(".remember-device").hidden = !isLogin && !isSignup;
        nameInput.required = isSignup;
        emailInput.required = !isResetPassword;
        passwordInput.required = !isResetRequest;
        confirmPasswordInput.required = isResetPassword;
        document.getElementById("auth-account-type").required = isSignup;
        passwordInput.autocomplete = isSignup || isResetPassword ? "new-password" : "current-password";
        document.getElementById("auth-title").textContent = localizedText(isSignup
            ? "Create your account"
            : isResetRequest
                ? "Reset your password"
                : isResetPassword
                    ? "Choose a new password"
                    : "Log in");
        submitButton.textContent = localizedText(isSignup
            ? "Create account"
            : isResetRequest
                ? "Send reset link"
                : isResetPassword
                    ? "Update password"
                    : "Log in");
        loginTab.setAttribute("aria-selected", String(isLogin));
        signupTab.setAttribute("aria-selected", String(isSignup));
        loginTab.classList.toggle("active", isLogin);
        signupTab.classList.toggle("active", isSignup);
        setAuthStatus("");
    };

    const openModal = (newMode) => {
        window.clearTimeout(closeTimer);
        setMode(newMode);
        modal.classList.remove("hidden", "is-closing");
        modal.setAttribute("aria-hidden", "false");
        void modal.offsetWidth;
        modal.classList.add("is-open");
        (newMode === "reset-password" ? passwordInput : emailInput).focus();
    };

    document.getElementById("open-login").addEventListener("click", () => openModal("login"));
    document.getElementById("open-signup").addEventListener("click", () => openModal("signup"));
    document.getElementById("close-auth").addEventListener("click", closeModal);
    loginTab.addEventListener("click", () => setMode("login"));
    signupTab.addEventListener("click", () => setMode("signup"));
    forgotPasswordButton.addEventListener("click", () => setMode("reset-request"));
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.classList.contains("hidden")) {
            closeModal();
        }
    });

    document.getElementById("auth-logout").addEventListener("click", async () => {
        try {
            await requestCustomerAuth("POST", { action: "logout" });
            renderAuthUser(null);
        } catch (error) {
            window.alert(localizedText(error.message));
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        setAuthStatus("");

        const data = { email: emailInput.value.trim() };
        if (mode === "signup") {
            data.action = "signup";
            data.password = passwordInput.value;
            data.remember = document.getElementById("auth-remember").checked;
            data.full_name = nameInput.value.trim();
            data.account_type = document.getElementById("auth-account-type").value;
        } else if (mode === "login") {
            data.action = "login";
            data.password = passwordInput.value;
            data.remember = document.getElementById("auth-remember").checked;
        } else if (mode === "reset-request") {
            data.action = "request_reset";
        } else {
            if (passwordInput.value !== confirmPasswordInput.value) {
                setAuthStatus("Your passwords do not match.", true);
                submitButton.disabled = false;
                return;
            }
            data.action = "reset_password";
            data.password = passwordInput.value;
            data.token = resetToken;
        }

        try {
            const result = await requestCustomerAuth("POST", data);
            if (mode === "reset-request") {
                setAuthStatus(result.message);
            } else if (mode === "reset-password") {
                resetToken = "";
                form.reset();
                setMode("login");
                setAuthStatus(result.message);
            } else {
                renderAuthUser(result.user);
                closeModal();
            }
        } catch (error) {
            setAuthStatus(error.message, true);
        } finally {
            submitButton.disabled = false;
        }
    });

    setMode("login");
    const currentUrl = new URL(window.location.href);
    resetToken = currentUrl.searchParams.get("reset") || "";
    if (resetToken) {
        currentUrl.searchParams.delete("reset");
        window.history.replaceState(null, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
        openModal("reset-password");
    }
    requestCustomerAuth("GET").then((result) => {
        renderAuthUser(result.user || null);
    }).catch(() => {
        renderAuthUser(null);
    });
}

// ================================
// ADMIN PRODUCT MANAGEMENT
// Admin can add, edit, delete, search, and filter products.
// This is the main area for product control.
// ================================
function renderAdminProducts() {
    const list = document.getElementById("admin-product-list");
    const searchInput = document.getElementById("product-search");
    const categoryFilter = document.getElementById("product-category-filter");

    if (!list) {
        return;
    }

    let products = getSavedProducts();
    const query = (searchInput?.value || "").trim().toLowerCase();
    const categoryValue = categoryFilter?.value || "All";

    if (query) {
        products = products.filter((product) => product.name.toLowerCase().includes(query));
    }

    if (categoryValue !== "All") {
        products = products.filter((product) => normalizeCategory(product.category) === categoryValue);
    }

    if (!products.length) {
        list.innerHTML = `
            <tr>
                <td colspan="5">No products match your filters.</td>
            </tr>
        `;
        return;
    }

    list.innerHTML = products.map((product, index) => `
        <tr>
            <td><img src="${product.image || "./Images/products/fruit/red_apple.avif"}" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${normalizeCategory(product.category)}</td>
            <td>${product.price}</td>
            <td>
                <div class="table-actions">
                    <button type="button" class="small-btn edit-btn" data-index="${index}">Edit</button>
                    <button type="button" class="small-btn delete-btn" data-index="${index}">Delete</button>
                </div>
            </td>
        </tr>
    `).join("");

    list.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const index = Number(event.currentTarget.dataset.index);
            openProductModalForEdit(index);
        });
    });

    list.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const index = Number(event.currentTarget.dataset.index);
            deleteProduct(index);
        });
    });
}

function deleteProduct() {
    // Product deletion will be handled by the database API.
}

function openProductModalForEdit() {
    // Product editing will be handled by the database API.
}

// ================================
// ORDER SYSTEM
// ================================
function getSavedOrders() {
    try {
        const savedOrders = localStorage.getItem(ORDER_STORAGE_KEY);
        if (!savedOrders) {
            return [...defaultOrders];
        }

        const parsedOrders = JSON.parse(savedOrders);
        return Array.isArray(parsedOrders) ? parsedOrders : [...defaultOrders];
    } catch (error) {
        console.error("Could not read saved orders:", error);
        return [...defaultOrders];
    }
}

function saveOrders(orders) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function getStaffNotifications() {
    try {
        const savedNotifications = localStorage.getItem(STAFF_NOTIFICATION_STORAGE_KEY);
        if (!savedNotifications) {
            return [];
        }

        const parsedNotifications = JSON.parse(savedNotifications);
        return Array.isArray(parsedNotifications) ? parsedNotifications : [];
    } catch (error) {
        console.error("Could not read staff notifications:", error);
        return [];
    }
}

function saveStaffNotifications(notifications) {
    localStorage.setItem(STAFF_NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
}

function notifyStaff(message) {
    const notifications = getStaffNotifications();
    notifications.unshift({
        id: Date.now(),
        title: "New customer order",
        message,
        time: new Date().toLocaleString()
    });

    saveStaffNotifications(notifications.slice(0, 8));
    renderStaffNotifications();
}

function renderStaffNotifications() {
    const list = document.getElementById("staff-notification-list");
    if (!list) {
        return;
    }

    const notifications = getStaffNotifications();
    if (!notifications.length) {
        list.innerHTML = '<li class="notification-item empty">No new orders yet.</li>';
        return;
    }

    list.innerHTML = notifications.map((notification) => `
        <li class="notification-item">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">${notification.time}</div>
        </li>
    `).join("");
}

function renderOrders() {
    const ordersTableBody = document.getElementById("orders-table-body");
    const searchInput = document.getElementById("order-search");
    const statusFilter = document.getElementById("order-status-filter");

    if (!ordersTableBody) {
        return;
    }

    let orders = getSavedOrders();
    const searchTerm = (searchInput?.value || "").trim().toLowerCase();
    const statusTerm = statusFilter?.value || "All";

    if (searchTerm) {
        orders = orders.filter((order) =>
            order.customer.toLowerCase().includes(searchTerm) ||
            order.id.toLowerCase().includes(searchTerm) ||
            order.items.toLowerCase().includes(searchTerm)
        );
    }

    if (statusTerm !== "All") {
        orders = orders.filter((order) => order.status === statusTerm);
    }

    ordersTableBody.innerHTML = orders.map((order) => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.items}</td>
            <td>${order.date}</td>
            <td><span class="status-pill ${order.status.toLowerCase()}">${order.status}</span></td>
            <td>${order.total}</td>
            <td>
                <div class="order-actions">
                    <button class="action-btn review-btn" data-order-id="${order.id}" type="button">View</button>
                    <button class="action-btn paid-btn" data-order-id="${order.id}" type="button" ${order.status === "Paid" ? "disabled" : ""}>Mark Paid</button>
                    <button class="action-btn ship-btn" data-order-id="${order.id}" type="button" ${order.status === "Shipped" || order.status === "Cancelled" ? "disabled" : ""}>Ship</button>
                    <button class="action-btn cancel-btn" data-order-id="${order.id}" type="button" ${order.status === "Cancelled" ? "disabled" : ""}>Cancel</button>
                </div>
            </td>
        </tr>
    `).join("");

    ordersTableBody.querySelectorAll(".review-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const ordersList = getSavedOrders();
            const order = ordersList.find((item) => item.id === button.dataset.orderId);
            if (order) {
                alert(`${order.customer} — ${order.items}\nStatus: ${order.status}\nTotal: ${order.total}`);
            }
        });
    });

    ordersTableBody.querySelectorAll(".paid-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const ordersList = getSavedOrders();
            const order = ordersList.find((item) => item.id === button.dataset.orderId);
            if (order) {
                order.status = "Paid";
                saveOrders(ordersList);
                renderOrders();
            }
        });
    });

    ordersTableBody.querySelectorAll(".ship-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const ordersList = getSavedOrders();
            const order = ordersList.find((item) => item.id === button.dataset.orderId);
            if (order) {
                order.status = "Shipped";
                saveOrders(ordersList);
                renderOrders();
            }
        });
    });

    ordersTableBody.querySelectorAll(".cancel-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const ordersList = getSavedOrders();
            const order = ordersList.find((item) => item.id === button.dataset.orderId);
            if (order) {
                order.status = "Cancelled";
                saveOrders(ordersList);
                renderOrders();
            }
        });
    });
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Image could not be read."));
        reader.readAsDataURL(file);
    });
}

function parseProductPrice(price) {
    const match = String(price || "").match(/RM\s*([\d,.]+)/i);
    return match ? Number(match[1].replace(/,/g, "")) : 0;
}

function formatCartItems() {
    return cartItems.map((item) => `${item.quantity} x ${item.name}`).join(", ");
}

function getCartTotal() {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCartSummary() {
    const summary = document.getElementById("cart-summary");
    const itemsInput = document.getElementById("customer-order-items");

    if (!summary) {
        return;
    }

    if (!cartItems.length) {
        summary.innerHTML = "<p>Your cart is empty. Add products or enter items manually.</p>";
        return;
    }

    summary.innerHTML = cartItems.map((item) => `
        <div class="cart-item">
            <span>${item.quantity} x ${item.name}</span>
            <strong>RM ${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
    `).join("") + `
        <div class="cart-total"><span>Total</span><strong>RM ${getCartTotal().toFixed(2)}</strong></div>
    `;

    if (itemsInput) {
        itemsInput.value = formatCartItems();
    }
}

function updateCartDisplay() {
    const count = document.getElementById("cart-count");
    const modalItems = document.getElementById("cart-modal-items");
    const modalTotal = document.getElementById("cart-modal-total");

    if (count) {
        count.textContent = String(cartItems.reduce((total, item) => total + item.quantity, 0));
    }

    if (modalItems) {
        modalItems.innerHTML = cartItems.length ? cartItems.map((item, index) => `
            <div class="cart-modal-item">
                <div class="cart-item-name">
                    <p>${item.name}</p>
                    <button class="remove-cart-item" type="button" data-cart-index="${index}">Remove</button>
                </div>
                <input class="cart-quantity" type="number" min="1" value="${item.quantity}" data-cart-index="${index}" aria-label="Quantity for ${item.name}">
                <strong>RM ${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
        `).join("") : "<p>Your cart is empty. Add products to begin your order.</p>";
    }

    if (modalTotal) {
        modalTotal.textContent = `RM ${getCartTotal().toFixed(2)}`;
    }

    renderCartSummary();
}

function addToCart(name, price, quantity) {
    const existingItem = cartItems.find((item) => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({ name, price, quantity });
    }
    updateCartDisplay();
    showCartToast();
}

let cartToastTimer;

function showCartToast() {
    const toast = document.getElementById("cart-toast");
    if (!toast) {
        return;
    }

    clearTimeout(cartToastTimer);
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");
    toast.setAttribute("aria-hidden", "false");
    cartToastTimer = setTimeout(() => toast.setAttribute("aria-hidden", "true"), 2400);
}

function bindProductQuickOrderButtons() {
    const orderButtons = document.querySelectorAll(".card button");
    if (!orderButtons.length) {
        return;
    }

    orderButtons.forEach((button) => {
        if (button.dataset.bound === "true") {
            return;
        }
        button.dataset.bound = "true";
        const card = button.closest(".card");
        if (card && !card.querySelector(".product-quantity")) {
            const quantityInput = document.createElement("input");
            quantityInput.className = "product-quantity";
            quantityInput.type = "number";
            quantityInput.min = "1";
            quantityInput.value = "1";
            quantityInput.setAttribute("aria-label", "Product quantity");
            button.parentElement.insertBefore(quantityInput, button);
        }
        button.addEventListener("click", () => {
            const title = card?.querySelector("h3")?.textContent?.trim();
            const priceText = card?.querySelector("p")?.textContent?.trim();
            const quantityInput = card?.querySelector(".product-quantity");
            const quantity = Math.max(1, Number(quantityInput?.value) || 1);
            addToCart(title || "Fresh groceries", parseProductPrice(priceText), quantity);
            if (quantityInput) {
                quantityInput.value = "1";
            }
        });
    });
}

// ================================
// CUSTOMER ORDER SUBMISSION
// This lets shoppers submit their details and order items.
// When submitted, the order is stored and staff are alerted.
// ================================
function initCustomerOrderForm() {
    const triggerButton = document.getElementById("open-customer-order");
    const modal = document.getElementById("customer-order-modal");
    const form = document.getElementById("customer-order-form");
    const closeButton = document.getElementById("close-customer-order");
    const cancelButton = document.getElementById("cancel-customer-order");

    if (!modal || !form) {
        return;
    }

    const closeModal = (resetForm = true) => {
        modal.classList.add("hidden");
        if (resetForm) {
            form.reset();
            updateCartDisplay();
        }
    };

    triggerButton?.addEventListener("click", () => {
        updateCartDisplay();
        modal.classList.remove("hidden");
    });

    closeButton?.addEventListener("click", closeModal);
    cancelButton?.addEventListener("click", closeModal);
    document.getElementById("customer-phone")?.addEventListener("input", (event) => {
        event.currentTarget.setCustomValidity("");
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const address = document.getElementById("customer-address").value.trim();
        const items = document.getElementById("customer-order-items").value.trim();
        const notes = document.getElementById("customer-order-notes").value.trim();
        const cartDescription = formatCartItems();
        const orderTotal = getCartTotal();

        if (!customerName || !phone || !address || !items) {
            alert(localizedText("Please enter your name, phone, address, and order items."));
            return;
        }

        const orders = getSavedOrders();
        const newestOrderId = orders.reduce((highest, order) => {
            const idNumber = Number(String(order.id || "").replace("#", ""));
            return Number.isFinite(idNumber) ? Math.max(highest, idNumber) : highest;
        }, 1047);

        const newOrder = {
            id: `#${String(newestOrderId + 1).padStart(4, "0")}`,
            customer: customerName,
            phone,
            address,
            items: cartDescription || items,
            lineItems: cartItems.map((item) => ({ ...item })),
            note: notes,
            date: new Date().toISOString().slice(0, 10),
            status: "Pending",
            total: orderTotal ? `RM ${orderTotal.toFixed(2)}` : "Awaiting confirmation"
        };

        if (!isValidPhoneNumber(phone)) {
            document.getElementById("customer-phone").setCustomValidity(localizedText("Enter a valid Malaysian mobile number, for example 012-3456789."));
            document.getElementById("customer-phone").reportValidity();
            return;
        }

        document.getElementById("customer-phone").setCustomValidity("");
        pendingOrder = newOrder;
        closeModal(false);
        showOrderReview(newOrder);
    });
}

function isValidPhoneNumber(phone) {
    return /^(?:\+?60|0)1\d[\s-]?\d{3,4}[\s-]?\d{4}$/.test(phone);
}

function renderOrderLineItems(order) {
    if (!order.lineItems?.length) {
        return `<li><span>${order.items}</span></li>`;
    }

    return order.lineItems.map((item) => `
        <li>
            <span>${item.quantity} x ${item.name}</span>
            <strong>RM ${(item.price * item.quantity).toFixed(2)}</strong>
        </li>
    `).join("");
}

function showOrderReview(order) {
    const modal = document.getElementById("order-review");
    const details = document.getElementById("order-review-details");

    if (!modal || !details) {
        return;
    }

    details.innerHTML = `
        <div class="receipt-status"><span>?</span><p>Please check your details before sending</p></div>
        <div class="receipt-section"><p class="receipt-label">Customer</p><p><strong>${order.customer}</strong></p><p>${order.phone}</p><p>${order.address}</p></div>
        <div class="receipt-section"><p class="receipt-label">Order</p><ul class="receipt-items">${renderOrderLineItems(order)}</ul><div class="receipt-line receipt-subtotal"><span>Total</span><strong>${order.total}</strong></div></div>
        ${order.note ? `<div class="receipt-section"><p class="receipt-label">Notes</p><p>${order.note}</p></div>` : ""}
    `;
    modal.classList.remove("hidden");
}

function showOrderConfirmation(order) {
    const modal = document.getElementById("order-confirmation");
    const details = document.getElementById("confirmation-details");

    if (!modal || !details) {
        return;
    }

    details.innerHTML = `
        <div class="receipt-status"><span>✓</span><p>Order sent successfully</p></div>
        <div class="receipt-meta"><span>Order number</span><strong>${order.id}</strong><span>Date</span><strong>${order.date}</strong></div>
        <div class="receipt-section">
            <p class="receipt-label">Items</p>
            <ul class="receipt-items">${renderOrderLineItems(order)}</ul>
        </div>
        <div class="receipt-section">
            <p class="receipt-label">Delivery details</p>
            <p><strong>${order.customer}</strong></p>
            <p>${order.phone}</p>
            <p>${order.address}</p>
        </div>
        <div class="receipt-total"><span>Total</span><strong>${order.total}</strong></div>
        <p class="receipt-note">Our team will contact you to confirm delivery.</p>
    `;
    modal.classList.remove("hidden");
}

function initCart() {
    const cartButton = document.getElementById("open-cart");
    const cartModal = document.getElementById("cart-modal");
    const closeButton = document.getElementById("close-cart");
    const continueButton = document.getElementById("continue-shopping");
    const sendButton = document.getElementById("send-cart-order");
    const modalItems = document.getElementById("cart-modal-items");

    if (!cartButton || !cartModal) {
        return;
    }

    const closeCart = () => cartModal.classList.add("hidden");
    const openDetails = () => {
        if (!cartItems.length) {
            alert(localizedText("Your cart is empty. Add a product before sending an order."));
            return;
        }
        closeCart();
        updateCartDisplay();
        document.getElementById("customer-order-modal")?.classList.remove("hidden");
        document.getElementById("customer-name")?.focus();
    };

    cartButton.addEventListener("click", () => {
        updateCartDisplay();
        cartModal.classList.remove("hidden");
    });
    closeButton?.addEventListener("click", closeCart);
    continueButton?.addEventListener("click", closeCart);
    sendButton?.addEventListener("click", openDetails);
    cartModal.addEventListener("click", (event) => {
        if (event.target === cartModal) {
            closeCart();
        }
    });
    modalItems?.addEventListener("input", (event) => {
        if (!event.target.classList.contains("cart-quantity")) {
            return;
        }
        const index = Number(event.target.dataset.cartIndex);
        cartItems[index].quantity = Math.max(1, Number(event.target.value) || 1);
        updateCartDisplay();
    });
    modalItems?.addEventListener("click", (event) => {
        if (!event.target.classList.contains("remove-cart-item")) {
            return;
        }
        cartItems.splice(Number(event.target.dataset.cartIndex), 1);
        updateCartDisplay();
    });
}

function initOrderConfirmation() {
    const reviewModal = document.getElementById("order-review");
    const reviewCloseButton = document.getElementById("close-order-review");
    const editButton = document.getElementById("edit-order-details");
    const confirmButton = document.getElementById("confirm-order");
    const modal = document.getElementById("order-confirmation");
    const closeButton = document.getElementById("close-confirmation");
    const closeConfirmation = () => modal?.classList.add("hidden");
    const closeReview = () => reviewModal?.classList.add("hidden");

    reviewCloseButton?.addEventListener("click", closeReview);
    editButton?.addEventListener("click", () => {
        closeReview();
        document.getElementById("customer-order-modal")?.classList.remove("hidden");
        document.getElementById("customer-name")?.focus();
    });
    confirmButton?.addEventListener("click", () => {
        if (!pendingOrder) {
            return;
        }

        const orders = getSavedOrders();
        orders.unshift(pendingOrder);
        saveOrders(orders);
        cartItems.length = 0;
        updateCartDisplay();
        notifyStaff(`${pendingOrder.customer} ordered: ${pendingOrder.items}. Total: ${pendingOrder.total}. Phone: ${pendingOrder.phone}. Address: ${pendingOrder.address}.`);
        renderOrders();
        renderStaffNotifications();
        closeReview();
        showOrderConfirmation(pendingOrder);
        pendingOrder = undefined;
    });
    reviewModal?.addEventListener("click", (event) => {
        if (event.target === reviewModal) {
            closeReview();
        }
    });

    closeButton?.addEventListener("click", closeConfirmation);
    modal?.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeConfirmation();
        }
    });
}

function initAdminProductForm() {
    const triggerButtons = document.querySelectorAll(".open-product-form");
    const modal = document.getElementById("product-modal");
    const form = document.getElementById("product-form");
    const closeButton = document.getElementById("close-product-modal");
    const cancelButton = document.getElementById("cancel-product-form");

    if (!triggerButtons.length || !modal || !form) {
        return;
    }

    const closeModal = () => {
        modal.classList.add("hidden");
        form.reset();
        document.getElementById("product-edit-index").value = "";
    };

    triggerButtons.forEach((triggerButton) => triggerButton.addEventListener("click", () => {
        form.reset();
        document.getElementById("product-edit-index").value = "";
        document.getElementById("product-category").value = "Vegetables";
        modal.classList.remove("hidden");
    }));

    closeButton?.addEventListener("click", closeModal);
    cancelButton?.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nameInput = document.getElementById("product-name");
        const priceInput = document.getElementById("product-price");
        const categoryInput = document.getElementById("product-category");
        const imageUrlInput = document.getElementById("product-image-url");
        const imageFileInput = document.getElementById("product-image-file");
        const editIndexInput = document.getElementById("product-edit-index");

        const productName = nameInput.value.trim();
        const productPrice = priceInput.value.trim();
        const productCategory = normalizeCategory(categoryInput.value);
        const imageUrl = imageUrlInput.value.trim();
        const selectedFile = imageFileInput.files[0];

        if (!productName || !productPrice) {
            alert("Please add a product name and price.");
            return;
        }

        const productData = {
            name: productName,
            price: productPrice.startsWith("RM") ? productPrice : `RM ${productPrice}`,
            category: productCategory,
            image: imageUrl
        };

        try {
            if (selectedFile) {
                productData.image = await readFileAsDataUrl(selectedFile);
            } else if (!productData.image) {
                productData.image = DEFAULT_PRODUCT_IMAGE;
            }

            const products = getSavedProducts();
            const editIndex = editIndexInput.value;

            if (editIndex !== "") {
                products[Number(editIndex)] = productData;
            } else {
                products.push(productData);
            }

            saveProducts(products);
            renderAdminProducts();
            renderStorefrontProducts();
            closeModal();
            alert(editIndex !== "" ? "Product updated successfully." : "Product was added successfully.");
        } catch (error) {
            console.error(error);
            alert("There was a problem saving the product.");
        }
    });
}

function initOrderForm() {
    const triggerButton = document.getElementById("open-order-form");
    const modal = document.getElementById("order-modal");
    const form = document.getElementById("order-form");
    const closeButton = document.getElementById("close-order-modal");
    const cancelButton = document.getElementById("cancel-order-form");

    if (!triggerButton || !modal || !form) {
        return;
    }

    const closeModal = () => {
        modal.classList.add("hidden");
        form.reset();
    };

    triggerButton.addEventListener("click", () => {
        form.reset();
        modal.classList.remove("hidden");
    });

    closeButton?.addEventListener("click", closeModal);
    cancelButton?.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const customer = document.getElementById("order-customer").value.trim();
        const items = document.getElementById("order-items").value.trim();
        const date = document.getElementById("order-date").value;
        const status = document.getElementById("order-status").value;
        const total = document.getElementById("order-total").value.trim();

        if (!customer || !items || !date || !total) {
            alert("Please complete all order fields.");
            return;
        }

        const orders = getSavedOrders();
        const newId = `#${String((Math.max(0, ...orders.map((order) => Number(order.id.replace("#", "")))) || 1047) + 1).padStart(4, "0")}`;

        orders.unshift({
            id: newId,
            customer,
            items,
            date,
            status,
            total: total.startsWith("RM") ? total : `RM ${total}`
        });

        saveOrders(orders);
        renderOrders();
        closeModal();
        alert("New order saved successfully.");
    });
}

const productSearchInput = document.getElementById("product-search");
const productCategoryFilter = document.getElementById("product-category-filter");
const orderSearchInput = document.getElementById("order-search");
const orderStatusFilter = document.getElementById("order-status-filter");

if (productSearchInput) {
    productSearchInput.addEventListener("input", renderAdminProducts);
}

if (productCategoryFilter) {
    productCategoryFilter.addEventListener("change", renderAdminProducts);
}

if (orderSearchInput) {
    orderSearchInput.addEventListener("input", renderOrders);
}

if (orderStatusFilter) {
    orderStatusFilter.addEventListener("change", renderOrders);
}

console.log("Welcome to JM Farm!");

if (document.querySelector(".open-product-form")) {
    initAdminProductForm();
}

if (document.getElementById("open-order-form")) {
    initOrderForm();
}

if (document.getElementById("customer-order-form")) {
    initCustomerOrderForm();
}

if (document.getElementById("open-cart")) {
    initCart();
    initOrderConfirmation();
    updateCartDisplay();
}

initLanguageSwitch();
initStorefrontControls();
initCustomerAuth();
bindProductQuickOrderButtons();
window.addEventListener("storage", (event) => {
    if (event.key === ORDER_STORAGE_KEY || event.key === STAFF_NOTIFICATION_STORAGE_KEY) {
        renderOrders();
        renderStaffNotifications();
    }
});

renderOrders();
renderAdminProducts();
renderStorefrontProducts();
bindProductQuickOrderButtons();
renderStaffNotifications();