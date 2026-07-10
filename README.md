# Gym Management System - Frontend

## Overview

This repository contains the frontend of the **Gym Management System**, developed as the final project for the Programming IV course.

The application consumes an existing ASP.NET Core Web API and provides an intuitive interface for clients, administrators and system administrators.

The frontend has been designed with scalability, maintainability and code quality as primary goals.

---

# Main Features

## Client

* Register and Login
* Browse available classes
* View schedules
* Purchase membership plans
* Pay through Mercado Pago
* Enroll in classes
* View personal profile
* Multilanguage interface (English / Spanish)

---

## Administrator

* View all classes
* Create classes
* Edit classes
* Manage membership plans
* View registered users
* Manage user enrollments

---

## System Administrator

Includes every Administrator capability plus:

* Create administrators
* Manage administrator accounts

---

# Technology Stack

* React
* Vite
* React Router
* Axios
* Context API
* React Hook Form
* Zod
* react-i18next
* CSS Modules

---

# Project Structure

```text
src/
│
├── app/
├── api/
├── assets/
├── features/
├── shared/
├── routes/
├── locales/
├── styles/
├── utils/
│
├── App.jsx
└── main.jsx
```

Detailed architecture documentation can be found in:

* FRONTEND_ARCHITECTURE.md

---

# Getting Started

## Requirements

* Node.js 20+
* npm

---

## Installation

```bash
npm install
```

---

## Environment Variables

Create a `.env.development` file.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://your-production-api
```

---

## Run Development Server

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

## Preview Production Build

```bash
npm run preview
```

---

# Authentication

Authentication is based on JWT.

The frontend stores the authentication token and automatically sends it through Axios on every authorized request.

Role-based authorization is enforced both in the frontend and the backend.

---

# Internationalization

The application supports:

* English
* Spanish

All user-visible text is managed through translation files using **react-i18next**.

No hardcoded strings should exist inside components.

---

# Styling

The project uses:

* CSS Modules for component styles.
* Global CSS only for resets, variables and shared styles.

---

# Project Philosophy

The frontend follows the same architectural principles as the backend.

Key principles:

* Single Responsibility Principle
* Component Reusability
* Separation of Concerns
* Feature-Based Organization
* Clean and Readable Code

---

# Documentation

Project documentation is available in:

* AI_CONTEXT.md
* FRONTEND_ARCHITECTURE.md
* CURSOR_RULES.md
* ROADMAP.md
* CONTRIBUTING.md
* DECISIONS.md

---

# Team

Developed as the Programming IV Final Project.

The project follows professional development practices, emphasizing planning, documentation, clean architecture and maintainability.
