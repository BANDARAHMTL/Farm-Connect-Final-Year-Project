# 🌾 FarmConnect v4.0

Full-stack agricultural platform — React + Node.js/Express + MySQL.

---

## 🚀 Quick Setup

### Step 1 — Database (fresh install)
```powershell
mysql -u root -p < "C:\Users\THARINDU\Desktop\final\farmconnect\backend\schema.sql"
mysql -u root -p farmconnect < "C:\Users\THARINDU\Desktop\final\farmconnect\backend\sample_data.sql"
```

### Step 1b — Already have a database? Add image columns instead:
```powershell
mysql -u root -p farmconnect < "C:\Users\THARINDU\Desktop\final\farmconnect\backend\add_image_columns.sql"
```

### Step 2 — Backend
```powershell
cd "C:\Users\THARINDU\Desktop\final\farmconnect\backend"
npm install
node scripts/createAdmin.js admin admin123 "Admin User" admin@farmconnect.com
node scripts/createFarmers.js
npm start
```

### Step 3 — Frontend (new terminal window)
```powershell
cd "C:\Users\THARINDU\Desktop\final\farmconnect\frontend"
npm install
npm start
```

---

## 🔑 Login Credentials
| Role   | URL                              | Username / Email        | Password   |
|--------|----------------------------------|-------------------------|------------|
| Admin  | http://localhost:3000/login      | admin                   | admin123   |
| Farmer | http://localhost:3000 → Sign In  | kamal@gmail.com         | farmer123  |

---

## 🖼️ Image Upload — How It Works

### Where images are stored
```
backend/
  uploads/
    vehicles/      ← tractor and harvester photos
    ricemills/     ← rice mill building photos
    marketplace/   ← rice listing photos
```

### How to upload images from Admin Dashboard

1. Go to **http://localhost:3000/login** → login as admin
2. Navigate to **🚜 Vehicles** or **🏭 Rice Mills** in the sidebar
3. Click **+ Add Vehicle** or **+ Add Rice Mill**
4. In the modal, click the image upload zone or drag & drop your image
5. Browse to your image file — example paths:
   - Tractor:    `C:\Users\THARINDU\Desktop\final\farmconnect\image\tractor\tractor 1.webp`
   - Harvester:  `C:\Users\THARINDU\Desktop\final\farmconnect\image\harvester\havester 1.jpg`
   - Rice Mill:  `C:\Users\THARINDU\Desktop\final\farmconnect\image\ricemill\araliya mill.webp`
6. Fill in the other fields and click **✅ Add Vehicle** / **✅ Add Rice Mill**
7. Image is uploaded to `backend/uploads/vehicles/` or `backend/uploads/ricemills/`
8. The URL `/uploads/vehicles/filename.jpg` is saved in the `image_url` column in MySQL

### Accepted formats
- JPG / JPEG
- PNG
- WEBP ✅ (your tractor and rice mill images)
- Max size: 10 MB per image

### Image is served at
```
http://localhost:8080/uploads/vehicles/tractor_1_1234567890.webp
http://localhost:8080/uploads/ricemills/araliya_mill_1234567890.webp
```

---

## 📊 Database Tables with image_url

| Table             | image_url column | What it stores                    |
|-------------------|------------------|-----------------------------------|
| `vehicles`        | `image_url`      | `/uploads/vehicles/filename.jpg`  |
| `rice_mills`      | `image_url`      | `/uploads/ricemills/filename.webp`|
| `rice_marketplace`| `image_url`      | `/uploads/marketplace/filename.jpg`|

---

## 🗂️ Project Structure

```
farmconnect/
├── backend/
│   ├── controllers/
│   │   ├── vehicle.controller.js      ← handles image_url on save/update
│   │   ├── riceMill.controller.js     ← handles image_url on save/update
│   │   └── ...
│   ├── middleware/
│   │   ├── upload.js                  ← Multer config (vehicles/ricemills/marketplace)
│   │   ├── adminAuth.js
│   │   └── farmerAuth.js
│   ├── routes/
│   ├── uploads/                       ← uploaded images go here
│   │   ├── vehicles/
│   │   ├── ricemills/
│   │   └── marketplace/
│   ├── schema.sql                     ← fresh install (includes image_url)
│   ├── add_image_columns.sql          ← existing DB: adds image_url columns
│   ├── sample_data.sql
│   └── server.js                      ← serves /uploads/ as static files
│
└── frontend/
    ├── src/
    │   ├── pages/admin/
    │   │   ├── Vehicles.js            ← image drag-drop upload zone
    │   │   ├── RiceMills.js           ← image drag-drop upload zone
    │   │   ├── RiceTypes.js           ← per-mill pricing
    │   │   └── Marketplace.js         ← listing management
    │   ├── components/
    │   │   └── VehicleList.js         ← shows images from DB
    │   └── pages/
    │       └── Selling.js             ← improved visible form
```

---

## 🛠️ Admin Panel Features

| Section          | What you can do                                          |
|------------------|----------------------------------------------------------|
| 🚜 Vehicles       | Add/Edit/Delete vehicles + upload vehicle photo          |
| 🏭 Rice Mills     | Add/Edit/Delete mills + upload mill photo                |
| 🍚 Rice Types     | Set different prices per variety per mill                |
| 🛍️ Marketplace    | Add/Edit/Delete public rice listings                     |
| 📅 Bookings       | View, update status, delete bookings                     |
| 🌾 Selling Req.  | View and approve/reject farmer selling requests          |
| 🛒 Rice Orders    | View rice marketplace orders                             |
| 👥 Farmers        | View and manage farmer accounts                          |
| 🚪 Logout         | Click Logout button in top-right navbar                  |

