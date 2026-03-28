# ResearchVault

Sprint 1 MVP for collecting research links with Next.js 16, MongoDB Atlas, and a Vercel-ready setup.

## Tech Stack

- **Next.js 16 App Router**
- **React 19**
- **MongoDB Atlas**
- **TypeScript**
- **Tailwind CSS 4**
- **React Compiler**
- **GitHub Actions**

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- npm

### Installation

1. Copy env values:

```bash
cp .env.example .env.local
```

2. Add your MongoDB Atlas connection details to `.env.local`:

```bash
MONGODB_URI=your-atlas-connection-string
MONGODB_DB_NAME=research_vault
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
test-research-vault/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── theme-provider.tsx
│   │   └── ui/
│   └── lib/
├── public/
├── AGENTS.md
├── .prettierrc
├── .vscode/
│   └── settings.json
├── components.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code with ESLint
- `npm run test` - Run lightweight Node-based tests
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without writing changes

## Deployment Notes

- Add `MONGODB_URI` and `MONGODB_DB_NAME` to your Vercel project environment variables.
- The app uses server-side MongoDB access and Server Actions, so no browser-side database secrets are exposed.
- GitHub Actions runs lint and build checks on pushes and pull requests.

## License

MIT License
