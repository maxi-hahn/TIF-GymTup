# FRONTEND_ARCHITECTURE.md

# Frontend Architecture

## Project Philosophy

The frontend follows the same philosophy used in the backend.

Every folder and every file must have a single responsibility.

The goal is to build a scalable, maintainable and understandable application.

The project prioritizes:

* Clean architecture principles
* Separation of responsibilities
* Reusability
* Maintainability
* Readability
* Consistency
* Simplicity over unnecessary abstractions

The project is built using React with Vite and consumes an existing ASP.NET Core Web API.

The backend is considered the source of truth.

---

# Technology Stack

* React
* Vite
* React Router
* Axios
* Context API
* react-i18next
* React Hook Form
* Zod
* CSS Modules

---

# Folder Structure

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

---

# Folder Responsibilities

## app/

Application configuration.

Contains providers and global configuration.

Examples:

* AuthProvider
* LanguageProvider
* ThemeProvider
* App initialization

No UI components should exist here.

---

## api/

Contains the Axios configuration.

Only one Axios instance should exist.

Responsibilities:

* Base URL
* Authorization header
* Interceptors
* Timeout
* Global error handling

---

## assets/

Static resources only.

Examples:

* Images
* Logos
* Fonts
* Icons
* Animations

No JavaScript or React code.

---

## features/

Contains business features.

Each feature owns its pages and feature-specific components.

Example:

```text
features/

    auth/

    classes/

    plans/

    profile/

    admin/

    users/

    payments/
```

Each feature should be independent.

---

## shared/

Contains reusable code shared across the application.

Examples:

* Button
* Input
* Modal
* Loader
* Toast
* Navbar
* Footer
* Layouts
* Contexts

Anything inside shared must not know about business entities.

A Button should not know what a Class or Plan is.

---

## routes/

Contains all routing configuration.

Responsibilities:

* Application Router
* Protected Routes
* Role-based Routes

No business logic should exist here.

---

## locales/

Contains application translations.

Structure:

```text
locales/

    en/

    es/
```

Translations are divided by module.

Example:

* auth.json
* classes.json
* plans.json
* common.json

---

## styles/

Global styles only.

Examples:

* reset.css
* variables.css
* globals.css

Component styles belong next to the component using CSS Modules.

---

## utils/

Pure helper functions.

Examples:

* formatCurrency()
* formatDate()
* decodeJwt()

Utility functions must never contain business logic.

---

# State Management

Global state will use Context API.

Only truly global information belongs inside Context.

Examples:

* Authenticated user
* JWT
* Current language
* Theme (future)

Component-specific state should remain local.

Avoid unnecessary global state.

---

# Authentication

Authentication is JWT-based.

Flow:

User logs in

↓

Backend returns JWT

↓

JWT is stored

↓

AuthContext updates user state

↓

Axios automatically attaches Authorization header

↓

Protected pages become accessible

The frontend never validates permissions by itself.

The backend remains the final authority.

---

# API Communication

All HTTP requests must go through Axios.

Pages and components must never call Axios directly.

Communication flow:

Page

↓

Service

↓

Axios Client

↓

Backend API

---

# Services

Services are centralized.

Example:

```text
shared/services/

    authService.js

    classService.js

    planService.js

    paymentService.js

    userService.js
```

Services represent backend resources.

---

# Routing

Public routes:

* Login
* Register

Protected routes:

* Home
* Classes
* Plans
* Profile
* Payments

Role protected routes:

Admin

* Administration
* User Management

SysAdmin

* Admin Management

Unauthorized users must never see navigation options that do not belong to their role.

---

# Layout Strategy

The application uses shared layouts.

MainLayout

Contains:

* Navbar
* Footer
* Page Container

AuthLayout

Contains:

* Login
* Register

Mobile navigation is handled with a responsive drawer menu.

Desktop navigation uses a top navbar.

---

# Internationalization

The application supports English and Spanish.

Language switching is global.

Translations are managed using react-i18next.

No hardcoded strings should exist inside components.

All visible text must come from translation files.

---

# Styling

CSS Modules are used for component styling.

Global CSS is limited to:

* Reset
* Variables
* Typography
* Global utilities

No component styles should be placed inside globals.css.

---

# Error Handling

Global HTTP errors are handled through Axios interceptors whenever possible.

Components display friendly messages.

Unexpected errors should never expose backend implementation details.

---

# Naming Conventions

Folders:

camelCase

Components:

PascalCase

Hooks:

useSomething

Contexts:

SomethingContext

Services:

somethingService

CSS Modules:

Component.module.css

Translation Keys:

camelCase

---

# Responsive Design

Responsive design is mandatory.

The application must support:

* Desktop
* Tablet
* Mobile

Responsive behavior is implemented from the beginning.

No "desktop first then mobile later" approach.

---

# Development Principles

Prefer reusable components.

Avoid duplication.

Keep components small.

Separate presentation from business logic.

Do not optimize prematurely.

Keep the architecture consistent.

When in doubt, prioritize readability over clever solutions.
