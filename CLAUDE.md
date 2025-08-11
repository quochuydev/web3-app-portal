# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

### Testing
- No specific test commands configured - check with user if tests need to be added

## Architecture Overview

This is a **Next.js 15** web application built as a **Web3 portal/dashboard** template, designed to demonstrate Web3 app patterns similar to platforms like Polymarket. The project uses the **App Router** pattern with TypeScript.

### Tech Stack
- **Framework**: Next.js 15 with React 19
- **UI Library**: Material-UI (MUI) v7 with custom theming
- **Styling**: Emotion for CSS-in-JS, custom theme system
- **Icons**: Tabler Icons React, MUI Icons
- **Charts**: ApexCharts with React wrapper
- **TypeScript**: Full TypeScript support

### Project Structure

#### Core App Structure (`src/app/`)
- **Root Layout** (`layout.tsx`): Global MUI theme provider and CSS baseline
- **Authentication Routes** (`authentication/`):
  - Login/Register pages with custom auth components
  - `AuthLogin.tsx` and `AuthRegister.tsx` components
- **Dashboard Layout** (`(DashboardLayout)/`):
  - Protected dashboard area with sidebar navigation
  - Header with user profile dropdown
  - Responsive sidebar with menu items

#### Key Components Architecture
- **Layout System**:
  - `MainWrapper` - Flex container for entire app
  - `PageWrapper` - Content area with header and main content
  - Responsive sidebar that collapses on mobile
- **Theme System** (`src/utils/theme/`):
  - Custom MUI theme with consistent color palette
  - Plus Jakarta Sans font integration
  - Custom component overrides for cards, elevations
- **Shared Components**:
  - `BlankCard` and `DashboardCard` - Consistent card layouts
  - `PageContainer` - Page wrapper with consistent spacing
  - Custom form elements and UI components

### Key Design Patterns

#### Dashboard Layout Pattern
The dashboard uses a nested layout pattern:
1. Root layout provides global theme
2. Dashboard layout (`(DashboardLayout)`) provides sidebar + header
3. Page components render inside the dashboard container

#### State Management
- Component-level state with React hooks
- Sidebar open/close state managed in dashboard layout
- No global state management library currently implemented

#### Theming Strategy
- Centralized theme configuration in `DefaultColors.tsx`
- Custom color palette optimized for dashboard/analytics UI
- Consistent typography scale and component styling

## Development Notes

### Material-UI Integration
- Uses MUI v7 (latest major version)
- Custom theme extends default MUI theme
- Emotion styled components for layout containers
- CssBaseline for consistent cross-browser styling

### Next.js Configuration
- React Strict Mode enabled
- Images unoptimized (likely for development/demo purposes)
- App Router pattern with TypeScript

### Web3 Context
Based on documentation files, this appears to be a template for Web3 applications with:
- Wallet connection patterns (MetaMask, WalletConnect, etc.)
- Multi-chain support considerations (Ethereum, Polygon, Solana)
- Integration points for DeFi/prediction market functionality

### File Organization
- Authentication flows separated from main dashboard
- Reusable components in `components/` directory
- Theme and utilities in `src/utils/`
- Icons and assets organized by function

## Common Development Patterns

### Adding New Dashboard Pages
1. Create page in `src/app/(DashboardLayout)/[page-name]/page.tsx`
2. Use `PageContainer` wrapper for consistent spacing
3. Import and use existing card components
4. Update `MenuItems.tsx` if navigation is needed

### Component Development
- Follow existing MUI + Emotion pattern
- Use TypeScript interfaces for props
- Leverage existing theme variables
- Follow existing file naming conventions

### Working with the Theme
- Theme is defined in `src/utils/theme/DefaultColors.tsx`
- Access theme via MUI's `useTheme()` hook
- Custom colors available in theme.palette
- Typography variants predefined