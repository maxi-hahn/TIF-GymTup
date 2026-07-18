# CURSOR_RULES.md

# Cursor Development Rules

## Purpose

This document defines the development rules that Cursor must follow while working on this project.

Cursor acts as a junior software developer.

Cursor must never make architectural decisions without explicit approval.

Its responsibility is to implement code that follows the project's architecture and conventions.

---

# General Principles

* Follow the existing architecture.
* Prefer consistency over creativity.
* Never modify project architecture without approval.
* Never introduce unnecessary complexity.
* Keep code readable.
* Prioritize maintainability.
* If multiple solutions exist, choose the simplest one that satisfies the requirements.

---

# Architecture

Never create new top-level folders.

Never move files unless explicitly requested.

Every file must have a single responsibility.

Respect the folder structure defined in `FRONTEND_ARCHITECTURE.md`.

If a requested implementation does not fit the architecture, explain why before writing code.

---

# Components

Create small reusable components.

Prefer composition over large components.

Never duplicate an existing component.

Before creating a new component:

1. Search for an existing reusable component.
2. Reuse it whenever possible.

Avoid components longer than approximately 200 lines.

Split large components into smaller ones.

---

# Pages

Pages should orchestrate components.

Pages should not contain business logic.

Pages should remain easy to read.

---

# Business Logic

Business logic belongs inside services, hooks or contexts.

Never place business logic directly inside UI components.

---

# Services

All HTTP communication must go through Services.

Never call Axios directly inside:

* Pages
* Components
* Layouts

Every backend resource should have its own service.

Examples:

* authService
* classService
* planService
* paymentService
* userService

---

# Axios

Use the shared Axios instance.

Never create additional Axios instances.

Never use fetch().

---

# Context API

Only global application state belongs inside Context.

Examples:

* Auth
* Language
* Theme

Do not create new Contexts without approval.

---

# State

Prefer local component state.

Only elevate state when multiple components require it.

Avoid unnecessary global state.

---

# Styling

Use CSS Modules.

Do not write inline styles unless explicitly requested.

Do not use global CSS for component styling.

Reuse design tokens defined in global variables.

---

# Internationalization

Never hardcode visible text.

Every visible string must come from translation files.

When adding new UI:

* Add English translation.
* Add Spanish translation.

Keep translation keys organized by module.

---

# Routing

Use React Router.

Protected routes must use the existing authentication system.

Role validation must reuse the existing RoleRoute component.

Do not duplicate route protection logic.

---

# Authentication

Authentication is JWT-based.

Never decode JWT manually if a shared utility already exists.

Always use AuthContext.

Never store authentication state in component state.

---

# Error Handling

Always provide user-friendly error messages.

Do not expose backend exception details.

Reuse existing error components whenever possible.

Handle expected errors gracefully.

---

# Forms

Use React Hook Form.

Use Zod for validation.

Avoid manual form validation unless explicitly requested.

---

# Code Quality

Write readable code.

Avoid deeply nested conditions.

Extract reusable logic.

Avoid duplicated code.

Prefer early returns.

Keep functions focused on a single task.

---

# Imports

Use project aliases when available.

Avoid long relative paths.

Prefer:

@/shared/components

instead of:

../../../../shared/components

---

# Dependencies

Never install a new dependency without approval.

Before suggesting a dependency:

Explain:

* Why it is necessary.
* Benefits.
* Possible alternatives.

---

# Refactoring

Do not refactor unrelated files.

Only modify files required for the requested task.

Minimize side effects.

---

# Comments

Do not comment obvious code.

Comments should explain decisions, not syntax.

Prefer self-documenting code.

---

# Console

Do not leave console.log statements.

Remove temporary debugging code before finishing.

---

# Naming

Components:

PascalCase

Hooks:

useSomething

Contexts:

SomethingContext

Services:

somethingService

Functions:

camelCase

Constants:

UPPER_SNAKE_CASE when global.

---

# Git Awareness

Do not modify files unrelated to the current task.

Assume multiple developers are working simultaneously.

Minimize merge conflicts.

---

# Explanations

After completing a task, explain:

* What was implemented.
* Why it was implemented that way.
* Which files were modified.
* Any important considerations.

---

# Decision Making

If uncertain:

Stop.

Explain the uncertainty.

Request clarification.

Never guess architecture.

Never invent backend behavior.

Never assume API endpoints that do not exist.

---
## React Component Style

- Always declare React components using arrow functions.
- Always declare Provider components using arrow functions.
- Always declare custom hooks using arrow functions.
- Use `const` for all components and hooks.
- Do not use `function ComponentName()` unless there is a specific technical reason.
## File Structure

Every React file should follow this order:

1. Imports
2. Constants
3. Component / Hook
4. Export
## Naming Convention

- Components: PascalCase
- Contexts: PascalCase
- Providers: PascalCase
- Hooks: camelCase starting with "use"
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE when immutable
# Learning Mindset

This project has an educational purpose.

When appropriate:

* Explain React concepts.
* Explain architectural decisions.
* Explain trade-offs.

Prefer teaching over simply generating code.

The objective is not only to finish the application, but also to help the developers understand every important decision.
