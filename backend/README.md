# Clean My India - Backend API

Backend server for Clean India civic issue reporting platform.

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Setup Environment

Create `.env` file:

```env
DB_HOST=your-database-host
DB_NAME=clean_india_db
DB_USER=your-db-user
DB_PASS=your-db-password
DB_PORT=5432
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Run Server

```bash
npm start          # Production
npm run dev        # Development with auto-reload
```

Server runs on `http://localhost:5000`

## 🧪 Testing

### Run API Tests

```bash
npm test
```

### Test Database Connection

```bash
node test/test-db-connection.js
```

### Postman Testing

Import `test/Clean-India-API.postman_collection.json` in Postman.
See `test/POSTMAN_GUIDE.md` for details.

## 📁 Project Structure

```
backend/
├── middleware/       # Auth & error handling
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── test/            # Testing files
├── uploads/         # Uploaded images
├── server.js        # Entry point
└── db.js           # Database connection
```

## 🔑 API Endpoints

### Public

- `GET /api/health` - Health check
- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get single issue

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Protected (Auth Required)

- `POST /api/issues` - Report new issue
- `POST /api/issues/:id/like` - Like issue
- `POST /api/issues/:id/comment` - Add comment

### Official/Admin Only

- `PATCH /api/issues/:id/status` - Update status
- `PATCH /api/issues/:id/assign` - Assign issue

## 🗄️ Database Setup

Run `test/setup-database.sql` in your PostgreSQL database to create tables.

## 📚 Documentation

- `test/POSTMAN_GUIDE.md` - Complete API testing guide
- `test/setup-database.sql` - Database schema

## 🛠️ Tech Stack

- Node.js + Express
- PostgreSQL
- JWT Authentication
- Socket.io (real-time updates)
- Multer (file uploads)

## 🌐 Deployment

Deployed on Render with PostgreSQL database.

---

Made with ❤️ for Clean My India by Adarsh Singh
