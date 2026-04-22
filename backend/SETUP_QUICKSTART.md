# Quick Database Setup - Step by Step

## What You're Getting

✅ **1 Complete Database File** (`COMPLETE_FIXED_DATABASE.sql`)
- All 10 tables with proper structure
- All image_url columns
- All foreign keys and constraints
- 100+ rows of sample data ready to use
- Paddy types and buying prices

✅ **3 Documentation Files**
- `DATABASE_SETUP_GUIDE.md` - Detailed instructions
- `SCHEMA_REFERENCE.md` - Database schema overview
- `SETUP_QUICKSTART.md` - This file

---

## How to Run (3 Methods)

### ⚡ METHOD 1: Command Line (Fastest)

**Step 1:** Open Command Prompt/PowerShell

**Step 2:** Navigate to backend folder
```bash
cd c:\Users\THARINDU\Desktop\new fixed\backend
```

**Step 3:** Run the setup
```bash
mysql -u root -p < COMPLETE_FIXED_DATABASE.sql
```

**Step 4:** Enter your MySQL password when prompted

**Expected Output:**
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

### 🖱️ METHOD 2: MySQL Workbench (GUI)

**Step 1:** Open MySQL Workbench

**Step 2:** File → Open SQL Script

**Step 3:** Select: `COMPLETE_FIXED_DATABASE.sql`

**Step 4:** Click ⚡ Execute (or press **Ctrl+Shift+Enter**)

**Step 5:** Wait for "Query executed successfully" message

---

### 🟢 METHOD 3: Node.js (From Backend)

**Step 1:** Navigate to backend
```bash
cd c:\Users\THARINDU\Desktop\new fixed\backend
```

**Step 2:** Create a setup script
```bash
cat > setup-db.js << 'EOF'
const mysql = require('mysql2/promise');
const fs = require('fs');

(async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password_here'  // ← Change this
  });
  
  const sql = fs.readFileSync('COMPLETE_FIXED_DATABASE.sql', 'utf8');
  const statements = sql.split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));
  
  console.log(`Running ${statements.length} queries...`);
  
  for (let i = 0; i < statements.length; i++) {
    try {
      await connection.query(statements[i]);
      process.stdout.write(`\rProgress: ${i+1}/${statements.length}`);
    } catch (e) {
      console.error(`Error in query ${i+1}:`, e.message);
    }
  }
  
  console.log('\n✅ Database setup complete!');
  await connection.end();
})();
EOF
```

**Step 3:** Run it
```bash
node setup-db.js
```

---

## Verify It Worked

After running the setup, verify everything is correct:

### Check 1: List Tables
```bash
mysql -u root -p -e "SHOW TABLES FROM farmconnect;"
```

Should show all 10 tables:
- admins
- farmers
- vehicles
- rice_mills
- rice_types
- rice_marketplace
- bookings
- selling_requests
- rice_orders
- paddy_types

### Check 2: Count Records
```bash
mysql -u root -p -e "
  SELECT 'vehicles' as table_name, COUNT(*) as count FROM farmconnect.vehicles
  UNION ALL
  SELECT 'rice_mills', COUNT(*) FROM farmconnect.rice_mills
  UNION ALL
  SELECT 'rice_types', COUNT(*) FROM farmconnect.rice_types
  UNION ALL
  SELECT 'rice_marketplace', COUNT(*) FROM farmconnect.rice_marketplace
  UNION ALL
  SELECT 'bookings', COUNT(*) FROM farmconnect.bookings
  UNION ALL
  SELECT 'selling_requests', COUNT(*) FROM farmconnect.selling_requests
  UNION ALL
  SELECT 'rice_orders', COUNT(*) FROM farmconnect.rice_orders
  UNION ALL
  SELECT 'paddy_types', COUNT(*) FROM farmconnect.paddy_types;
"
```

Should show:
```
vehicles              | 10
rice_mills            | 8
rice_types            | 33
rice_marketplace      | 18
bookings              | 6
selling_requests      | 6
rice_orders           | 4
paddy_types           | 5
```

### Check 3: View Sample Data
```bash
# View vehicles
mysql -u root -p -e "SELECT id, vehicle_number, vehicle_type, model FROM farmconnect.vehicles LIMIT 5;"

# View rice mills
mysql -u root -p -e "SELECT id, mill_name, location, rating FROM farmconnect.rice_mills LIMIT 5;"

# View bookings
mysql -u root -p -e "SELECT id, farmer_name, vehicle_title, booking_date, status FROM farmconnect.bookings LIMIT 3;"
```

---

## If Something Goes Wrong

### Error: "Access denied for user 'root'"
**Solution:** Specify your password
```bash
mysql -u root -pYOUR_PASSWORD < COMPLETE_FIXED_DATABASE.sql
```
(No space between `-p` and password)

### Error: "Unknown database 'farmconnect'"
**Solution:** This is normal! The script creates it. Just re-run the setup.

### Error: "Duplicate entry for key"
**Solution:** The database already exists. Drop it first:
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS farmconnect;"
mysql -u root -p < COMPLETE_FIXED_DATABASE.sql
```

### Error: "Cannot add or update a child row"
**Solution:** Foreign key error. This shouldn't happen with the complete file. Try:
```bash
mysql -u root -p -e "DROP DATABASE farmconnect;"
mysql -u root -p < COMPLETE_FIXED_DATABASE.sql
```

### Tables created but no data
**Solution:** Check for errors in the output. The INSERT statements might have failed silently.
```bash
mysql -u root -p -e "SELECT COUNT(*) FROM farmconnect.vehicles;"
```

If it shows 0, the INSERTs didn't run. Check the `.sql` file for syntax errors.

---

## Update Backend Config

After database is created, update your backend to connect to it:

### File: `backend/config/db.js`

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password',  // ← Update this
  database: 'farmconnect',           // ← Use 'farmconnect'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

---

## Next Steps

1. ✅ Run `COMPLETE_FIXED_DATABASE.sql`
2. ✅ Verify all tables and data
3. ✅ Update `backend/config/db.js`
4. ✅ Start backend server: `npm start`
5. ✅ Start frontend: `npm start` (in frontend folder)
6. ✅ Test login with any farmer ID or admin account

---

## Farmer Credentials (if created)

You can create login credentials using the backend scripts:

```bash
cd backend

# Create an admin
node scripts/createAdmin.js

# Create sample farmers
node scripts/createFarmers.js
```

---

## Summary

| File | Purpose | Next Step |
|------|---------|-----------|
| `COMPLETE_FIXED_DATABASE.sql` | Run this first | Execute it |
| `DATABASE_SETUP_GUIDE.md` | Detailed instructions | Read for more info |
| `SCHEMA_REFERENCE.md` | Database structure | Reference while coding |
| `setup-db.js` | Node.js runner | Optional alternative |

---

## Success Checklist

- [ ] `COMPLETE_FIXED_DATABASE.sql` file exists
- [ ] Ran the setup command successfully
- [ ] All 10 tables created
- [ ] Sample data loaded (100+ records)
- [ ] Verified counts match expected values
- [ ] `backend/config/db.js` updated to use 'farmconnect'
- [ ] Backend server connects without errors
- [ ] Frontend loads successfully
- [ ] Can see sample vehicles, mills, user listings

---

## Original Files (Can Delete)

These files are now replaced by `COMPLETE_FIXED_DATABASE.sql`:
- ❌ schema.sql
- ❌ COMPLETE_SETUP.sql
- ❌ fix_database.sql
- ❌ fix_tables.sql
- ❌ update_bookings_table.sql
- ❌ add_image_columns.sql
- ❌ add_paddy_types_table.sql
- ✅ sample_data.sql (keep for reference)

---

**Created:** 2025-04-22  
**Version:** v5.0  
**Status:** ✅ Ready to Use
