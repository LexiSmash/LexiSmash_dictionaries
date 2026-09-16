// =================================================================
// docs/app.js
// -----------------------------------------------------------------
// Standalone dictionary browser for the LexiSmash_dictionaries repo.
// Same filtering/search LOGIC as the in-game "Dictionary" page
// (LexiSmash's own js/dictionary.js), ported here without any
// dependency on the game itself: no config.json fetch, no i18n
// engine, no game CSS. Reads the JSON files straight from
// ./dictionaries/<lang>.json (relative to this folder — this file
// lives at the root of the published site, GitHub Pages source is
// this "docs/" folder, same convention as the main LexiSmash repo),
// so this works as soon as the repo is served over http(s) — e.g.
// GitHub Pages, or any local static server (`python3 -m http.server`).
//
// Why a binary search instead of a simple .filter(): the six
// dictionaries together hold well over two million entries. Sorting
// each language once on load and searching by prefix with a binary
// search (O(log n) instead of scanning the whole list on every
// keystroke) keeps typing responsive even on this much data.
// =================================================================

// Per-language metadata: flag, native name, and which categories this
// language's data actually distinguishes (mirrors config.json ->
// languages in the game repository).
const LANG_ORDER = ['it', 'en', 'fr', 'de', 'es', 'nl'];
const LANG_META = {
    it: { flag: '🇮🇹', name: 'Italian', categories: ['nouns', 'verbs', 'adj', 'proper', 'sigle', 'other'] },
    en: { flag: '🇬🇧', name: 'English', categories: ['nouns', 'verbs', 'adj', 'proper', 'other'] },
    fr: { flag: '🇫🇷', name: 'French', categories: ['nouns', 'verbs', 'adj', 'proper', 'other'] },
    de: { flag: '🇩🇪', name: 'German', categories: ['nouns'] },
    es: { flag: '🇪🇸', name: 'Spanish', categories: ['nouns', 'verbs', 'adj', 'other'] },
    nl: { flag: '🇳🇱', name: 'Dutch', categories: ['nouns', 'verbs', 'adj', 'proper', 'other'] }
};
const CATEGORY_LABELS = { nouns: 'Noun', verbs: 'Verb', adj: 'Adjective', proper: 'Proper noun', sigle: 'Abbreviation', other: 'Other' };
const CATEGORY_KEYS = ['nouns', 'verbs', 'adj', 'proper', 'sigle', 'other'];

// Some languages list a "Proper noun" filter in the UI for symmetry,
// but their actual word list never tags anything as "proper" (see
// dictionaries/LICENSES.md for why, per language) — ticking that box
// falls back to matching "nouns" instead of returning zero rows.
const LANGS_WITHOUT_PROPER_CATEGORY = new Set(['en', 'es', 'de']);

const MAX_RESULTS = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 120 : 220;

// =================================================================
// DOM references
// =================================================================
const searchInput = document.getElementById('search-input');
const resultsBody = document.getElementById('results-body');
const resultsFooter = document.getElementById('results-footer');
const placeholderEl = document.getElementById('results-placeholder');
const langGridEl = document.getElementById('lang-selector-grid');
const langPanelsEl = document.getElementById('lang-panels-container');

const langCheckboxes = {};
const categoryPanels = {};
const dictData = {}; // { <lang>: { sorted: [{word, category, searchKey}, ...] } }
const currentRowEls = new Map();

// =================================================================
// Accent-insensitive search (typing "cafe" must also find "CAFÉ")
// =================================================================
const ACCENT_TO_BASE = {
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
    'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
    'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
    'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U'
};
function stripAccents(str) {
    let out = '';
    for (const ch of str) out += ACCENT_TO_BASE[ch] || ch;
    return out;
}

function buildSortedEntries(dictObject) {
    const entries = Object.keys(dictObject).map((word) => ({
        word,
        category: dictObject[word],
        searchKey: stripAccents(word)
    }));
    entries.sort((a, b) => {
        if (a.searchKey < b.searchKey) return -1;
        if (a.searchKey > b.searchKey) return 1;
        return a.word < b.word ? -1 : a.word > b.word ? 1 : 0;
    });
    return entries;
}

// =================================================================
// Language + category selector (built once on load)
// =================================================================
function renderLanguageSelector() {
    let gridHtml = '';
    let panelsHtml = '';

    LANG_ORDER.forEach((code, i) => {
        const meta = LANG_META[code];
        const isDefault = i === 0; // Italian pre-selected, same default as the in-game page

        gridHtml += `
            <label class="lang-card">
                <input type="checkbox" id="lang-${code}" ${isDefault ? 'checked' : ''}>
                <div class="lang-card-content">${meta.flag} ${meta.name}</div>
            </label>`;

        let catsHtml = '';
        CATEGORY_KEYS.forEach((cat) => {
            if (!meta.categories.includes(cat)) return;
            const checkedByDefault = cat !== 'proper'; // same default as the in-game page
            catsHtml += `<label><input type="checkbox" id="cat-${code}-${cat}" ${checkedByDefault ? 'checked' : ''}> ${CATEGORY_LABELS[cat]}</label>`;
        });

        panelsHtml += `
            <div id="panel-cat-${code}" class="category-panel${isDefault ? ' visible' : ''}">
                <div class="category-title">Categories (${meta.name})</div>
                <div class="categories-grid">${catsHtml}</div>
            </div>`;
    });

    langGridEl.innerHTML = gridHtml;
    langPanelsEl.innerHTML = panelsHtml;

    LANG_ORDER.forEach((code) => {
        langCheckboxes[code] = document.getElementById(`lang-${code}`);
        categoryPanels[code] = document.getElementById(`panel-cat-${code}`);
    });
}

async function init() {
    showPlaceholder('Loading dictionaries…');
    renderLanguageSelector();
    wireEvents();

    try {
        const results = await Promise.all(
            LANG_ORDER.map((code) => fetch(`./dictionaries/${code}.json`).then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status} for ${code}.json`);
                return res.json();
            }))
        );
        LANG_ORDER.forEach((code, i) => {
            dictData[code] = { sorted: buildSortedEntries(results[i]) };
        });
    } catch (error) {
        console.error('Failed to load dictionaries:', error);
        showPlaceholder('⚠️ Could not load the dictionary files. If you opened this page directly from disk (file://), serve this folder with a local web server instead (e.g. "python3 -m http.server") — browsers block loading local JSON files this way.');
        return;
    }

    updateCategoryPanelsVisibility();
    refreshResults();
}

// =================================================================
// Binary search by prefix
// =================================================================
function lowerBound(sortedArr, targetKey) {
    let lo = 0, hi = sortedArr.length;
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (sortedArr[mid].searchKey < targetKey) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
function findPrefixRange(sortedArr, prefix) {
    if (!prefix) return [0, sortedArr.length];
    const start = lowerBound(sortedArr, prefix);
    const end = lowerBound(sortedArr, prefix + '￿'); // highest BMP char: closes the prefix range
    return [start, end];
}

function getAllowedCategories(lang) {
    const allowed = new Set();
    CATEGORY_KEYS.forEach((cat) => {
        const el = document.getElementById(`cat-${lang}-${cat}`);
        if (el && el.checked) allowed.add(cat);
    });
    if (LANGS_WITHOUT_PROPER_CATEGORY.has(lang) && allowed.has('proper')) allowed.add('nouns');
    return allowed;
}

function queryLanguage(lang, prefix, maxNeeded) {
    const langData = dictData[lang];
    const results = [];
    let totalMatches = 0;
    if (!langData) return { results, totalMatches };

    const allowedCategories = getAllowedCategories(lang);
    if (allowedCategories.size === 0) return { results, totalMatches };

    const [start, end] = findPrefixRange(langData.sorted, prefix);
    for (let i = start; i < end; i++) {
        const entry = langData.sorted[i];
        if (allowedCategories.has(entry.category)) {
            totalMatches++;
            if (results.length < maxNeeded) results.push(entry);
        }
    }
    return { results, totalMatches };
}

function buildCategoryLabel(lang, category) {
    const label = CATEGORY_LABELS[category] || category;
    const flag = (LANG_META[lang] && LANG_META[lang].flag) || '';
    return `${flag} ${label}`;
}

function computeResults(prefix) {
    const activeLangs = Object.keys(langCheckboxes).filter((lang) => langCheckboxes[lang].checked);
    let combined = [];
    let totalMatches = 0;

    activeLangs.forEach((lang) => {
        const { results, totalMatches: langTotal } = queryLanguage(lang, prefix, MAX_RESULTS);
        totalMatches += langTotal;
        results.forEach((entry) => {
            combined.push({ key: `${lang}:${entry.word}`, word: entry.word, categoryLabel: buildCategoryLabel(lang, entry.category) });
        });
    });

    combined.sort((a, b) => (a.word < b.word ? -1 : a.word > b.word ? 1 : 0));
    const truncated = combined.length > MAX_RESULTS || totalMatches > combined.length;
    if (combined.length > MAX_RESULTS) combined = combined.slice(0, MAX_RESULTS);
    return { items: combined, totalMatches, truncated };
}

// =================================================================
// Row rendering with enter/exit animation (CSS Grid rows, not a
// <table>, so each row's height can be animated reliably)
// =================================================================
function createRowEl(item) {
    const row = document.createElement('div');
    row.className = 'result-row row-enter';
    const wordCell = document.createElement('div');
    wordCell.className = 'row-word';
    wordCell.textContent = item.word;
    const catCell = document.createElement('div');
    catCell.className = 'row-category';
    catCell.textContent = item.categoryLabel;
    row.appendChild(wordCell);
    row.appendChild(catCell);
    return row;
}
function exitRow(el) {
    el.classList.add('row-exit');
    const remove = () => el.remove();
    el.addEventListener('transitionend', remove, { once: true });
    setTimeout(remove, 500);
}
function renderResults(items) {
    const newKeys = new Set(items.map((i) => i.key));
    currentRowEls.forEach((el, key) => {
        if (!newKeys.has(key)) { exitRow(el); currentRowEls.delete(key); }
    });
    let prevEl = null;
    items.forEach((item) => {
        let el = currentRowEls.get(item.key);
        if (!el) {
            el = createRowEl(item);
            currentRowEls.set(item.key, el);
            if (prevEl) prevEl.insertAdjacentElement('afterend', el);
            else resultsBody.insertAdjacentElement('afterbegin', el);
            requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('row-enter')));
        } else if (prevEl && prevEl.nextElementSibling !== el) {
            prevEl.insertAdjacentElement('afterend', el);
        } else if (!prevEl && resultsBody.firstElementChild !== el) {
            resultsBody.insertAdjacentElement('afterbegin', el);
        }
        prevEl = el;
    });
}

function showPlaceholder(message) { placeholderEl.textContent = message; placeholderEl.style.display = 'flex'; }
function hidePlaceholder() { placeholderEl.style.display = 'none'; }
function setFooter(message) { resultsFooter.textContent = message || ''; }

function anyCategoryActive() {
    return Object.keys(langCheckboxes).some((lang) => langCheckboxes[lang].checked && getAllowedCategories(lang).size > 0);
}

function refreshResults() {
    if (LANG_ORDER.some((code) => !dictData[code])) return; // still loading

    const rawPrefix = searchInput.value.trim().toUpperCase();
    const prefix = stripAccents(rawPrefix);
    const { items, totalMatches, truncated } = computeResults(prefix);

    if (items.length === 0) {
        renderResults([]);
        setFooter('');
        if (!anyCategoryActive()) showPlaceholder('Pick at least one language and category to browse.');
        else if (rawPrefix) showPlaceholder(`No word starting with "${rawPrefix}" in the selected languages/categories.`);
        else showPlaceholder('No words match the selected categories.');
        return;
    }

    hidePlaceholder();
    renderResults(items);
    setFooter(truncated
        ? `Showing ${items.length} of ${totalMatches} matches — keep typing to narrow it down.`
        : `${totalMatches} ${totalMatches === 1 ? 'match' : 'matches'}`);
}

function updateCategoryPanelsVisibility() {
    LANG_ORDER.forEach((code) => {
        if (categoryPanels[code] && langCheckboxes[code]) {
            categoryPanels[code].classList.toggle('visible', langCheckboxes[code].checked);
        }
    });
}

function wireEvents() {
    Object.values(langCheckboxes).forEach((el) => {
        el.addEventListener('change', () => { updateCategoryPanelsVisibility(); refreshResults(); });
    });
    CATEGORY_KEYS.forEach((cat) => {
        LANG_ORDER.forEach((lang) => {
            const el = document.getElementById(`cat-${lang}-${cat}`);
            if (el) el.addEventListener('change', refreshResults);
        });
    });
    searchInput.addEventListener('input', refreshResults);
}

init();
