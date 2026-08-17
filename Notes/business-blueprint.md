# JM Ali Business Blueprint

## 1. Project goal
JM Ali is a grocery and food supply business serving both households and restaurants. The website should allow customers to browse products, place orders online, and let staff manage products, stock, and prices easily.

## 2. Business model
- Customer types:
  - household customer
  - restaurant / bulk buyer
- Product types:
  - fruits
  - vegetables
  - seafood
  - poultry / meat / wet food
  - shelf items
- Pricing model:
  - prices change daily
  - restaurant bulk pricing may be different from retail
  - admin must be able to update prices quickly

## 3. Core system architecture
The project should grow in layers:

1. Frontend storefront
   - homepage
   - product categories
   - product detail pages
   - cart
   - checkout
   - order tracking

2. Admin dashboard
   - add/edit/delete products
   - update daily prices
   - manage stock
   - review orders
   - change order status
   - manage categories

3. Backend API
   - products API
   - orders API
   - customers API
   - admin authentication API
   - reporting API

4. Database
   - product catalog
   - product prices
   - customer records
   - order records
   - stock tracking
   - admin accounts

5. Mobile app later
   - same backend
   - reuse customer and order logic
   - future app login and notifications

## 4. Database tables to prepare
### products
- id
- name
- category_id
- description
- unit
- stock_quantity
- is_active
- image_url
- created_at

### categories
- id
- name

### product_prices
- id
- product_id
- price
- effective_date
- updated_by_admin
- created_at

### customers
- id
- name
- phone
- address
- customer_type
- created_at

### orders
- id
- customer_id
- total_amount
- status
- order_date
- delivery_note
- payment_status

### order_items
- id
- order_id
- product_id
- quantity
- unit_price
- subtotal

### admins
- id
- name
- email
- password_hash
- role

### inventory_logs
- id
- product_id
- change_type
- quantity
- reason
- created_at

## 5. Customer flow
- customer visits homepage
- browses categories
- sees product cards and prices
- adds products to cart
- enters delivery details
- confirms order
- receives order confirmation
- receives status updates later

## 6. Admin flow
- login to admin dashboard
- view sales summary
- add new product
- adjust price for the day
- view all pending and paid orders
- update order progress
- manage inventory
- remove or hide products

## 7. Recommended first hosting stage
The Yeahhost plan is suitable for a first launch because it includes:
- MySQL database support
- SSL
- cPanel
- firewall / security
- email accounts
- storage and bandwidth

This is a good starting point for a real business website.

## 8. Upgrade path
When the business grows, move to a stronger stack:
- VPS or cloud hosting
- dedicated backend server
- better database performance
- API-first architecture
- app-ready backend

## 9. Suggested build order
1. finish storefront layout
2. build product management in admin
3. build customer checkout flow
4. connect real database
5. add order statuses
6. add stock and pricing history
7. build app later using the same backend

## 10. Important note
This project is currently a frontend prototype. It is a strong base for future development, but to become a real business system, it must eventually move from browser localStorage to a real database and backend API.
