# Frontend – Personal Portfolio

This is the frontend for my personal portfolio website. It is built with React, TypeScript, Vite, and Tailwind CSS, and is designed to work as part of a full-stack application served from a single domain.

The frontend consumes a REST API provided by the backend and supports both public-facing pages and authenticated admin pages for managing content.

---

## Tech Stack

- **React** (with React Router)
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Headless UI** (for accessible interactive components)
- **Cloudinary** (for hosted images and documents)

---

## Architecture Overview

- The frontend is built as a single-page application (SPA)
- In production, the compiled frontend is served by the backend from the same origin.
- Authentication is handled via HTTP-only cookies set by the backend.
- Admin routes are protected client-side and server-side.

