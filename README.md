# 📝 Real-Time Collaborative Document Editor

A web-based document editor that allows multiple users to edit documents in real-time. This project is built using modern web technologies and provides a clean, Word-like interface with live synchronization and auto-saving features.

---

## 🚀 Features

* ✨ Real-time collaboration (multiple users can edit simultaneously)
* 💾 Auto-save functionality (every 2 seconds)
* 📝 Rich text editing using Quill.js
* 📄 Word-style page layout (A4 design with shadow)
* ➕ Add multiple pages dynamically (visual pages)
* ⚡ Fast and responsive UI

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Quill.js
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO

### Database

* MongoDB

---

## 📂 Project Structure

```
collab-editor/
│
├── client/        # Frontend (React)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/        # Backend (Node.js)
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/CODTECH-INTERNSHIP-TASK3.git
cd CODTECH-INTERNSHIP-TASK3
```

---

### 2️⃣ Run Backend Server

```
cd server
npm install
npm start
```

---

### 3️⃣ Run Frontend

```
cd client
npm install
npm start
```

---

## ▶️ Usage

1. Open browser and go to:

```
http://localhost:3000
```

2. A new document will be created automatically.

3. Share the URL with others to collaborate in real-time.

---

## 🔄 How It Works

* Each document is assigned a unique ID.
* Users connect through WebSockets using Socket.IO.
* Changes are instantly synced across all connected users.
* Data is automatically saved to MongoDB at regular intervals.

---

## 📸 Output

* Clean document editor interface
* Toolbar with formatting options
* Real-time syncing across tabs
* Auto-save status indicator
