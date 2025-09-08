# Copilot Instructions for ROE Cybersecurity Website

## Project Overview
- This is a Next.js 13+ app using the `/app` directory structure, TypeScript, Tailwind CSS, and Framer Motion for UI/animation.
- The project is designed for a modern, professional cybersecurity website with multi-language support and custom UI components.

## Key Architecture & Patterns
- **Pages & Routing:**
  - Main pages are in `src/app/` (e.g., `page.tsx`, `about/page.tsx`, `auth/register/page.tsx`).
  - Nested routes for features (e.g., `auth/register`, `careers/apply`, `shop/roe-laptop`).
- **Components:**
  - Shared UI in `src/components/` (e.g., `Header.tsx`, `ui/Button.tsx`, `ImageWrapper.jsx`).
  - Contexts for language switching in `src/contexts/LanguageContext.jsx`.
  - Custom hooks in `src/hooks/` (e.g., `useTranslation.js`).
- **Styling:**
  - Tailwind CSS config in `tailwind.config.mjs` (custom fonts, colors, typography).
  - Global styles in `src/app/globals.css` and `src/styles/typography.css`.
  - Use `font-sans` and custom text classes (`text-display`, `text-h1`, etc.) for consistent typography.
- **Localization:**
  - Language files in `src/locales/` (`en.json`, `fr.json`).
  - Use `useLanguage` and `useTranslation` for dynamic text.
- **Assets:**
  - Images in `public/images/` (organized by type/team/laptop).
  - SVGs and PDFs in `public/`.

## Developer Workflows
- **Start Dev Server:**
  - `npm run dev` (or `yarn dev`) launches at `http://localhost:3000`.
- **Build for Production:**
  - `npm run build` (or `yarn build`).
- **Tailwind Usage:**
  - Use utility classes and custom classes from config. Extend with `@layer` in CSS for components/utilities.
- **Linting:**
  - ESLint config in `eslint.config.mjs`. Fix display name and import errors for React components.
- **External Dependencies:**
  - Framer Motion for animation, Lucide React for icons, React Hook Form + Yup for forms, `@tailwindcss/typography` for rich text.

## Project-Specific Conventions
- Use `font-sans` and custom text classes for all major headings and body text.
- Use context/hooks for language switching and translation.
- Prefer motion components for animated UI sections.
- Organize assets by type in `public/`.
- Use `ImageWrapper` for images to handle fallback and optimization.
- All forms use React Hook Form and Yup for validation.

## Examples
- To add a new page: create `src/app/newpage/page.tsx` and use Tailwind + custom classes.
- To add a new language: update `src/locales/` and context/hook logic.
- To add a new UI component: place in `src/components/`, use Tailwind and Framer Motion as needed.

## References
- See `README.md` for basic setup and Next.js links.
- See `tailwind.config.mjs` and `src/styles/typography.css` for design system.
- See `src/components/Header.tsx` for advanced UI and language selector patterns.

---
_If any conventions or workflows are unclear, please ask for clarification or examples from the codebase._
