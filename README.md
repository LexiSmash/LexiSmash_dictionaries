<div align="center">
<h1>📚 LexiSmash Dictionaries 🔤</h1>

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/ea5bb43b81884e5d89f4b7094b0b0615)](https://app.codacy.com/gh/R0mb0/LexiSmash_dictionaries/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![pages-build-deployment](https://github.com/R0mb0/LexiSmash_dictionaries/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/R0mb0/LexiSmash_dictionaries/actions/workflows/pages/pages-build-deployment)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/R0mb0/LexiSmash_dictionaries)
[![Open Source Love svg3](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/R0mb0/LexiSmash_dictionaries)
![License](https://img.shields.io/badge/license-CC0%201.0-blue.svg?style=plastic)
[![Donate](https://img.shields.io/badge/PayPal-Donate%20to%20Author-blue.svg)](http://paypal.me/R0mb0)

<p>
The official word dictionaries powering <a href="https://lexismash.it"><strong>LexiSmash</strong></a>, a multiplayer word party game — <strong>6 languages</strong>, over <strong>400,000 words each</strong>, plus a standalone browser-based explorer to search, filter and double-check every entry before proposing a fix. 🚀
</p>

<div align="center">
  <a href="http://paypal.me/R0mb0">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/R0mb0/Support_the_dev_badge/blob/main/Badge/SVG/Support_the_dev_badge_Dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://github.com/R0mb0/Support_the_dev_badge/blob/main/Badge/SVG/Support_the_dev_badge_Light.svg">
      <img alt="Saved you time? Support the dev" src="https://github.com/R0mb0/Support_the_dev_badge/blob/main/Badge/SVG/Support_the_dev_badge_Default.svg">
    </picture>
  </a>
</div>

## [👉 Click here to open the Explorer! 👈](https://r0mb0.github.io/LexiSmash_dictionaries/)

</div>
<hr>

<h2>🚀 Features</h2>
<ul>
<li><strong>6 languages, one format</strong>: Italian, English, French, German, Spanish and Dutch, each as a single flat JSON file mapping every valid word to its grammatical category.</li>
<li><strong>Standalone Explorer</strong>: a zero-dependency HTML/CSS/JS page (no build step, no game code) to search and browse every dictionary directly in the browser — the same search logic the real game uses, with a distinct "documentation" look so it's never confused with LexiSmash itself.</li>
<li><strong>Instant prefix search</strong>: type-ahead search over 400,000+ entries per language, powered by binary search over a pre-sorted, accent-stripped index — no lag, no server round-trip.</li>
<li><strong>Per-language licensing, done properly</strong>: the data isn't blanket-licensed. Each language's original source and license (LGPL-LR, CC BY-SA, CC BY/BSD…) is documented and kept separate from the code license — see [`docs/dictionaries/LICENSES.md`](docs/dictionaries/LICENSES.md).</li>
<li><strong>Open for corrections</strong>: every entry can be challenged. Missing a word? Found a wrong category? Open a Pull Request — every proposal is reviewed by hand before merging.</li>
</ul>

<h2>🛠️ How it works</h2>
<ol>
<li><strong>Data format:</strong> each `docs/dictionaries/{lang}.json` file is a flat object — `"WORD": "category"` — with words always in UPPERCASE, matching exactly how the game's engine compares guesses.</li>
<li><strong>Categories:</strong> every word falls into one of six categories: `nouns`, `verbs`, `adj` (adjectives), `proper` (proper nouns), `sigle` (acronyms/initialisms), `other` (everything else — articles, prepositions, interjections…).</li>
<li><strong>Explorer search:</strong> on load, `app.js` fetches the selected language's JSON, strips accents and builds a sorted index once, then answers every keystroke with a binary-search prefix lookup instead of scanning the full list.</li>
<li><strong>GitHub Pages:</strong> the whole `docs/` folder is served as-is — no build, no bundler, no dependency — so the Explorer, and the raw JSON dictionaries themselves, are always one click away for anyone who wants to inspect them.</li>
</ol>

<h2>💡 Why this repository exists</h2>
<ul>
<li><strong>Transparency</strong>: the real LexiSmash game repository is private, but the dictionaries that decide whether a word is valid shouldn't be a black box — anyone can check exactly which words are in or out, for any of the 6 languages.</li>
<li><strong>Community corrections</strong>: dictionaries are never perfect. A missing regional word, a mis-tagged category, a word that shouldn't be valid — this repository is where anyone can propose the fix, not just the author.</li>
<li><strong>Reuse</strong>: the JSON files are plain, well-documented word lists with sources and licenses attached — useful on their own for other word games, NLP experiments, or linguistic research, independent of LexiSmash.</li>
</ul>

<h2>⚡ Getting Started</h2>

<h3>Online</h3>
<p>Just open the <a href="https://r0mb0.github.io/LexiSmash_dictionaries/">Explorer</a> — pick a language, type a word, done.</p>

<h3>Local installation</h3>
<p>The Explorer fetches JSON files, so opening <code>index.html</code> directly (double-click) won't work — browsers block local JSON loading over <code>file://</code>. Serve it with any static server instead:</p>

```bash
cd docs
python3 -m http.server
# then open http://localhost:8000/ in your browser
```

<h2>📂 Repository structure</h2>

```
LexiSmash_dictionaries/
├── README.md, LICENSE, CONTRIBUTING.md   ← repo-only, never published
└── docs/                                  ← everything public, served by GitHub Pages
    ├── index.html, app.js, style.css      ← the standalone Explorer
    └── dictionaries/                      ← the actual data, one JSON file per language
        ├── LICENSES.md
        └── it.json, en.json, fr.json, de.json, es.json, nl.json
```

Same convention used by the main LexiSmash game repository (`docs/` = public site, everything else stays in the repository): there's nothing to hide here — the whole point of `docs/` is to be public — but the separation keeps this repository consistent with the other one.

<h2>🌍 Where the words come from</h2>
<p>
Every list started from public, open sources for its language, then was corrected and curated by hand over time by <a href="https://github.com/R0mb0">Francesco Rombaldoni</a> (LexiSmash's creator) to fit the game: missing words added, clearly wrong entries removed, categories assigned or fixed where needed. This repository exists specifically to keep doing that work in the open, with anyone's help.
</p>
<p>
<strong>Exact sources per language</strong>: see <a href="docs/dictionaries/LICENSES.md">docs/dictionaries/LICENSES.md</a> for the full detail. In short, every language started from an existing open lexicon, then was corrected and re-categorized by hand: French from <strong>Lefff</strong>, Spanish from <strong>FreeLing</strong>, German nouns from <strong>german-nouns</strong>/WiktionaryDE, Dutch from <strong>OpenTaal</strong> + <strong>dutch-pos-dict</strong>, Italian from <strong>Morph-it!</strong> (Baroni &amp; Zanchetta, Università di Bologna), and English from <strong>The SPECIALIST Lexicon</strong> (U.S. National Library of Medicine / UMLS).
</p>

<h2>🤝 Contributing</h2>
<p>
See <a href="CONTRIBUTING.md">CONTRIBUTING.md</a> for the full guide. Short version: open a Pull Request that adds, removes or corrects one or more entries in a language's JSON file, explaining why. Every proposal is reviewed by hand before being merged — don't expect an instant or automatic merge.
</p>

<h2>🔗 Relationship to the game</h2>
<p>
This repository is the <strong>editorial source of truth</strong> for the dictionaries. The real game (a separate, private repository) periodically imports the corrections accepted here — the two aren't automatically linked, so an accepted correction here isn't live in-game until the next import.
</p>

<h2>📄 License</h2>
<p>Two different licenses apply here, because they cover different things:</p>
<ul>
<li><strong>Code</strong> (the standalone Explorer in <code>docs/</code>, this README, <code>CONTRIBUTING.md</code>) is original work released into the public domain under <a href="LICENSE">CC0 1.0 Universal</a> — use it, modify it, redistribute it, no permission needed.</li>
<li><strong>Data</strong> (the files inside <code>docs/dictionaries/</code>) is <strong>not</strong> uniformly licensed: it derives from different external lexicons, each keeping its own original license (LGPL-LR, CC BY-SA, CC BY/BSD, CC BY-SA/LGPL, Public Domain — depending on the language) — see <a href="docs/dictionaries/LICENSES.md">docs/dictionaries/LICENSES.md</a> for the exact per-language terms and required attribution. If you reuse the data outside this project, respect the specific license of the language you're using — not a generic "CC0".</li>
</ul>


<br>

<a href="https://github.com/R0mb0/Crafted_with_AI">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/CraftedWithAIDark.svg">
<source media="(prefers-color-scheme: light)" srcset="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/NotMadeByAILight.svg">
<img alt="Crafted with AI" src="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/CraftedWithAIDefault.svg">
</picture>
</a>
