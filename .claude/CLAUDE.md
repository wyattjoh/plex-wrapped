# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start development server (http://localhost:3000)
bun run build    # Production build
bun run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 project using the App Router pattern with:
- **Tailwind CSS 4** for styling (configured via `@tailwindcss/postcss`)
- **TypeScript** with strict mode enabled
- **Bun** as the package manager

### Path Aliases

- `@/*` maps to the project root (e.g., `import { Foo } from "@/app/components/Foo"`)

## Project Structure

```
app/
├── page.tsx                    # Landing page with login
├── auth/                       # Plex OAuth routes
│   ├── login/route.ts          # Creates PIN, returns auth URL
│   ├── callback/route.ts       # Exchanges PIN for token
│   └── logout/route.ts         # Clears session
├── api/
│   ├── servers/route.ts        # Fetches user's Plex servers
│   └── history/route.ts        # Fetches aggregated watch history
├── wrapped/                    # Main wrapped experience
│   ├── page.tsx                # Story-style slides
│   ├── loading.tsx             # Loading state
│   └── error.tsx               # Error boundary
└── components/
    ├── auth/                   # Auth components
    ├── wrapped/                # Wrapped slides and story container
    └── ui/                     # Reusable UI components

lib/
├── plex/                       # Plex API client and types
│   ├── client.ts               # API client with headers
│   ├── auth.ts                 # PIN auth flow + user info
│   ├── servers.ts              # Server discovery
│   ├── history.ts              # Watch history fetching
│   ├── metadata.ts             # Metadata fetching (duration, batch)
│   └── types.ts                # TypeScript interfaces
├── session/
│   └── cookies.ts              # Session cookie helpers
├── stats/
│   └── calculator.ts           # Stats computation (sorted by duration)
└── utils/
    ├── dates.ts                # Date helpers
    ├── debug.ts                # Debug logging utility
    └── format.ts               # Formatting helpers
```

## Key Concepts

### Authentication Flow
1. User clicks "Sign in with Plex"
2. Create PIN via `POST plex.tv/api/v2/pins`
3. Redirect to Plex auth page
4. Plex redirects back to `/auth/callback`
5. Exchange PIN for token, store in session cookie

### Data Flow
1. Fetch all user's servers from `plex.tv/api/v2/resources`
2. For each server with remote access, fetch watch history (filtered by accountID)
3. Batch fetch metadata to get duration for each item
4. Aggregate and filter to current calendar year
5. Calculate stats (sorted by total watch duration) and display in story-style slides

### Session Storage
- Auth token stored in httpOnly session cookie
- No database required - purely client-side session

## Environment Variables

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Required for OAuth callback
DEBUG_WRAPPED=true                          # Enable verbose debug logging
```

## Plex API Reference

### Authentication

**Get current user info:**
```
GET https://plex.tv/api/v2/user
Headers: X-Plex-Token, X-Plex-Client-Identifier
Returns: { id, uuid, email, username, title, thumb }
```
The `id` field is the user's plex.tv account ID.

### Watch History

**Endpoint:** `GET {serverUrl}/status/sessions/history/all`

**Key parameters:**
- `sort=viewedAt:desc` - Sort by most recent first
- `viewedAt>=<timestamp>` - Filter entries after timestamp (Unix epoch seconds)
- `viewedAt<<timestamp>` - Filter entries before timestamp
- `accountID=<id>` - Filter by user account ID
- `X-Plex-Container-Start=<n>` - Pagination offset
- `X-Plex-Container-Size=<n>` - Page size (max 1000)

**Important:** The history API does NOT return `duration`. You must fetch metadata separately.

### Account ID Filtering

Account IDs differ between owned and shared servers:
- **Shared servers:** Use the user's plex.tv account ID (e.g., `6619356`)
- **Owned servers:** The owner/admin uses local ID `1`, while shared friends use their plex.tv IDs

### Metadata (for duration)

**Single item:** `GET {serverUrl}/library/metadata/{ratingKey}`

**Batch fetch:** `GET {serverUrl}/library/metadata/{key1},{key2},{key3}`
- Supports comma-separated ratingKeys for efficient batch fetching
- Returns `duration` in milliseconds
- Recommended batch size: 50 items (to avoid URL length limits)

### Image URLs

Thumbnail paths from the API are relative (e.g., `/library/metadata/123/thumb/456`).
To construct a working URL:
```
{serverUrl}{thumbPath}?X-Plex-Token={serverAccessToken}
```

Example:
```
http://192.168.1.100:32400/library/metadata/123/thumb/456?X-Plex-Token=abc123
```

### Required Headers

All Plex API requests need:
```
X-Plex-Client-Identifier: <unique client ID>
X-Plex-Product: <app name>
X-Plex-Version: <app version>
Accept: application/json
X-Plex-Token: <auth token>  # For authenticated requests
```
