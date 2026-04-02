# Mohavhir Enterprises — Billing Application

A complete full-stack billing web application built with React, Node.js/Express, and MongoDB.

---

## 📁 Folder Structure

```
billing-app/
├── package.json              ← Root (run both servers together)
├── README.md
│
├── backend/                  ← Node.js + Express API
│   ├── server.js             ← Main server entry point
│   ├── .env                  ← Environment variables (MongoDB URI)
│   ├── package.json
│   ├── models/
│   │   ├── Party.js          ← Customer/party schema
│   │   ├── Item.js           ← Product/item schema
│   │   ├── Bill.js           ← Invoice schema
│   │   └── Counter.js        ← Auto-increment bill number
│   └── routes/
│       ├── parties.js        ← CRUD for parties
│       ├── items.js          ← CRUD for items
│       └── bills.js          ← Create & fetch bills
│
└── frontend/                 ← React + Tailwind (inline styles)
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js          ← React entry point
        └── App.jsx           ← Complete single-file React application
```

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js v18 or higher
- npm v8 or higher
- Internet connection (for MongoDB Atlas)

### Option A: Run separately (Recommended)

**Step 1 — Install Backend Dependencies**
```bash
cd billing-app/backend
npm install
```

**Step 2 — Start Backend Server**
```bash
npm run dev
# Backend runs on http://localhost:5000
```

**Step 3 — Install Frontend Dependencies** (new terminal)
```bash
cd billing-app/frontend
npm install
```

**Step 4 — Start Frontend**
```bash
npm start
# Frontend runs on http://localhost:3000
```

### Option B: Run both together
```bash
cd billing-app
npm install
npm install -g concurrently   # if not installed
npm run install-all
npm run dev
```

---

## 🌐 API Routes

### Parties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parties` | List all parties |
| GET | `/api/parties?search=abc` | Search parties |
| GET | `/api/parties/:id` | Get single party |
| POST | `/api/parties` | Create party |
| PUT | `/api/parties/:id` | Update party |
| DELETE | `/api/parties/:id` | Delete party |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | List all items |
| GET | `/api/items?search=abc` | Search items |
| POST | `/api/items` | Create item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |

### Bills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bills` | List all bills |
| GET | `/api/bills?startDate=&endDate=` | Filter bills by date |
| GET | `/api/bills/next-number` | Get next bill number |
| GET | `/api/bills/:id` | Get single bill |
| POST | `/api/bills` | Create bill |
| DELETE | `/api/bills/:id` | Delete bill |

---

## 📦 Sample API Payloads

### Create Party
```json
POST /api/parties
{
  "companyName": "ABC Traders",
  "gstNumber": "27AABCT1234F1Z5",
  "address": "45 Market Road, Pune - 411001",
  "phone": "+91 98765 43210"
}
```

### Create Item
```json
POST /api/items
{
  "name": "Rice (Premium)",
  "defaultPrice": 60,
  "unit": "kg"
}
```

### Create Bill
```json
POST /api/bills
{
  "billDate": "2024-01-15",
  "party": {
    "id": "<party_mongo_id>",
    "companyName": "ABC Traders",
    "gstNumber": "27AABCT1234F1Z5",
    "address": "45 Market Road, Pune",
    "phone": "+91 98765 43210"
  },
  "items": [
    { "itemName": "Rice (Premium)", "quantity": 10, "price": 60, "total": 600 },
    { "itemName": "Wheat Flour", "quantity": 5, "price": 45, "total": 225 }
  ],
  "subtotal": 825,
  "gstPercent": 5,
  "gstAmount": 41.25,
  "grandTotal": 866.25,
  "notes": "Payment due in 30 days"
}
```

---

## 🏢 Company Details (Hardcoded in App)

To change company details, edit the `COMPANY` constant in `frontend/src/App.jsx`:

```js
const COMPANY = {
  name: "Mohavhir Enterprises",
  gst: "27AAGFM1234C1Z5",
  address: "123, Industrial Area, Phase 2, Mumbai - 400001, Maharashtra",
  phone: "+91 98765 43210",
};
```

---

## ✨ Features

- ✅ Create bills with auto-incremented bill numbers
- ✅ Add/Edit/Delete parties (customers)
- ✅ Add/Edit/Delete items with default prices
- ✅ Dynamic item rows with auto-calculated totals
- ✅ GST calculation (0%, 5%, 12%, 18%, 28%)
- ✅ Bill preview with professional A4 layout
- ✅ Print / Download as PDF via browser print
- ✅ Bill history with date filtering
- ✅ Search parties and items
- ✅ Dark mode toggle
- ✅ Responsive design
- ✅ Toast notifications

---

## 🔧 Environment Variables

Create `backend/.env`:
```
MONGO_URI=mongodb+srv://billing:billing@cluster0.oanpcii.mongodb.net/?appName=Cluster0
PORT=5000
```

---

## 🖨️ Print / PDF Instructions

1. Click **Generate Bill** to create a bill
2. In the preview, click **Print / Download PDF**
3. A new window opens with the formatted bill
4. In the browser print dialog:
   - Select **Save as PDF** to download
   - Or select your printer to print physically
   - Set paper size to **A4**
   - Enable **Background graphics** for proper styling
