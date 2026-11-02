# News Portal

A news reader built on [News API](https://newsapi.org/): pick one of 125 sources and read its latest stories.
RS School task [News API: migration to TypeScript](https://github.com/rolling-scopes-school/tasks/blob/master/fullstack-engineering/tasks/TS-news-api/migration-newip-to-ts.md).

**Live demo:** https://denystoneone1.github.io/news-JS/

![News Portal screenshot](docs/screenshot.jpg)

## Features

- Opens with BBC News, so the page is never empty
- Search by source name in the header, with keyboard support (arrows, Enter, Escape)
- Ten popular sources in the header and a modal with all sources, grouped A to Z, with logos and a category filter
- Lead story, three secondary stories and a grid, like on news portals
- Every category has its own color: section heading, source marker, loading bar, placeholder for stories without a picture
- Loading indicator and a message for sources with no recent stories
- Adaptive layout from 320px to 1920px
- Keyboard friendly: sources are buttons, every story is a single link with a visible focus outline

## Tech stack

TypeScript (strict), Webpack 5, ESLint with `@typescript-eslint`, Prettier, plain CSS. No frameworks.

## Getting started

Requirements: Node.js 18+ and [pnpm](https://pnpm.io/).

```bash
git clone git@github.com:denystoneone1/news-JS.git
cd news-JS
git checkout news-api
pnpm install
cp .env.example .env
```

Open `.env` and set your key from [newsapi.org](https://newsapi.org/register):

```
API_URL=https://newsapi.org/v2/
API_KEY=your_key
```

News API answers only to `localhost`. To save the free quota (100 requests a day) during development, you can use the RS School proxy with static data: `API_URL=https://rss-news-api.onrender.com/mocks/`.

```bash
pnpm start
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm start` | Dev server with live reload |
| `pnpm build` | Production build into `dist/` with `API_URL` from `.env` |
| `pnpm build:deploy` | Production build that uses the proxy `https://rss-news-api.onrender.com/` (News API does not answer other domains) |
| `pnpm deploy` | `build:deploy` and publish `dist/` to the `gh-pages` branch |
| `pnpm lint` | ESLint for all `.ts` files |

## Project structure

```
src/
├── index.ts                     entry point
├── index.html                   layout and templates
├── global.css                   design tokens, header, section heading, footer
├── config.ts                    top sources, default source, logo overrides
├── types/
│   ├── index.ts                 API interfaces, enums, union types
│   └── css.d.ts                 lets TypeScript import .css files
├── utils/
│   ├── dom.ts                   getElement<T>(): querySelector with a null check
│   └── date.ts                  date formatting with Intl.DateTimeFormat
├── assets/                      favicon, RS School logo
└── components/
    ├── app/app.ts               source selection, default source, request order
    ├── controller/
    │   ├── loader.ts            generic fetch wrapper
    │   ├── appLoader.ts         API URL and key
    │   └── controller.ts        getSources(), getNews(sourceId)
    └── view/
        ├── appView.ts           connects all views
        ├── news/                stories, loading and empty states
        ├── sources/             popular sources, shared source button with logo
        ├── search/              header search with suggestions
        └── catalog/             modal with all sources
```

## TypeScript

| Requirement | Where |
|---|---|
| Interfaces | `Source`, `Article`, `SourcesResponse`, `ArticlesResponse`, `QueryOptions`, `RequestParams` in `types/index.ts` |
| Enums | `Endpoint`, `HttpStatus` |
| Union types | `ResponseStatus`, `HttpMethod`, `Category`, `CategoryFilter`, `string \| null` fields |
| Generics | `Loader.getResp<T>()`, `Callback<T>`, `getElement<T extends Element>()`, `Map<Category, number>` |
| Utility types | `Partial<QueryOptions>`, `Pick<Source, 'name'>`, `Readonly<Article[]>`, `Readonly<Record<...>>` |
| Access modifiers | `private readonly` fields, `public` API and `private` helpers in every class |
| Function types | `type Callback<T> = (data: T) => void`, typed parameters and return values everywhere |
| `as const` | `TOP_SOURCE_IDS` and `type TopSourceId = (typeof TOP_SOURCE_IDS)[number]` |

`tsconfig.json` has `"strict": true` and `"noImplicitAny": true`. ESLint has `@typescript-eslint/no-explicit-any: "error"`. There is no `any` in the code.

## Design

Ideas taken from news portals: section colors from The Guardian, a serif headline with a Franklin sans for the interface from The New York Times, a nameplate with the date from print newspapers, a list with the picture on the right from the BBC mobile app.

Fonts: [Newsreader](https://fonts.google.com/specimen/Newsreader) and [Libre Franklin](https://fonts.google.com/specimen/Libre+Franklin).

## Known API limits

- Some sources return no stories on the free plan (for example ABC News). The app shows a message.
- `bbc-sport` returns BBC News stories. This happens on the API side.
- The deployed version needs an API key in the bundle: the proxy does not work without it.

## Author

[denystoneone1](https://github.com/denystoneone1), 2026
