# 🚀 PlanPilot - Streamline Your Workflow



PlanPilot is your go-to **project management solution** designed for agile teams and modern agencies. From sprint planning and issue tracking to secure payments and user role management, we help you stay organized, collaborate effectively, and deliver faster.

---

## ✨ Features

* ✅ **Authentication & Authorization** with [Clerk.dev](https://clerk.dev)
* 👋 **Project & Sprint Management** (Create, Start, End, Track)
* 💬 **Issue Boards** with Drag and Drop (Kanban)
* 💳 **Subscription Payments** via Razorpay
* 📊 **Progress Dashboard** (Coming Soon)
* 💡 **Responsive UI** with Tailwind CSS
* 🌐 Hosted on [Vercel]

---

## 🧱 Tech Stack

| Frontend | Backend  | Auth  | Database  | Payment  |
| -------- | -------- | ----- | --------- | -------- |
| ReactJS  | Firebase | Clerk | Firestore | Razorpay |

---

## 🖼️ Screenshots



---

## 🔐 Authentication

User sign-up and sign-in are powered by **Clerk.dev**. It provides:

* Secure auth with email, password, and OAuth.
* Role-based access (Admin can manage sprints, others can view or contribute).
* Profile and organization support.

---

## 💼 Project & Sprint Management

* **Admins** can create, start, and end sprints.
* Sprint start/end logic is validated by date and role using Firestore rules.

---

## 💳 Subscription Plans

Integrated with **Razorpay** to provide premium project management features.

| Plan         | Price   | Features                               |
| ------------ | ------- | -------------------------------------- |
| Starter      | ₹199/mo | 2 Projects, 5 Users                    |
| Professional | ₹499/mo | 10 Projects, Team Chat, Dashboard      |
| Enterprise   | ₹999/mo | Unlimited Everything, Priority Support |

🔘 You can easily upgrade with a single click — powered by Razorpay!

---

## 🧑‍💻 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/planpilot.git
cd planpilot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup `.env` File

Create a `.env` file in the root directory:

```env

VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

```

### 4. Run the App

```bash
npm run dev
```

---

## 📌 Folder Structure

```bash
src/
├── components/
│   ├── sprint-board.jsx
│   ├── create-issue.jsx
│   └── ...
├── pages/
│   ├── HomePage.jsx
│   └── ...
├── services/
│   ├── sprintService.js
│   └── userServices.js
├── hooks/
│   └── use-fetch.js
├── utils/
│   └── constants.js
└── App.jsx
```

---

## 📌 Upcoming Features

* 📈 Analytics Dashboard
* 🗕️ Calendar Integration
* 🧠 AI Task Assignment
* 🔔 Real-time Notifications
* 🦴 Custom Workflows

---

## 🌍 Live Demo

👉 [Visit PlanPilot Live](https://planpilot.vercel.app)

---

## 🤝 Contributors
Made with Code ,Care and Caeffine🍵
Special thanks to the open-source community & [Clerk.dev](https://clerk.dev), [Firebase](https://firebase.google.com), and [Razorpay](https://razorpay.com)

---

Feel free to fork and build upon it!
