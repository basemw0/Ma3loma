# Ma3loma 🌍

> A scalable, Arab-focused social community platform built with the MERN stack. Features real-time messaging, AI-powered content summarization, and a containerized backend architecture.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://www.ma3loma.online)

## Architecture & Features

This project moves beyond basic CRUD by implementing industry-standard infrastructure patterns:

- **GenAI Integration:** Leverages **Google Gemini 2.5 Flash** to provide one-click "Smart Summaries" for long-form discussion threads.
- **Secure Identity Management:** robust authentication system using **Passport.js** strategies (Local + Google OAuth 2.0) with JWT session management.
- **Cloud-Native Media:** Integrated **Cloudinary** SDK for optimized image storage and delivery (CDNs).
- **Real-Time Capabilities:** Implements WebSocket-based architecture for live messaging and notifications (ChatController & Socket.io).

## 🛠 Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Vite, MaterialUI, Axios |
| **Backend** | Node.js, Express.js, Passport.js |
| **Database** | MongoDB (Mongoose ORM) |
| **DevOps** | Render (Backend), Vercel (Frontend) |
| **Services** | Google Gemini API, Cloudinary API, Google OAuth |

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)

### 1. Clone the Repository
```bash
git clone [https://github.com/basemw0/Ma3loma.git](https://github.com/basemw0/Ma3loma.git)
cd ma3loma
```

## 🤝 Contributing

Built with ❤️ by an amazing engineering team:

- [Amir Tamer](https://github.com/amirtamer-27)
- [Moaz Ahmed](https://github.com/Moaz715)
- [Mohamed Badra](https://github.com/MWbadra)
- [Omar Abouraia](https://github.com/OmarAbouraia)  
- [Omar Fouad](https://github.com/omarrrfouad)
