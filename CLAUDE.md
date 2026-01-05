# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 personal application called "NoteSpace" with authentication, AI chat, notes, gallery, and news features. It uses a dual-token authentication mechanism (accessToken + refreshToken) for secure API communication.

**Tech Stack:**
- Vue 3 with Composition API (`<script setup>` syntax)
- Vue Router 4 for navigation
- Element Plus for UI components
- WangEditor for rich text editing
- Axios for HTTP requests
- Vite for build tooling

## Development Commands

```bash
# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Backend Services

The application connects to **two backend services**:

1. **Primary API** (Node.js/Go, port 8080): Handles auth, notes, and general features
   - Base URL: `http://127.0.0.1:8080/api/v1`
   - Endpoints: `/auth/*`, `/notes/*`

2. **Chat API** (Python, port 8000): Handles AI chat functionality
   - Base URL: `http://127.0.0.1:8000/api/v1`
   - Endpoints: `/chat/*`

Both backends must be running for full functionality.

## Architecture

### Directory Structure

```
src/
├── api/           # API modules (login.js, chat.js, notes.js)
├── router/        # Vue Router configuration
├── utils/         # Utilities (request.js - axios setup)
├── views/         # Page components (Home, Login, Chat, Notes, etc.)
├── App.vue        # Root component
└── main.js        # Application entry point
```

### Dual-Token Authentication Flow

The app uses a sophisticated token refresh mechanism in `src/utils/request.js`:

1. **Login**: Server returns both `accessToken` (short-lived) and `refreshToken` (long-lived)
2. **API Calls**: `accessToken` is sent in `Authorization: Bearer` header
3. **Token Expire (401)**: When the access token expires:
   - Request is queued
   - Refresh token is sent to `/auth/refresh`
   - New tokens are stored
   - Queued request is retried with new token
4. **Refresh Failure**: If refresh fails, user is redirected to login

Key implementation details in `src/utils/request.js`:
- `isRefreshing` flag prevents concurrent refresh calls
- `failedQueue` holds requests during refresh
- Two axios instances: `service` (port 8080) and `chatService` (port 8000)

### Route Guards

Routes are protected in `src/router/index.js`:
- Routes with `meta.requiresAuth: true` need authentication
- Auth check uses `isAuthenticated()` which verifies both tokens exist
- Protected routes redirect to `/login` with `redirect` query param
- Login page redirects to `/home` if already authenticated

### API Organization

Each feature has its own API module in `src/api/`:
- Export named functions for each endpoint
- Use the axios instances from `request.js`
- Follow the pattern: `export const xxxApi = (params) => request({...})`

### Component Patterns

1. **Composition API**: All components use `<script setup>` syntax
2. **Reactive Data**: Use `ref()` for primitives, `reactive()` for objects
3. **Icons**: Element Plus icons imported from `@element-plus/icons-vue`
4. **Styling**: Scoped CSS with Apple-inspired design (light theme, subtle gradients)

### localStorage Keys

The app uses these localStorage keys:
- `accessToken`: Short-lived JWT for API requests
- `refreshToken`: Long-lived token for refreshing access
- `userInfo`: User profile data (JSON string)
- `experiences`: Timeline data stored in Home page

## Common Patterns

### Adding a New API Endpoint

1. Create function in appropriate `src/api/*.js` file:
```js
export const newFeatureApi = (params) => {
  return request({
    url: '/new-feature',
    method: 'post',
    data: params
  })
}
```

2. For chat endpoints, use `chatService` instead

### Adding a New Page

1. Create component in `src/views/NewPage.vue`
2. Add route in `src/router/index.js`:
```js
const NewPage = () => import('@/views/NewPage.vue')
{
  path: '/newpage',
  name: 'NewPage',
  component: NewPage,
  meta: { title: 'New Page', requiresAuth: true }
}
```

3. Add navigation in Home.vue's navbar or dropdown

### Using the Rich Text Editor

WangEditor is used in Notes and Home pages:
```vue
<Toolbar :editor="editorRef" ... />
<Editor v-model="content" @onCreated="handleEditorCreated" ... />
```

Remember to import styles: `import '@wangeditor/editor/dist/css/style.css'`

## Backend API Documentation

Detailed backend API documentation is available in the `header/` directory:
- **`header/login_api.md`** - Authentication API documentation (login, register, token refresh)
  - Dual-token mechanism explanation
  - All auth endpoints with request/response examples
  - Error codes and handling

- **`header/chat_api.md`** - Fortune Telling API documentation (命理大师)
  - Bazi (八字) calculation and marriage compatibility
  - Daily fortune calculation
  - Tarot card reading (塔罗牌占卜)
  - All endpoints use Bearer token authentication

## Important Notes

- Never commit `.env` files or secrets to git
- The app uses path alias `@` for `src/` directory
- Element Plus icons are auto-registered globally in `main.js`
- All API calls go through the centralized interceptors in `request.js`
- Token refresh is automatic - no manual handling needed in components

## Environment Setup

Both backend services must be running for full functionality:
- **Port 8080** - Primary API (auth, notes)
- **Port 8000** - Chat API (AI chat functionality)

Ensure both services are started before running `npm run dev`.
