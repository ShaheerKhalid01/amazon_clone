# 🛒 Amazon Clone - Full-Stack E-Commerce Platform

![Amazon Clone](https://img.shields.io/badge/Amazon-Clone-FF9900?style=for-the-badge&logo=amazon)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-featured Amazon clone built with the MERN stack (MongoDB, Express, React, Node.js) and modern web technologies. Features complete e-commerce functionality including product browsing, cart management, checkout, order tracking, real-time communication, and AI integrations.

## ✨ Features

### 🛍️ Core E-Commerce
- **Product Catalog** - Browse, search, and filter products
- **Shopping Cart** - Real-time cart management with quantity controls
- **Checkout Flow** - Multi-step checkout process
- **Order Management** - Track orders from placement to delivery

### 👤 User Features
- **Authentication** - Secure JWT-based authentication
- **User Profiles** - Manage personal information
- **Order History** - View and track all orders

### 🤖 Advanced Features
- **Real-time Communication** - Powered by Socket.io for live updates
- **AI Integration** - Enhanced features using Google Generative AI
- **Search** - Full-text search and filtering

### 👔 Admin
- **Admin Dashboard** - Manage products, users, and view analytics

## 🏗️ Tech Stack

### Backend
- **Node.js & Express.js** - Robust REST API framework
- **MongoDB & Mongoose** - NoSQL database and Object Data Modeling
- **JWT (JSON Web Tokens)** - Secure authentication
- **Socket.io** - Real-time bidirectional event-based communication
- **Google Generative AI** - AI capabilities integration
- **Dotenv & CORS** - Environment configuration and cross-origin resource sharing

### Frontend
- **React 18** - Modern UI library
- **Vite** - Next-generation frontend tooling and bundler
- **TypeScript** - Strongly typed programming language
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit & React Redux** - Predictable state container
- **React Router DOM** - Declarative routing
- **React Hook Form & Zod** - Performant, flexible and extensible forms with schema validation
- **Axios** - Promise based HTTP client
- **Socket.io Client** - Real-time client features
- **React Icons & React Hot Toast** - UI enhancements and notifications

### DevOps & Tools
- **Docker & Docker Compose** - Containerization for easy setup (optional)
- **Concurrently** - Run backend and frontend simultaneously in development

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9
- MongoDB (running locally or URI for MongoDB Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd amazon-clone
```

2. **Install all dependencies (Frontend & Backend)**
```bash
npm run setup
```

3. **Environment Variables**
Create `.env` files in both `frontend` and `backend` directories based on the provided `.env.example` files.

4. **Run the development servers**
```bash
npm run dev
```
This will start both the backend API and frontend React app concurrently.