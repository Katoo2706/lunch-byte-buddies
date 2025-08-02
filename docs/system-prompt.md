# System Prompt for AI Agent Development

This document contains the system prompt and guidelines for AI agents working on the lunch tracking application.

## Project Context

You are working on a **lunch tracking application** built with React, TypeScript, Tailwind CSS, and Supabase. The app helps teams manage lunch orders, track settlements, and coordinate group dining.

## Core Functionality

### Current Features
- **Individual Orders**: Single person lunch ordering with amount tracking
- **Team Orders**: Group ordering where each person specifies their individual amount
- **Global Date Selection**: Unified date picker that affects all components
- **People Management**: User profiles with gender icons and role management
- **Settlements**: Financial tracking with balance calculations and rollback capability
- **Dashboard**: Overview showing today's orders and statistics

### Key Components
- `LunchApp`: Main application wrapper with date context
- `Dashboard`: Main dashboard showing orders and stats
- `OrderLunch`: Order creation interface
- `TodaysOrders`: Display of current day's orders
- `Settlements`: Financial tracking and balance management
- `People`: User management interface

## Technical Guidelines

### Architecture Principles
1. **Component Composition**: Prefer small, focused components over large monolithic ones
2. **Custom Hooks**: Extract reusable logic into custom hooks (e.g., `useLunchData`)
3. **Type Safety**: Use TypeScript interfaces for all data structures
4. **Design System**: Use semantic tokens from `index.css` and `tailwind.config.ts`
5. **Real-time Updates**: Leverage React Query for data synchronization

### Code Standards
- Use functional components with hooks
- Implement proper error handling and loading states  
- Follow React best practices (memo, useCallback, useMemo when needed)
- Use shadcn/ui components with proper variants
- Maintain consistent naming conventions

### Data Management
- Use React Query for server state management
- Implement proper caching strategies
- Handle real-time updates via Supabase subscriptions
- Validate data with Zod schemas

## Design System Guidelines

### Color Usage
- **NEVER** use direct colors like `text-white`, `bg-black`, etc.
- **ALWAYS** use semantic tokens: `text-foreground`, `bg-background`, etc.
- All colors must be in HSL format in the design system
- Check CSS variable format before using in color functions

### Component Styling
- Use design tokens from `index.css` for consistency
- Create component variants for different states
- Implement dark/light mode support
- Ensure proper contrast ratios

### Responsive Design
- Mobile-first approach
- Use Tailwind responsive utilities
- Test on multiple screen sizes
- Consider touch interactions

## Development Workflow

### Making Changes
1. **Understand the Request**: Clarify what the user actually wants
2. **Plan Minimal Changes**: Do exactly what's requested, nothing more
3. **Check Existing Code**: Review current implementation before modifying
4. **Use Appropriate Tools**: Prefer line-replace over full file rewrites
5. **Test Changes**: Ensure functionality works as expected

### Debugging Process
1. Check console logs for errors
2. Verify network requests
3. Review component props and state
4. Check Supabase data integrity
5. Validate TypeScript compilation

### File Organization
- Keep components focused and single-purpose
- Use proper folder structure
- Implement barrel exports where appropriate
- Maintain clean import/export patterns

## Common Patterns

### Data Fetching
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['lunch-data', date],
  queryFn: () => fetchLunchData(date),
  enabled: !!date
});
```

### Form Handling
```typescript
const form = useForm<FormSchema>({
  resolver: zodResolver(schema),
  defaultValues: initialValues
});
```

### Error Handling
```typescript
if (error) {
  toast.error("Failed to save order");
  return;
}
```

## AI Agent Instructions

### Do's
- ✅ Follow the user's exact request
- ✅ Use existing patterns and components
- ✅ Maintain type safety
- ✅ Use semantic design tokens
- ✅ Implement proper error handling
- ✅ Keep components focused and reusable
- ✅ Use React Query for data management
- ✅ Follow accessibility best practices

### Don'ts
- ❌ Add features not explicitly requested
- ❌ Use direct colors in components
- ❌ Create overly complex components
- ❌ Ignore TypeScript errors
- ❌ Break existing functionality
- ❌ Use deprecated patterns
- ❌ Skip error handling
- ❌ Create duplicate components

### Response Guidelines
- Keep responses concise and focused
- Explain changes clearly but briefly
- Provide code examples when helpful
- Ask for clarification when requirements are unclear
- Suggest improvements only when directly relevant

## Debugging Commands

When issues arise, use these debugging approaches:
1. Check console logs: Look for JavaScript errors
2. Verify network requests: Check API calls and responses
3. Review component state: Use React Developer Tools
4. Validate data flow: Trace data from source to display
5. Check Supabase logs: Verify database operations

## Performance Considerations

- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders with useCallback/useMemo
- Lazy load non-critical components
- Monitor bundle size

This system prompt ensures consistent, high-quality development while maintaining the application's architecture and user experience standards.