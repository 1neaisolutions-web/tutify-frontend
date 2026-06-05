# i18n runtime QA checklist

Run after changing locale JSON files or running `npm run i18n:merge-all`.

## Dev server

1. **Restart** `npm run dev` — locale bundles load via eager `import.meta.glob`; Vite does not hot-reload `src/locales/**`.
2. Hard-refresh the browser (Ctrl+Shift+R).

## Browser console (with target language selected in Settings)

```js
// Should be full BCP-47 tag, e.g. ar-SA — not en-US or bare "ar"
i18n.language

// Spot checks (Arabic example)
i18n.t('analyticsPage.title')        // not "Content Analytics"
i18n.t('grammarWritingMentor.tabs.grammar')
i18n.t('nav.teacherTools')           // no "????"
```

## Redux

- `preferences.language` in Redux should match Settings (e.g. `ar-SA`).
- If console shows `en-US` after login, check profile preferences overwriting selection in `App.tsx` / `loadFromProfile`.

## Manual routes

| Route | What to verify |
|-------|----------------|
| `/analytics` | Title, period chips, KPI labels, chart legend |
| `/history` | Hero, filters, source type chips, date presets |
| `/administration/assessment` | Title, status filters, stat cards |
| `/admin/content-packs` | Title, search, modals |
| `/use-cases` | Hero, categories, template titles |
| `/chatbots` | Hub cards |
| Each `/chatbots/<slug>` | Hero, stats, **every tab** label and panel chrome |

API-generated analysis text inside result panels may remain in the response language.
