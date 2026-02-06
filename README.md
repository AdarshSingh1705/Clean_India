<h1 align="center">Clean India</h1>
<p align="center">Civic Issue Reporting Portal</p>

A full-stack web application that allows citizens to report local issues (potholes, garbage, water leakage, etc.), track their status, and engage through likes and comments. Officials can update statuses and assign issues.

<p align="center">
<img alt="last-commit" src="https://img.shields.io/github/last-commit/AdarshSingh1705/clean_my_india?style=flat&logo=git&logoColor=white&color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="repo-top-language" src="https://img.shields.io/github/languages/top/AdarshSingh1705/clean_my_india?style=flat&color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="repo-language-count" src="https://img.shields.io/github/languages/count/AdarshSingh1705/clean_my_india?style=flat&color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">
</p>

<p><i>Built with the tools and technologies:</i></p>
<p >
<img alt="Express" src="https://img.shields.io/badge/Express-066641.svg?style=flat&logo=Express&logoColor=green" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="JSON" src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="Markdown" src="https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="Socket.io" src="https://img.shields.io/badge/Socket.io-010101.svg?style=flat&logo=socketdotio&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="npm" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt=".ENV" src="https://img.shields.io/badge/.ENV-ECD53F.svg?style=flat&logo=dotenv&logoColor=black" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="sharp" src="https://img.shields.io/badge/sharp-99CC00.svg?style=flat&logo=sharp&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="Leaflet" src="https://img.shields.io/badge/Leaflet-199900.svg?style=flat&logo=Leaflet&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="React" src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="Cloudinary" src="https://img.shields.io/badge/Cloudinary-3448C5.svg?style=flat&logo=Cloudinary&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="Axios" src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="YAML" src="https://img.shields.io/badge/YAML-CB171E.svg?style=flat&logo=YAML&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="BREVO" src="https://img.shields.io/badge/BREVO-2A9B75.svg?style=flat&logo=BREVO&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
</p>

## Overview

<p>Clean India is an open-source civic issue reporting platform that enables citizens to report, track, and resolve local problems efficiently. It combines a scalable backend, a dynamic React frontend, and AI-powered validation to foster community engagement and municipal accountability.</p>
<p>Click Here to Open Website: <a href="https://clean-india-frontend.onrender.com" rel="nofollow"><strong><i>clean-india-frontend.onrender.com</i></strong></a></p>

<p><strong>Why Clean India?</strong></p>

<p>This project aims to streamline civic issue management through a robust, developer-friendly architecture. The core features include:</p>

<ul class="list-disc pl-4 my-0">
<li class="my-0">🧩 <strong>🔧 Modular Architecture:</strong> Seamless integration of backend APIs, frontend components, and database layers for scalable development.</li><br>

<li class="my-0">🚀 <strong>🌐 Real-Time Communication:</strong> Live updates, notifications, and socket-based interactions to keep users engaged.</li><br>

<li class="my-0">🖼️ <strong>🤖 AI Validation:</strong> Image upload validation and waste classification to ensure relevant and accurate issue reporting.</li><br>

<li class="my-0">🔐 <strong>🔑 Secure Authentication:</strong> Role-based access control, user management, and session handling for a safe user experience.</li><br>

<li class="my-0">📧 <strong>✉️ Email Integration:</strong> Reliable notifications and alerts via Brevo SMTP service for effective communication.</li>
</ul>

## 🚀 Features

### 👥 Public Users (No Login Required)

- View all reported issues
- Browse by filters: status, category, priority
- View issue details with comments and likes

### 👤 Registered Users

- Report new issues with location and optional image
- Like and comment on issues
- Track issue status updates in real-time
- View personal dashboard

### 🛠️ Officials / Admin

- Update issue status (pending, in_progress, resolved, closed)
- Assign issues to staff members
- Manage users and moderate content

## 📁 Project Structure

```
clean-my-india/
├── backend/              # Node.js + Express API
│   ├── middleware/       # Auth & error handling
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── test/            # Testing files
│   ├── server.js        # Entry point
│   └── db.js           # Database connection
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   └── public/
└── README.md
```

## 📸 Screenshot

<img width="1713" height="813" alt="image" src="https://github.com/user-attachments/assets/adf4ae3d-869c-4bf0-8e09-30df54bbe692" />

## 🛠️ Tech Stack

**Frontend:**

- React
- Axios
- TailwindCSS

**Backend:**

- Node.js + Express
- PostgreSQL (Aiven Cloud)
- JWT Authentication
- Socket.io (real-time updates)
- Multer (file uploads)
- Cloudinary (image storage)

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/clean-my-india.git
cd clean-my-india
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
# Database Configuration (Aiven PostgreSQL)
DB_HOST=your-aiven-host.aivencloud.com
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASS=your-aiven-password
DB_PORT=your-aiven-port
DATABASE_URL=postgresql://avnadmin:password@host:port/defaultdb?sslmode=require

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Email Configuration (Brevo SMTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
EMAIL_USER=your-brevo-email
EMAIL_PASS=your-brevo-password

# Application Configuration
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Setup database:

**Option 1: Using Aiven Console (Recommended)**
1. Create free PostgreSQL service on [Aiven](https://aiven.io/)
2. Copy connection details from Aiven dashboard
3. Open Query Editor in Aiven Console
4. Run SQL from `database/production-setup-sql`

**Option 2: Using psql**
```bash
psql "postgresql://avnadmin:password@host:port/defaultdb?sslmode=require" -f database/production-setup-sql
```

**Option 3: Local PostgreSQL**
```bash
psql -h localhost -U postgres -d clean_my_india -f database/production-setup-sql
```

Start backend:

```bash
npm start
```

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm start
```

**URLs:**

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Production: `https://clean-india-frontend.onrender.com`

## 🔑 API Endpoints

### Public

- `GET /api/health` - Health check
- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get single issue

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Protected (Login Required)

- `POST /api/issues` - Report new issue
- `POST /api/issues/:id/like` - Like issue
- `DELETE /api/issues/:id/like` - Unlike issue
- `POST /api/issues/:id/comment` - Add comment

### Official/Admin Only

- `PATCH /api/issues/:id/status` - Update status
- `PATCH /api/issues/:id/assign` - Assign issue

## 🧪 Testing

### Run API Tests

```bash
cd backend
npm test
```

### Test with Postman

Import `backend/test/Clean-My-India-API.postman_collection.json` in Postman.
See `backend/test/POSTMAN_GUIDE.md` for details.

### Test Database Connection

```bash
node backend/test/test-db-connection.js
```

## 🔄 Database Migration

### Migrate from Local to Aiven

```bash
# Export local database
pg_dump -h localhost -U postgres -d clean_my_india -f database/backup.sql

# Import to Aiven
psql "postgresql://avnadmin:password@host:port/defaultdb?sslmode=require" -f database/backup.sql
```

## 🎮 Future Enhancements

- 📱 SMS/WhatsApp integration
- 🏆 Gamification (badges, leaderboards)
- 🌐 Multi-language support
- 📴 Offline mode

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

📜 License

This project is licensed under the MIT License.

📧 Contact:

🌐 LinkedIn: www.linkedin.com/in/adarshsingh1705

🌐 LeetCode: https://leetcode.com/u/AdarshSingh1705/

📧 Email: gfp.globalfootprints2024@gmail.com

<p align="center">Designed and Developed with ❤️ by Adarsh Singh</p>
