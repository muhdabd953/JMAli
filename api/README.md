# Account Email Setup

## Admin sign-in setup

Admin accounts are separate from customer accounts. Create the first owner account from the project directory with PowerShell:

```powershell
.\api\admin-account.ps1 -Action create -Email owner@example.com -Name "JM Ali Owner"
```

Enter a password of at least 12 characters at the hidden prompt. The command creates the `admins` table if needed and refuses to create a second account. Then open `Admin/login.html` through the PHP web server and sign in with that email and password. Do not open the HTML file directly with `file://`; PHP and the MySQL database must be running.

The initial account is CLI-only so a visitor cannot claim the first administrator account through a public setup form. Keep the PHP CLI and web server connected to the same database configured in `db.php`.

To replace an admin password, run `.\api\admin-account.ps1 -Action reset -Email owner@example.com` and enter the new password at the hidden prompt.

The admin login uses its own session and `admins` table. It does not grant admin access to a customer account. The rest of the dashboard still contains prototype orders, customers, inventory, and report figures; only the existing storefront product listing currently reads from the products database API.

## Customer account email setup

Password reset links are sent by PHP's `mail()` function. Configure the PHP host with:

- `JMALI_BASE_URL`: the public base URL that serves `index.html`, for example `https://shop.example.com`.
- `JMALI_MAIL_FROM`: a verified sender address on that domain, for example `noreply@shop.example.com`.

The host's PHP mail transport must also be configured to deliver outgoing mail. The auth endpoint creates the reset-token table automatically. Reset links are one-time use and expire after one hour; only a SHA-256 hash of each token is stored.