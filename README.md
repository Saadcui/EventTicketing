# Decentralized Event Platform

## Project Structure

This project is organized into two main directories:

- `/frontend`: Contains all UI components, pages, and client-side logic
- `/backend`: Contains server actions, API routes, and database interactions

### Directory Structure

\`\`\`
/
├── app/                  # Next.js app directory (pages)
├── frontend/             # Frontend components and logic
│   ├── components/       # UI components
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Frontend utilities
├── backend/              # Backend logic
│   ├── lib/              # Backend libraries
│   │   ├── supabase/     # Supabase clients and types
│   │   └── actions/      # Server actions
│   └── api/              # API routes
└── public/               # Static assets
\`\`\`

## Development

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

### Reorganization Plan

To reorganize the codebase without breaking functionality:

1. Keep the current structure working
2. Create new directories for frontend and backend
3. Gradually move files while updating imports
4. Test each change to ensure functionality

## Features

- Event creation and management
- Ticket purchasing and management
- Blockchain integration for secure ticketing
- User authentication and profiles
- Analytics dashboard for event organizers
\`\`\`

Let's also create a script to help with the reorganization:
