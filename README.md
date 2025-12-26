# Plex Wrapped

Discover your watching habits from the past year with a Spotify Wrapped-style experience for Plex.

## Features

- **Story-style slides** - Click through animated slides revealing your stats
- **Top Movies & Shows** - See your most-watched content
- **Watch Time Stats** - Total hours, days, and items watched
- **Monthly Breakdown** - Visualize your watching patterns throughout the year
- **Multi-server Support** - Aggregates data from all your Plex servers
- **Share Your Wrapped** - Share your stats with friends

## Requirements

- A Plex account
- At least one Plex server with **remote access enabled**
- Watch history from the previous calendar year

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/plex-wrapped.git
   cd plex-wrapped
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and set your app URL:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   bun dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/plex-wrapped)

Set the `NEXT_PUBLIC_APP_URL` environment variable to your production URL.

## How It Works

1. **Authentication** - Sign in with your Plex account using Plex's PIN-based auth
2. **Server Discovery** - Finds all your Plex servers with remote access
3. **History Fetching** - Aggregates watch history from all servers for the previous calendar year
4. **Stats Calculation** - Computes top movies, shows, genres, and more
5. **Presentation** - Displays your Wrapped in an interactive story format

## Privacy

- Your Plex credentials are never stored on our servers
- Authentication tokens are stored only in your browser's session cookie
- We only access your watch history - no personal data is collected
- All data processing happens server-side and is not persisted

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript** with strict mode
- **Tailwind CSS 4**
- **Bun** for package management

## Development

```bash
bun dev          # Start development server
bun run build    # Production build
bun run lint     # Run ESLint
```

## License

MIT
