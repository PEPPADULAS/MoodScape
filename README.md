# MoodScape

A beautiful mood-based journaling application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Mood tracking with seasonal themes
- Personalized journal entries
- Music therapy integration
- Smart calendar with reminders
- Theme customization studio
- Dark/light mode support
- Responsive design for all devices
- Personalization features (quotes, writing prompts)

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Set up the database:

```bash
npx prisma generate
npx prisma migrate dev
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM with SQLite
- **UI Components**: Lucide React Icons
- **Styling**: Tailwind CSS with custom themes
- **Animations**: Framer Motion

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── contexts/         # React context providers
├── data/             # Static data files
├── lib/              # Utility functions and services
└── styles/           # Global styles
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.