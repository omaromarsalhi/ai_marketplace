# AI Marketplace

A full-stack application built with Nuxt 4 for both frontend and backend.

## Features

- 🎨 **Frontend**: Vue 3 + Nuxt 4 with auto-imports
- 🔥 **Backend**: Built-in Nitro server with API routes
- 📁 **File-based routing**: Automatic routing from `/pages` directory
- 🛠️ **TypeScript**: Full TypeScript support
- 🎯 **Auto-imports**: Components and composables automatically imported
- 🔧 **Hot Module Replacement**: Fast development experience

## Project Structure

```
ai_marketplace/
├── app/              # Main app entry (app.vue)
├── components/       # Vue components (auto-imported)
├── composables/      # Composable functions (auto-imported)
├── layouts/          # Layout components
├── pages/            # File-based routing pages
├── public/           # Static assets
├── server/           # Backend server code
│   ├── api/          # API endpoints
│   └── middleware/   # Server middleware
├── .env              # Environment variables (create from .env.example)
├── nuxt.config.ts    # Nuxt configuration
└── package.json      # Dependencies
```

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env` and update the values:

```bash
copy .env.example .env
```

## Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

The application will start with:
- Frontend accessible at `http://localhost:3000`
- API routes accessible at `http://localhost:3000/api/*`

## API Routes

Create API endpoints in the `server/api/` directory:

```typescript
// server/api/example.ts
export default defineEventHandler((event) => {
  return { message: 'Hello from API!' }
})
```

Access at: `http://localhost:3000/api/example`

## Frontend Pages

Create pages in the `pages/` directory:

```vue
<!-- pages/about.vue -->
<template>
  <div>About Page</div>
</template>
```

Access at: `http://localhost:3000/about`

## Production

Build the application for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Learn More

- [Nuxt Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Nitro Server Documentation](https://nitro.unjs.io/)

## License

MIT
