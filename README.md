# ResearchVault

Sprint 3 workspace for collecting, organizing, prioritizing, and reviewing research links with Next.js 16, MongoDB Atlas, and a Vercel-ready setup.

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

## Team Ownership Split

### Frontend

**Frontend developers:** Thilina, Ammaar, Rawshan

These files are primarily responsible for UI, layout, styling, client interactions, and presentation:

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/favicon.ico`
- `src/components/link-fields.tsx`
- `src/components/link-filters.tsx`
- `src/components/link-form.tsx`
- `src/components/link-list.tsx`
- `src/components/theme-provider.tsx`
- `src/components/ui/alert-dialog.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/textarea.tsx`
- `src/lib/utils.ts`

### Backend

**Backend developer:** Peshala

These files are primarily responsible for API handling, database connection, persistence, validation, and backend data flow:

- `src/app/api/links/route.ts`
- `src/app/api/links/[id]/route.ts`
- `src/lib/mongodb.ts`
- `src/lib/research-links.ts`
- `src/lib/types.ts`
- `src/lib/validation.ts`

## Sprint 2 Modified Files

These are the main Sprint 2 product files that were updated for backlog items. Shadcn support files are intentionally not listed here.

### Frontend

- `src/app/page.tsx` - Thilina (Add search and filter state to page URL)
- `src/components/link-form.tsx` - Ammaar (Add tag input and tag badge display)
- `src/components/link-fields.tsx` - Ammaar (Add tag input and tag badge display)
- `src/components/link-filters.tsx` - Ammaar (Build search and category filter UI)
- `src/components/link-list.tsx` - Rawshan (Build edit-link dialog flow, Build delete-link confirmation flow)

### Backend

- `src/app/api/links/route.ts` - Peshala (Add filtered list query support in API)
- `src/app/api/links/[id]/route.ts` - Peshala (Add update and delete API routes for links)
- `src/lib/research-links.ts` - Peshala (Add filtered list query support in API, Add update and delete API routes for links)
- `src/lib/types.ts` - Thilina (Extend link types for tags and updated timestamps)
- `src/lib/validation.ts` - Thilina (Extend link types for tags and updated timestamps)

## Sprint 3 Modified Files

These are the main Sprint 3 product files that were updated for backlog items. Shadcn support files are intentionally not listed here.

### Frontend

- `src/app/page.tsx` - Ammaar (Add URL state for status, favorite, and sort)
- `src/components/link-form.tsx` - Thilina (Add duplicate warning flow in the create form)
- `src/components/link-fields.tsx` - Rawshan (Build reading-status selector flow)
- `src/components/link-filters.tsx` - Thilina (Build sorting and workflow filter UI)
- `src/components/link-list.tsx` - Rawshan (Build favorite toggle interaction, Build reading-status selector flow)
- `src/components/link-summary-cards.tsx` - Rawshan (Add dashboard summary cards)

### Backend

- `src/app/api/links/route.ts` - Peshala (Add duplicate detection and sort/filter support in API)
- `src/app/api/links/[id]/route.ts` - Peshala (Extend update route for workflow actions)
- `src/lib/research-links.ts` - Peshala (Add duplicate detection and sort/filter support in API, Extend update route for workflow actions)

### Documentation

- `README.md` - Thilina (Refresh README ownership and modified-files notes)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without writing changes

## Deployment Notes

- Add `MONGODB_URI` and `MONGODB_DB_NAME` to your Vercel project environment variables.
- The app uses server-side MongoDB access and Server Actions, so no browser-side database secrets are exposed.
- GitHub Actions runs lint and build checks on pushes and pull requests.

## License

MIT License
