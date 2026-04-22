# FarmConnect v5.0 - Complete Fixed Database Setup

## Overview

`COMPLETE_FIXED_DATABASE.sql` is a **single comprehensive SQL file** that combines all database setup, fixes, and sample data into one complete solution.

**What it includes:**
- ✅ All 10 database tables (properly structured)
- ✅ All required columns (image_url, farmer_id, etc.)
- ✅ All foreign key relationships
- ✅ All indexes and constraints
- ✅ 100+ rows of realistic sample data
- ✅ Paddy types and buying prices
- ✅ No conflicts or missing dependencies

---

## How to Use

### Option 1: Command Line (Recommended)

```bash
# Navigate to backend folder
cd c:\Users\THARINDU\Desktop\new fixed\backend

# Run the complete setup
mysql -u root -p < COMPLETE_FIXED_DATABASE.sql

# Optional: Specify database (if your MySQL uses different credentials)
mysql -u root -pYOURPASSWORD < COMPLETE_FIXED_DATABASE.sql
```

### Option 2: MySQL Workbench

1. Open MySQL Workbench
2. File → Open SQL Script
3. Select `COMPLETE_FIXED_DATABASE.sql`
4. Click ⚡ Execute (or press Ctrl+Shift+Enter)
5. Wait for completion message

### Option 3: Using Node.js

```bash
cd backend
npm install mysql2  # if not already installed

# Create a setup script
node -e "
const mysql = require('mysql2/promise');
const fs = require('fs');

(async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password'
  });
  
  const sql = fs.readFileSync('COMPLETE_FIXED_DATABASE.sql', 'utf8');
  const statements = sql.split(';').filter(s => s.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      await connection.query(statement);
    }
  }
  
  console.log('✅ Database setup complete!');
  await connection.end();
})();
"
```

---

## What Gets Created

### Database: `farmconnect`

| Table | Records | Purpose |
|-------|---------|---------|
| `admins` | 0 | Admin user accounts |
| `farmers` | (auto via script) | Farmer profiles |
| `vehicles` | 10 | Tractors & harvesters available for rent |
| `rice_mills` | 8 | Rice mill businesses |
| `rice_types` | 33 | Rice varieties per mill with prices |
| `rice_marketplace` | 18 | Public rice listings for sale |
| `bookings` | 6 | Vehicle booking records |
| `selling_requests` | 6 | Farmer requests to sell rice to mills |
| `rice_orders` | 4 | Customer orders from marketplace |
| `paddy_types` | 5 | Paddy buying prices (admin-managed) |

---

## Key Fixes Included

### ✅ Image URL Support
All three tables have `image_url` columns (500 char VARCHAR):
- `vehicles.image_url`
- `rice_mills.image_url`
- `rice_marketplace.image_url`

### ✅ Bookings Table
Includes all form fields:
- farmer_id, farmer_name, farmer_ref_id
- vehicle_id, vehicle_title, vehicle_type
- booking_date, session_index, session_label
- address, area_acres, payment_method, total_price

### ✅ Foreign Key Constraints
All relationships properly defined:
- rice_types → rice_mills (CASCADE)
- rice_marketplace → rice_mills, rice_types (CASCADE)
- bookings → farmers, vehicles (SET NULL)
- selling_requests → farmers (SET NULL)
- rice_orders → rice_mills, rice_marketplace (SET NULL)

### ✅ Character Set
All tables use `utf8mb4` for full Unicode support

---

## Sample Data Included

### Vehicles (10 units)
- Tractors: Kubota, Mahindra, Sonalika, TAFE, New Holland
- Harvesters: Combine ZX200, HarvestPro, Claas, John Deere, zumo

### Rice Mills (8 locations)
- Araliya (Polonnaruwa), Nipuna (Matara), Lath (Kurunegala), New Rathna (Gampaha)
- Green Valley (Anuradhapura), Golden Harvest (Ampara), Lanka (Kandy), Paddy Kingdom (Jaffna)

### Rice Types (33 varieties)
- Nadu, Samba, Kiri Samba, Red Rice, Suwandel, Keeri Samba, Raw Rice, White Rice

### Marketplace Listings (18 products)
- Real prices ranging from ₨82-118/kg
- Stock quantities 500-7000 kg
- Delivery times 1-5 days

---

## Verification Output

After running the script, you'll see:
```
✅ FarmConnect v5.0 Database Setup Complete!
✅ Tables: 10
✅ Vehicles: 10
✅ Rice Mills: 8
✅ Rice Types: 33
✅ Marketplace: 18
✅ Bookings: 6
✅ Selling Requests: 6
✅ Rice Orders: 4
✅ Paddy Types: 5
```

---

## How to Verify Success

### Check tables exist:
```sql
SHOW TABLES FROM farmconnect;
```

### Check sample data:
```sql
SELECT COUNT(*) FROM vehicles;           -- Should show 10
SELECT COUNT(*) FROM rice_mills;         -- Should show 8
SELECT COUNT(*) FROM rice_types;         -- Should show 33
SELECT * FROM vehicles LIMIT 5;          -- View sample vehicles
SELECT * FROM bookings LIMIT 3;          -- View sample bookings
```

### Check column structure:
```sql
DESCRIBE vehicles;                       -- Should show image_url column
DESCRIBE bookings;                       -- Should show farmer_id, session_label, etc.
```

---

## Replacing Old Files

If you have old database setup files, you can safely replace them:
- ❌ Delete: `schema.sql`
- ❌ Delete: `COMPLETE_SETUP.sql`
- ❌ Delete: `fix_database.sql`
- ❌ Delete: `fix_tables.sql`
- ❌ Delete: `update_bookings_table.sql`
- ❌ Delete: `add_image_columns.sql`
- ✅ Keep: `COMPLETE_FIXED_DATABASE.sql` (this one file replaces all)
- ✅ Keep: `sample_data.sql` (for reference)

---

## Troubleshooting

### Error: "Database already exists"
- Add `DROP DATABASE IF EXISTS farmconnect;` at the start (✅ Already included!)
- Or manually run: `DROP DATABASE farmconnect;`

### Error: "Access denied for user 'root'"
- Use: `mysql -u root -p` (will prompt for password)
- Or include password: `mysql -u root -pYOUR_PASSWORD < COMPLETE_FIXED_DATABASE.sql`

### Error: "Foreign key constraint fails"
- Make sure tables are created in right order (✅ Already correct!)
- Check mysql version: `SELECT VERSION();`

### Tables created but no data
- Verify the INSERT statements ran without errors
- Check error log: `SHOW ENGINE INNODB STATUS;`

---

## Next Steps

1. ✅ Run the setup script
2. ✅ Verify tables and data
3. ✅ Update backend config to connect to `farmconnect` database
4. ✅ Test API endpoints
5. ✅ Load frontend and test login

---

## Notes

- **Safe to run multiple times** - Starts fresh each time (drops existing database)
- **UTF8 Unicode support** - All text fields support emojis and non-ASCII characters
- **Realistic data** - Sample data matches actual Sri Lankan locations and rice varieties
- **Ready for production** - After verification, safe to commit to version control

---

**Created:** 2025-04-22  
**Version:** 5.0  
**Status:** ✅ Complete & Tested
