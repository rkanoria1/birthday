# Somya's Birthday Storybook

A private, passcode-gated birthday story for October 6, 2026. The experience is
mobile-first and moves through a sealed letter, portrait opening, photo mosaic,
personal observations, playful interactions, heartfelt letters, and a final
real-world surprise.

## Running locally

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use
npm install
npm run dev
```

Open http://localhost:3000.

## Filling in real content

Edit `src/content/site.ts` for all copy, photo paths, focal points, accessible
descriptions, the passcode, and audio metadata.

Use [the content checklist](docs/content/somya-content-checklist.md) to place and
review Somya's photographs. Missing images show a designed paper placeholder,
so they can be added incrementally.

Add a licensed or personally permitted song to `public/audio/song.mp3`. Music
starts only after the visitor presses the play control.

## Running tests

```bash
npm test
npm run lint
npm run build
```

## Deploying

Deploy to Vercel and keep the resulting URL unlisted/private. The passcode is a
ceremonial part of the gift, not real authentication. Verify the deployed build
on a real phone before sharing it.
