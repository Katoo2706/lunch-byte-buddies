# Development Guide

This document provides comprehensive information for developers working on the lunch tracking application.

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Real-time)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Application components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## Development Workflow

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:8080

### Code Standards

- Use TypeScript for all new code
- Follow React functional component patterns
- Use custom hooks for shared logic
- Implement proper error handling
- Write semantic, accessible HTML
- Use Tailwind CSS design tokens

### Component Guidelines

- Create small, focused components
- Use proper TypeScript interfaces
- Implement loading and error states
- Follow the established naming conventions
- Document complex logic with comments

### Supabase Integration

The app uses Supabase for:
- Data persistence (PostgreSQL)
- Real-time subscriptions
- User authentication
- File storage (if needed)

### Testing

- Test components in isolation
- Write integration tests for critical flows
- Use React Testing Library patterns
- Test accessibility features

### Performance

- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle size
- Monitor Core Web Vitals

## Best Practices

1. **State Management**: Use React Query for server state, local state for UI
2. **Error Handling**: Implement proper error boundaries and fallbacks
3. **Accessibility**: Ensure WCAG compliance
4. **Performance**: Lazy load components and optimize re-renders
5. **Security**: Validate all inputs and implement proper authentication

## Debugging

- Use browser dev tools
- Check Supabase logs
- Monitor network requests
- Use React Developer Tools
- Check console for errors

## Deployment

The app can be deployed via Lovable's built-in deployment system or manually to any static hosting service.