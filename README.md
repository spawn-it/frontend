# SpawnIT - Frontend

**Next.js 15 + React 19 web interface**

> ⚠️ **Academic Project Notice**  
> This is a 2-3 week academic project developed for the PLM & Web course at HEIG-VD. The codebase is a proof of concept and may undergo significant changes. Some features are minimal implementations for demonstration purposes.

## Overview

The frontend provides a modern web interface for SpawnIT, featuring:

- **Service Dashboard** - View and manage deployed services
- **Deployment Wizard** - Deploy new services with form-based configuration
- **Real-time Updates** - Live deployment status via Server-Sent Events
- **SSO Authentication** - Keycloak integration for secure access
- **Theme Support** - Light/dark mode toggle

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Component Library**: Material-UI (MUI) v7
- **Authentication**: Keycloak (react-keycloak/web)
- **Styling**: CSS Modules + Emotion

## Getting Started

### Prerequisites

- Node.js 20+
- Backend API running on port 3001
- Keycloak instance configured

### Installation

```bash
npm install
```

### Development

```bash
# Start development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── dashboard/       # Service dashboard
│   │   └── deploy/          # Deployment wizard
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── dashboard/       # Dashboard-specific
│   │   ├── deploy/          # Deployment form components
│   │   ├── features/        # Feature sections
│   │   └── services/        # Service cards
│   ├── context/
│   │   ├── AuthProvider.jsx # Keycloak authentication
│   │   └── ThemeProvider.jsx # Theme management
│   ├── services/            # API clients
│   │   ├── catalogService.js
│   │   ├── deployService.js
│   │   └── templateService.js
│   └── layouts/             # Layout components
└── public/                  # Static assets
```

## Features

### Dashboard

- View all deployed services
- Real-time status updates
- Service management actions (plan, apply, destroy)
- Service health monitoring

### Deployment

- Form-based service configuration
- Dynamic field validation
- Template-based deployment
- Real-time deployment progress

### Authentication

Keycloak integration provides:
- Secure token management

## Configuration

Key configuration files:

- `next.config.mjs` - Next.js configuration
- `jsconfig.json` - Path aliases and JS settings
- `src/app/layout.js` - Root layout with providers

## Known Limitations

- **Error handling**: Basic error messages, needs improvement
- **Form validation**: Minimal client-side validation
- **Responsive design**: Primarily desktop-focused
- **Testing**: No automated tests (time constraint)
- **Accessibility**: Basic a11y, not fully audited
- **Loading states**: Could be more polished
- **Error boundaries**: Not implemented

## Future Improvements

- [ ] Add comprehensive test suite (Jest/RTL)
- [ ] Add proper error boundaries
- [ ] Implement better loading states
- [ ] Add form validation schemas
- [ ] Implement proper error tracking

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=spawnit
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=spawnit-frontend
```

## Contributing

This is an academic project. Feel free to fork and improve, but note that the codebase is intentionally minimal for demonstration purposes.

## Authors

- **Massimo Stefani**
- **Timothée Van Hove**

HEIG-VD - PLM & Web Course

