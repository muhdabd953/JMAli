# Account Email Setup

Password reset links are sent by PHP's `mail()` function. Configure the PHP host with:

- `JMALI_BASE_URL`: the public base URL that serves `index.html`, for example `https://shop.example.com`.
- `JMALI_MAIL_FROM`: a verified sender address on that domain, for example `noreply@shop.example.com`.

The host's PHP mail transport must also be configured to deliver outgoing mail. The auth endpoint creates the reset-token table automatically. Reset links are one-time use and expire after one hour; only a SHA-256 hash of each token is stored.