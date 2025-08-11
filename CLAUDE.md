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

- **Documents** (`docs/`)
- **Ignore Documents** (`docs/ignore`)
