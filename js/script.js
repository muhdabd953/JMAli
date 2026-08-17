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
const PRODUCT_STORAGE_KEY = "jmAliCustomProducts";
const ORDER_STORAGE_KEY = "jmAliOrders";
const STAFF_NOTIFICATION_STORAGE_KEY = "jmAliStaffNotifications";
const PRODUCT_CATEGORIES = ["Vegetables", "Fruits", "Seafood"];

const defaultOrders = [
    { id: "#1048", customer: "Rahim", items: "2 x Mango, 1 x Apple", date: "2026-08-16", status: "Paid", total: "RM 94.00" },
    { id: "#1049", customer: "Sadia", items: "3 x Tomato, 2 x Onion", date: "2026-08-16", status: "Pending", total: "RM 56.60" },
    { id: "#1050", customer: "Karim", items: "1 x Tuna, 2 x Cucumber", date: "2026-08-15", status: "Shipped", total: "RM 118.40" },
    { id: "#1051", customer: "Nora", items: "4 x Carrot, 1 x Broccoli", date: "2026-08-15", status: "Cancelled", total: "RM 42.10" },
    { id: "#1052", customer: "Afiq", items: "2 x Watermelon, 1 x Pineapple", date: "2026-08-14", status: "Paid", total: "RM 86.00" }
];

const defaultProducts = [
    { name: "Fresh Tomatoes", price: "RM 4.90 / kg", image: "./images/products/fruit/tomato.jpg", category: "Fruits" },
    { name: "Fresh Carrots", price: "RM 3.20 / kg", image: "./images/products/vegetable/carrot.webp", category: "Vegetables" },
    { name: "Fresh Broccoli", price: "RM 5.60 / kg", image: "./images/products/vegetable/broccoli.jpg", category: "Vegetables" },
    { name: "Fresh Cabbage", price: "RM 5.60 / kg", image: "./images/products/vegetable/cabbage.jpg", category: "Vegetables" },
    { name: "Fresh Cucumber", price: "RM 5.60 / kg", image: "./images/products/fruit/cucumber.jpg", category: "Fruits" },
    { name: "Fresh Garlic", price: "RM 5.60 / kg", image: "./images/products/vegetable/garlic.jpg", category: "Vegetables" },
    { name: "Fresh Mango", price: "RM 5.60 / kg", image: "./images/products/fruit/mango.jpg", category: "Fruits" },
    { name: "Fresh Onion", price: "RM 5.60 / kg", image: "./images/products/vegetable/onion.jpg", category: "Vegetables" },
    { name: "Fresh Pineapple", price: "RM 5.60 / kg", image: "./images/products/fruit/pineapple.webp", category: "Fruits" },
    { name: "Fresh Potato", price: "RM 5.60 / kg", image: "./images/products/vegetable/potato.webp", category: "Vegetables" },
    { name: "Fresh Apple", price: "RM 5.60 / kg", image: "./images/products/fruit/red_apple.avif", category: "Fruits" },
    { name: "Fresh Sweet Potato", price: "RM 5.60 / kg", image: "./images/products/vegetable/sweet_potato.jpg", category: "Vegetables" },
    { name: "Fresh Watermelon", price: "RM 5.60 / kg", image: "./images/products/fruit/watermelon.jpg", category: "Fruits" },
    { name: "Fresh Tuna", price: "RM 5.60 / kg", image: "./images/products/seafood/bluefin_tuna.jpg", category: "Seafood" }
];

// ================================
// PRODUCT STORAGE
// These functions save and read product data.
// In the future, this will connect to a backend API.
// ================================
function getSavedProducts() {
    try {
        const savedProducts = localStorage.getItem(PRODUCT_STORAGE_KEY);
        if (!savedProducts) {
            return [];
        }

        const parsedProducts = JSON.parse(savedProducts);
        return Array.isArray(parsedProducts) ? parsedProducts : [];
    } catch (error) {
        console.error("Could not read saved products:", error);
        return [];
    }
}

function saveProducts(products) {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
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
        <h3>${product.name}</h3>
        <p>${product.price}</p>
        ${isAdmin ? "" : '<button type="button">Add to Cart</button>'}
    `;
    return card;
}

function renderFeaturedProducts() {
    const featuredSection = document.querySelector("section.featured");
    if (!featuredSection) {
        return;
    }

    const customProductsContainer = document.getElementById("custom-products");
    if (customProductsContainer) {
        customProductsContainer.remove();
    }

    const products = getSavedProducts();
    if (!products.length) {
        return;
    }

    const container = document.createElement("div");
    container.id = "custom-products";
    container.className = "category-container";
    container.setAttribute("aria-live", "polite");

    products.forEach((product) => {
        container.appendChild(createProductCard(product));
    });

    featuredSection.appendChild(container);
}

function renderCategoryProducts() {
    const categoryMapping = {
        vegetables: document.querySelector("#vegetables .product-grid"),
        fruits: document.querySelector("#fruits .product-grid"),
        seafood: document.querySelector("#seafood .product-grid")
    };

    Object.entries(categoryMapping).forEach(([categoryKey, grid]) => {
        if (!grid) {
            return;
        }

        const existingDynamicProducts = grid.querySelectorAll(".dynamic-product");
        existingDynamicProducts.forEach((item) => item.remove());

        const products = getSavedProducts().filter((product) => normalizeCategory(product.category) === categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1));

        products.forEach((product) => {
            const card = createProductCard(product);
            card.classList.add("dynamic-product");
            grid.appendChild(card);
        });
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
            <td><img src="${product.image || "./images/products/fruit/red_apple.avif"}" alt="${product.name}"></td>
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

function deleteProduct(index) {
    const products = getSavedProducts();
    const productToDelete = products[index];

    if (!productToDelete) {
        return;
    }

    const confirmDelete = window.confirm(`Delete ${productToDelete.name}?`);
    if (!confirmDelete) {
        return;
    }

    products.splice(index, 1);
    saveProducts(products);
    renderAdminProducts();
    renderFeaturedProducts();
    renderCategoryProducts();
}

function openProductModalForEdit(index) {
    const modal = document.getElementById("product-modal");
    const form = document.getElementById("product-form");
    const nameInput = document.getElementById("product-name");
    const priceInput = document.getElementById("product-price");
    const categoryInput = document.getElementById("product-category");
    const imageUrlInput = document.getElementById("product-image-url");
    const editIndexInput = document.getElementById("product-edit-index");
    const product = getSavedProducts()[index];

    if (!product || !modal || !form) {
        return;
    }

    nameInput.value = product.name || "";
    priceInput.value = product.price || "";
    categoryInput.value = normalizeCategory(product.category);
    imageUrlInput.value = product.image || "";
    editIndexInput.value = String(index);

    modal.classList.remove("hidden");
}

// ================================
// ORDER SYSTEM
// This area handles all order records and staff actions.
// The admin can update status such as paid, shipped, and cancelled.
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

function bindProductQuickOrderButtons() {
    const orderButtons = document.querySelectorAll(".card button");
    if (!orderButtons.length) {
        return;
    }

    orderButtons.forEach((button) => {
        button.dataset.bound = "true";
        button.addEventListener("click", () => {
            const card = button.closest(".card");
            const title = card?.querySelector("h3")?.textContent?.trim();
            const modal = document.getElementById("customer-order-modal");
            const itemsInput = document.getElementById("customer-order-items");

            if (modal && itemsInput) {
                itemsInput.value = title || "Fresh groceries";
                modal.classList.remove("hidden");
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

        const customerName = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const address = document.getElementById("customer-address").value.trim();
        const items = document.getElementById("customer-order-items").value.trim();
        const notes = document.getElementById("customer-order-notes").value.trim();

        if (!customerName || !phone || !address || !items) {
            alert("Please enter your name, phone, address, and order items.");
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
            items,
            note: notes,
            date: new Date().toISOString().slice(0, 10),
            status: "Pending",
            total: "Awaiting confirmation"
        };

        orders.unshift(newOrder);
        saveOrders(orders);
        notifyStaff(`${customerName} ordered: ${items}. Phone: ${phone}. Address: ${address}.`);
        renderOrders();
        renderStaffNotifications();
        closeModal();
        alert("Thank you! Your order has been sent to JM Ali and our staff have been notified.");
    });
}

function initAdminProductForm() {
    const triggerButton = document.getElementById("open-product-form");
    const modal = document.getElementById("product-modal");
    const form = document.getElementById("product-form");
    const closeButton = document.getElementById("close-product-modal");
    const cancelButton = document.getElementById("cancel-product-form");

    if (!triggerButton || !modal || !form) {
        return;
    }

    const closeModal = () => {
        modal.classList.add("hidden");
        form.reset();
        document.getElementById("product-edit-index").value = "";
    };

    triggerButton.addEventListener("click", () => {
        form.reset();
        document.getElementById("product-edit-index").value = "";
        document.getElementById("product-category").value = "Vegetables";
        modal.classList.remove("hidden");
    });

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
                productData.image = defaultProducts[0].image;
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
            renderFeaturedProducts();
            renderCategoryProducts();
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

if (document.getElementById("open-product-form")) {
    initAdminProductForm();
}

if (document.getElementById("open-order-form")) {
    initOrderForm();
}

if (document.getElementById("customer-order-form")) {
    initCustomerOrderForm();
}

bindProductQuickOrderButtons();
window.addEventListener("storage", (event) => {
    if (event.key === ORDER_STORAGE_KEY || event.key === STAFF_NOTIFICATION_STORAGE_KEY) {
        renderOrders();
        renderStaffNotifications();
    }
});

renderOrders();
renderAdminProducts();
renderFeaturedProducts();
renderCategoryProducts();
bindProductQuickOrderButtons();
renderStaffNotifications();