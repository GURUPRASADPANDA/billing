# Billing Application - Context Memory & Cloud Deployment Guide

This document serves as the central context memory for the Mohavhir Enterprises Billing Application. It outlines the architecture, tech stack, and deployment instructions required for transitioning this local application into a cloud environment.

## 1. Project Overview
A full-stack web application designed for generating, managing, and printing GST bills, managing parties (customers), inventory items, and tracking monthly revenue. 
It features a mobile-first responsive design, dark/light modes, PDF generation, and a soft-delete (Trash) system.

## 2. Technology Stack
- **Frontend**: React.js (Create React App), `react-router-dom` (Routing), `lucide-react` (Icons), `html2pdf.js` (PDF Generation)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Architecture**: MVC (Model-View-Controller) for Backend, Modular Components for Frontend.

## 3. Environment Variables (.env)
To deploy this application to the cloud, the following environment variables MUST be configured in your cloud hosting provider:

### Backend Variables:
- `PORT`: (Optional) The port the backend runs on (usually provided by the cloud host).
- `MONGO_URI`: The connection string to your MongoDB Atlas cluster (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/billing?retryWrites=true&w=majority`).
- `NODE_ENV`: Set to `production`.

### Frontend Variables (if applicable):
- The `API_BASE` in `frontend/src/services/api.js` is already configured to switch dynamically based on the environment:
  - Development: `http://localhost:5000/api`
  - Production: `https://<YOUR_BACKEND_URL>/api` *(You must update the URL in `api.js` to match your deployed backend URL).*

## 4. System Architecture (Folder Structure)

### Backend (`/backend`)
- **`config/db.js`**: Handles connection to MongoDB Atlas.
- **`models/`**: Mongoose Schemas (`Bill`, `Item`, `Party`, `Profile`, `Counter`).
- **`controllers/`**: Core business logic.
  - `billController.js`, `itemController.js`, `partyController.js`, `profileController.js`, `trashController.js`
- **`routes/`**: Express routes mapping API endpoints to Controllers.
- **`server.js`**: Application entry point.

### Frontend (`/frontend/src`)
- **`components/ui/`**: Reusable elements (`Btn`, `Input`, `Select`, `Modal`, `Toast`).
- **`components/layout/`**: `Sidebar`, `BottomNav`.
- **`components/pdf/`**: `BillPreview`, `StatementModal`.
- **`pages/`**: React Router page views (`BillingPage`, `HistoryPage`, `ItemsPage`, etc.).
- **`services/api.js`**: Centralized API fetch logic.
- **`hooks/` & `utils/`**: Custom hooks and formatters.

## 5. Database Schema Details
- **Bill**: `billNumber`, `billDate`, `party` (embedded), `items` (array), `subtotal`, `gstPercent`, `gstAmount`, `grandTotal`, `notes`, `deletedAt`.
- **Item**: `name`, `defaultPrice`, `unit`, `deletedAt`.
- **Party**: `companyName`, `gstNumber`, `address`, `phone`, `deletedAt`.
- **Profile**: Global company info for the header of the printed bills.
- **Counter**: Auto-incrementing sequences for `billNumber` generation, including tracking reused deleted numbers.

## 6. Cloud Deployment Steps

### Phase 1: Database Setup (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User and save the credentials.
3. Whitelist `0.0.0.0/0` in Network Access so the cloud backend can connect.
4. Copy the Connection String (`MONGO_URI`).

### Phase 2: Backend Deployment (Render / Heroku / Railway)
1. Push your code to a GitHub Repository.
2. Connect the repository to your hosting provider.
3. Select the `backend` folder as the Root Directory.
4. Set Build Command: `npm install`
5. Set Start Command: `node server.js`
6. Add the `MONGO_URI` environment variable.
7. Deploy and copy the live backend URL.

### Phase 3: Frontend Deployment (Vercel / Netlify)
1. Open `frontend/src/services/api.js` and update line 2 with your newly generated live backend URL.
2. Commit and push the change to GitHub.
3. Connect your repository to Vercel or Netlify.
4. Select the `frontend` folder as the Root Directory.
5. Set Build Command: `npm run build`
6. Set Output Directory: `build`
7. Deploy!

## 7. API Route Map
- **Bills**: `GET /api/bills`, `POST /api/bills`, `DELETE /api/bills/:id`, `GET /api/bills/summary`, `GET /api/bills/next-number`
- **Items**: `GET /api/items`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`
- **Parties**: `GET /api/parties`, `POST /api/parties`, `PUT /api/parties/:id`, `DELETE /api/parties/:id`
- **Profile**: `GET /api/profile`, `PUT /api/profile`
- **Trash**: `GET /api/trash/:type`, `POST /api/trash/restore/:type/:id`, `DELETE /api/trash/permanent/:type/:id`
