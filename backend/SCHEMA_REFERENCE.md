# FarmConnect Database Schema Reference

## Quick Start

To set up the entire database in one command:
```bash
mysql -u root -p < COMPLETE_FIXED_DATABASE.sql
```

---

## Database: `farmconnect`

### 1. ADMINS
Admin user accounts for system administrators

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| id | INT | PK | Auto-increment |
| username | VARCHAR(50) | UQ | Unique username |
| password | VARCHAR(255) | | Hashed password |
| full_name | VARCHAR(100) | | Full name |
| email | VARCHAR(100) | UQ | Unique email |
| role | VARCHAR(20) | | Default: 'admin' |
| status | VARCHAR(20) | | Default: 'active' |
| created_at | TIMESTAMP | | Auto |

---

### 2. FARMERS
Farmer profiles who rent vehicles and sell rice

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| id | INT | PK | Auto-increment |
| farmer_id | VARCHAR(30) | UQ | Like FRM-2026-0001 |
| name | VARCHAR(100) | | Farmer's name |
| email | VARCHAR(100) | UQ | Unique email |
| mobile | VARCHAR(20) | | Phone number |
| nic | VARCHAR(20) | | National ID |
| address | TEXT | | Physical address |
| land_number | VARCHAR(50) | | Land reference |
| password | VARCHAR(255) | | Hashed password |
| created_at | TIMESTAMP | | Auto |

---

### 3. VEHICLES
Tractors and harvesters available for rent

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| id | INT | PK | Auto-increment |
| vehicle_number | VARCHAR(50) | UQ | Like WP-TRC-1001 |
| vehicle_type | VARCHAR(50) | | 'Tractor' or 'Harvester' |
| model | VARCHAR(100) | | E.g. "Kubota M7040" |
| capacity | INT | | Hectares/day capacity |
| status | VARCHAR(20) | | 'Available', 'Booked', 'Maintenance' |
| owner_name | VARCHAR(100) | | Owner's name |
| owner_mobile | VARCHAR(20) | | Owner's phone |
| reg_number | VARCHAR(50) | | Registration number |
| rating | FLOAT | | 0-5 stars |
| reviews | INT | | Total reviews count |
| location | VARCHAR(100) | | District/area |
| price_per_acre | DECIMAL(10,2) | | Rental price (₨) |
| image_url | VARCHAR(500) | | Upload path /uploads/vehicles/... |
| created_at | TIMESTAMP | | Auto |

**Sample:** 10 vehicles (5 tractors, 5 harvesters)

---

### 4. RICE MILLS
Rice mill businesses that buy paddy and sell rice

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| id | INT | PK | Auto-increment |
| mill_name | VARCHAR(100) | | Mill display name |
| location | VARCHAR(100) | | District name |
| address | VARCHAR(255) | | Full address |
| contact_number | VARCHAR(20) | | Phone |
| email | VARCHAR(100) | | Email |
| description | TEXT | | About the mill |
| image_url | VARCHAR(500) | | Logo/image path |
| rating | FLOAT | | 0-5 stars |
| status | VARCHAR(20) | | 'active', 'inactive' |
| created_at | TIMESTAMP | | Auto |

**Sample:** 8 mills (Araliya, Nipuna, Lath, New Rathna, Green Valley, Golden Harvest, Lanka, Paddy Kingdom)

---

### 5. RICE TYPES
Rice varieties available at each mill

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| id | INT | PK | Auto-increment |
| mill_id | INT | FK | Links to rice_mills(id) |
| type_name | VARCHAR(50) | | 'Nadu', 'Samba', 'Kiri Samba', etc. |
| price_per_kg | DECIMAL(10,2) | | Wholesale price (₨) |
| stock_kg | DECIMAL(10,2) | | Available stock |
| description | TEXT | | Type description |
| status | VARCHAR(20) | | 'active', 'inactive' |
| created_at | TIMESTAMP | | Auto |

**Sample:** 33 rice varieties (3-4 types per mill)

---

### 6. RICE MARKETPLACE
Public rice listings for online purchase

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| id | INT | PK | Auto-increment |
| mill_id | INT | FK | Links to rice_mills(id) |
| rice_type_id | INT | FK | Links to rice_types(id) |
| title | VARCHAR(150) | | Product title |
| price_per_kg | DECIMAL(10,2) | | Retail price (₨) |
| available_kg | DECIMAL(10,2) | | Stock available |
| min_order_kg | DECIMAL(10,2) | | Minimum order (default: 1kg) |
| max_order_kg | DECIMAL(10,2) | | Maximum order (default: 1000kg) |
| description | TEXT | | Product description |
| image_url | VARCHAR(500) | | Product image path |
| status | VARCHAR(20) | | 'active', 'inactive' |
| delivery_time | VARCHAR(50) | | E.g. "1-2 days" |
| created_at | TIMESTAMP | | Auto |

**Sample:** 18 marketplace listings

---

### 7. BOOKINGS
Vehicle rental bookings by farmers

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| id | INT | PK | Auto-increment |
| vehicle_id | INT | FK | Links to vehicles(id) |
| vehicle_title | VARCHAR(100) | | E.g. "Kubota M7040" |
| vehicle_type | VARCHAR(50) | | 'Tractor' or 'Harvester' |
| price_per_acre | DECIMAL(10,2) | | Rental rate |
| farmer_id | INT | FK | Links to farmers(id) |
| farmer_name | VARCHAR(100) | | Farmer's name |
| farmer_ref_id | VARCHAR(30) | | Farmer ID |
| session_index | INT | | 0=6-9am, 1=9-12am, etc. |
| session_label | VARCHAR(20) | | Display label "6-9am" |
| booking_date | DATE | | Date of booking |
| address | VARCHAR(255) | | Service address |
| area_acres | DECIMAL(10,2) | | Field size |
| payment_method | VARCHAR(20) | | 'cash' or 'online' |
| total_price | DECIMAL(12,2) | | Total cost (₨) |
| status | VARCHAR(20) | | 'pending','approved','completed','rejected' |
| created_at | TIMESTAMP | | Auto |

**Sample:** 6 bookings

---

### 8. SELLING_REQUESTS
Farmer requests to sell rice to mills

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| id | INT | PK | Auto-increment |
| farmer_id | INT | FK | Links to farmers(id) |
| mill_id | INT | | Target mill (no FK) |
| rice_type | VARCHAR(50) | | Rice variety name |
| stock_kg | DECIMAL(10,2) | | Amount offered (kg) |
| price_per_kg | DECIMAL(10,2) | | Offered price (₨) |
| total_price | DECIMAL(12,2) | | Total value (₨) |
| status | ENUM | | 'PENDING', 'APPROVED', 'REJECTED' |
| created_at | TIMESTAMP | | Auto |

**Sample:** 6 selling requests

---

### 9. RICE_ORDERS
Customer orders from rice marketplace

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| id | INT | PK | Auto-increment |
| customer_name | VARCHAR(100) | | Order customer |
| mobile | VARCHAR(20) | | Contact number |
| address | TEXT | | Delivery address |
| rice_type | VARCHAR(50) | | Type ordered |
| mill_id | INT | FK | Source mill |
| mill_name | VARCHAR(100) | | Mill name |
| marketplace_id | INT | FK | Marketplace listing |
| weight_kg | DECIMAL(10,2) | | Weight ordered |
| quantity | INT | | No. of units |
| total_price | DECIMAL(12,2) | | Total (₨) |
| payment_method | VARCHAR(50) | | 'cod','visa','mastercard' |
| delivery_option | VARCHAR(20) | | 'normal', 'fast' |
| status | VARCHAR(20) | | 'pending', 'completed' |
| created_at | TIMESTAMP | | Auto |

**Sample:** 4 orders

---

### 10. PADDY_TYPES
Paddy buying prices (admin-managed)

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| id | INT | PK | Auto-increment |
| type_name | VARCHAR(100) | | 'Nadu', 'Samba', etc. |
| price_per_kg | DECIMAL(10,2) | | Buying price (₨) |
| description | TEXT | | Description |
| status | VARCHAR(20) | | 'active', 'inactive' |
| created_at | TIMESTAMP | | Auto |
| updated_at | TIMESTAMP | | Auto-update |

**Sample:** 5 paddy types

---

## Foreign Key Relationships

```
rice_types    → rice_mills      (many-to-one)
rice_marketplace → rice_mills       (many-to-one)
rice_marketplace → rice_types       (many-to-one)
bookings      → farmers         (many-to-one)
bookings      → vehicles        (many-to-one)
selling_requests → farmers      (many-to-one)
rice_orders   → rice_mills      (many-to-one)
rice_orders   → rice_marketplace (many-to-one)
```

---

## Sample Data Statistics

| Entity | Count |
|--------|-------|
| Tractors | 5 |
| Harvesters | 5 |
| Rice Mills | 8 |
| Rice Varieties | 33 |
| Marketplace Listings | 18 |
| Bookings | 6 |
| Selling Requests | 6 |
| Rice Orders | 4 |
| Paddy Types | 5 |

---

## Character Encoding

All tables use:
- **CHARACTER SET:** `utf8mb4`
- **COLLATION:** `utf8mb4_unicode_ci`
- Supports emojis and all Unicode characters

---

## Engine & Performance

All tables use:
- **ENGINE:** `InnoDB`
- **Default Charset:** `utf8mb4`
- Foreign keys enabled
- ACID compliance

---

## Key Constraints

| Table | Constraint | Details |
|-------|-----------|---------|
| admins | UQ username | Unique usernames |
| admins | UQ email | Unique emails |
| farmers | UQ farmer_id | Unique farmer IDs |
| farmers | UQ email | Unique emails |
| vehicles | UQ vehicle_number | Unique vehicle numbers |
| rice_types | FK mill | Cascade on delete |
| rice_marketplace | FK mill, rice_type | Cascade on delete |
| bookings | FK farmer, vehicle | Set NULL on delete |
| selling_requests | FK farmer | Set NULL on delete |
| rice_orders | FK mill, marketplace | Set NULL on delete |

---

## Indexes (Implicit from Primary Keys)

- admins(id), admins(username), admins(email)
- farmers(id), farmers(farmer_id), farmers(email)
- vehicles(id), vehicles(vehicle_number)
- rice_mills(id)
- rice_types(id, mill_id)
- rice_marketplace(id, mill_id, rice_type_id)
- bookings(id, farmer_id, vehicle_id)
- selling_requests(id, farmer_id)
- rice_orders(id, mill_id, marketplace_id)
- paddy_types(id)

---

## Next Steps

1. ✅ Import this database
2. ✅ Verify all tables and data
3. ✅ Configure backend `.env` to use `farmconnect` database
4. ✅ Test API endpoints
5. ✅ Start frontend application

**Status:** ✅ Complete & Production Ready
