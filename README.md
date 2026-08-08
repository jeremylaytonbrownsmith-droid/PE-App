# PE Planner

A free, installable Progressive Web App for K-5 PE teachers: browse and generate ready-to-print sub lesson
plans, build a year-long pacing guide, and keep a personal library of lessons and warm-up games. Everything is
stored locally in the browser (IndexedDB) - no account and no backend required, and it works offline once loaded.

## Features

- **Lesson Library** - browse, search, and filter full lesson plans by unit, grade, and gym space. Comes seeded
  with example lessons (Soccer/Handball, Jump Rope, Volleyball, Games & Movement for a half gym).
- **Sub Lesson Generator** - pick a grade and gym space, generate a ready-to-print sub lesson pulled from your
  library, auto-filled with your own class schedule.
- **Pacing Guide** - lay out an entire school year week by week, with real dates, linked to lessons in your
  library.
- **Warm-Ups & Games Library** - tag games, small-space games, and rest-zone rules, reusable across lessons.
- **My Schedule** - enter your own class schedule and duty info once; it auto-fills every generated sub lesson.
- **Backup / Share** - export everything to a JSON file and import it on another device, or share it with another
  teacher.
- Installable as a PWA (add to home screen) and works offline.

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploying

This app is a static site (Vite build output in `dist/`) and deploys cleanly to Netlify, Vercel, or any static
host. A `netlify.toml` is included with the build command and SPA redirect already configured.

## Tech Stack

React + TypeScript + Vite, Tailwind CSS, `vite-plugin-pwa` for the manifest/service worker, `react-router-dom`
for routing, and `idb` for local IndexedDB persistence.

## Adding Your Own Content

- Add lessons and warm-ups directly in the app (Library → New Lesson / New Warm-Up).
- Seed content lives in `src/data/seedLessons.ts` and `src/data/seedWarmups.ts` if you want to edit or extend the
  built-in starter library in code.
