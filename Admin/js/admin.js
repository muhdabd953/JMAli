const ADMIN_AUTH_URL = "../api/admin-auth.php";

async function requestAdminAuth(payload) {
    const response = await fetch(ADMIN_AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin"
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Admin sign-in failed.");
    }
    return result;
}

function initAdminLogin() {
    const form = document.getElementById("admin-login-form");
    if (!form) {
        return;
    }

    const status = document.getElementById("admin-login-status");
    const submitButton = form.querySelector("button[type='submit']");
    if (new URLSearchParams(window.location.search).has("unavailable")) {
        status.textContent = "Admin sign-in is unavailable. Start MySQL and check the database settings in api/db.php.";
        status.classList.add("error");
    }
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.textContent = "";
        status.classList.remove("error");
        submitButton.disabled = true;
        try {
            const data = new FormData(form);
            await requestAdminAuth({
                action: "login",
                email: data.get("email"),
                password: data.get("password")
            });
            window.location.replace("./index.html");
        } catch (error) {
            status.textContent = error.message;
            status.classList.add("error");
            submitButton.disabled = false;
        }
    });
}

async function protectAdminPage() {
    document.body.classList.add("auth-checking");
    try {
        const response = await fetch(ADMIN_AUTH_URL, { credentials: "same-origin", cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !result.user) {
            window.location.replace("./login.html");
            return;
        }

        const signOut = document.createElement("button");
        signOut.className = "nav-item signout-btn";
        signOut.type = "button";
        signOut.textContent = "Log out";
        signOut.addEventListener("click", async () => {
            signOut.disabled = true;
            try {
                await requestAdminAuth({ action: "logout" });
            } finally {
                window.location.replace("./login.html");
            }
        });
        document.querySelector(".nav-menu")?.after(signOut);
        document.body.classList.remove("auth-checking");
    } catch (error) {
        window.location.replace("./login.html?unavailable=1");
    }
}

if (document.body.dataset.page === "login") {
    initAdminLogin();
} else {
    protectAdminPage();
}