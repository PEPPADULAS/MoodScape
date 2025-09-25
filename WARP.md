# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```powershell
# Development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Database Operations
```powershell
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Deploy migrations to production
npx prisma migrate deploy
```

### Testing Individual Components
```powershell
# Test specific API routes
npx next build && npx next start
# Then use tools like curl or Postman to test endpoints

# Check TypeScript compilation
npx tsc --noEmit
```

## Architecture Overview

### Core Application Structure
- **Framework**: Next.js 15.5.3 with App Router
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS v4 with custom seasonal themes
- **State Management**: React Context for themes and music
- **Animations**: Framer Motion for interactive elements

### Database Schema
The application uses a sophisticated schema for mood journaling:
- **Users**: Authentication with email/password and optional OAuth accounts
- **Thoughts**: Core journal entries with mood, weather, season, and custom fonts/languages
- **UserSettings**: Theme preferences, auto-theme mode, visual packs
- **Events**: Calendar functionality with reminders
- **CustomThemes**: User-created color schemes stored as JSON

### Theming System
**Seasonal Theme Architecture**: The app's core feature is seasonal theming that adapts to moods and time:
- **5 base seasons**: spring, summer, fall, winter, rainy
- **Light/Dark modes**: Each season has corresponding dark variants
- **Dynamic backgrounds**: Gradient backgrounds that change with themes
- **Visual packs**: Additional overlay effects for enhanced aesthetics
- **Auto-theme**: Automatic seasonal transitions based on date/weather

### Context Providers
Multiple context providers wrap the application:
1. **SessionProvider**: NextAuth session management
2. **ThemeProvider**: Seasonal theme state and switching logic
3. **MusicProvider**: Background music and ambient sound control
4. **ParticleWrapper**: Dynamic particle effects
5. **VisualPackOverlay**: Additional visual enhancements
6. **NotificationSystem**: Toast notifications and alerts

### API Structure
RESTful API routes organized by feature:
- `/api/auth/*`: Authentication endpoints
- `/api/thoughts/*`: Journal entries, analytics, mood timeline
- `/api/calendar/*`: Events, reminders, calendar summary
- `/api/themes/custom/*`: User-created themes
- `/api/user/settings/*`: User preferences
- `/api/visual-packs/*`: Visual enhancement packs
- `/api/achievements/*`: Gamification features

### Component Architecture
- **UI Components**: Reusable themed components in `/components/ui/`
- **Feature Components**: Specialized components for charts, music, particles
- **Page Components**: Route-specific components in `/app/*/page.tsx`
- **Accessibility**: Dedicated accessibility controls and responsive design
- **Mobile Enhancements**: Touch gestures and mobile-optimized layouts

### Key Libraries and Dependencies
- **@prisma/client**: Database access layer
- **next-auth**: Authentication with Prisma adapter
- **framer-motion**: Animations and transitions
- **lucide-react**: Icon system
- **bcryptjs**: Password hashing
- **clsx & tailwind-merge**: Conditional class management

### Development Patterns
- **TypeScript**: Strict typing with path aliases (`@/*` → `./src/*`)
- **Server Components**: Default to server components, use 'use client' sparingly
- **Prisma Relations**: Proper foreign key relationships with cascade deletes
- **Theme Consistency**: All components use theme context for consistent styling
- **Error Boundaries**: Proper error handling in API routes and components

### Font System
Multi-language font support:
- **Geist Sans/Mono**: Default fonts
- **Multi-language**: Support for English, Hindi, Bengali with appropriate font families
- **Dynamic Loading**: Font variables loaded at build time for performance

### Data Flow
1. **Authentication**: NextAuth → Prisma User model
2. **Thoughts**: Create/Read through API routes → Prisma Thought model
3. **Themes**: Context state → UserSettings model → CSS classes
4. **Real-time**: Uses React state and context for immediate UI updates
5. **Persistence**: All user data stored in SQLite via Prisma

### Visual Pack System
Advanced theming beyond basic seasonal themes:
- **Overlay Effects**: Additional visual layers on top of base themes
- **Particle Systems**: Dynamic background particles
- **Custom Animations**: Enhanced micro-interactions
- **User Activation**: Users can enable/disable visual packs per preference