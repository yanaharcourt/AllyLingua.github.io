/*--------------------------------------------------------------
# LANGUAGE SWITCHER ENGINE
# Reads translations from a page-level I18N dictionary and swaps
# text via data-i18n / data-i18n-alt / data-i18n-placeholder /
# data-i18n-title attributes. RU is the default/fallback language.
--------------------------------------------------------------*/
(function () {
  const STORAGE_KEY = 'ally-lang';

  function getInitialLang() {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'en' || urlLang === 'ru') return urlLang;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ru') return stored;
    return 'ru';
  }

  function t(key, lang) {
    const entry = window.I18N && window.I18N[key];
    if (!entry) return null;
    return entry[lang] != null ? entry[lang] : entry.ru;
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.body.classList.toggle('lang-en', lang === 'en');
    document.body.classList.toggle('lang-ru', lang === 'ru');

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = t(el.getAttribute('data-i18n'), lang);
      if (val != null) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const val = t(el.getAttribute('data-i18n-alt'), lang);
      if (val != null) el.setAttribute('alt', val);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const val = t(el.getAttribute('data-i18n-title'), lang);
      if (val != null) el.setAttribute('title', val);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const val = t(el.getAttribute('data-i18n-placeholder'), lang);
      if (val != null) el.setAttribute('placeholder', val);
    });
    document.querySelectorAll('[data-i18n-href]').forEach(el => {
      const val = t(el.getAttribute('data-i18n-href'), lang);
      if (val != null) el.setAttribute('href', val);
    });

    document.querySelectorAll('.language-text').forEach(el => {
      el.textContent = lang === 'en' ? 'RU' : 'EN';
    });
    document.querySelectorAll('.language-btn').forEach(el => {
      el.setAttribute('title', lang === 'en' ? 'Переключить на русский' : 'Switch to English');
      el.setAttribute('aria-label', lang === 'en' ? 'Переключить на русский' : 'Switch to English');
    });

    if (window.I18N_META) {
      const meta = window.I18N_META[lang];
      if (meta) {
        if (meta.title) document.title = meta.title;
        const setMeta = (selector, attr, value) => {
          const el = document.querySelector(selector);
          if (el && value) el.setAttribute(attr, value);
        };
        setMeta('meta[name="description"]', 'content', meta.description);
        setMeta('meta[property="og:title"]', 'content', meta.title);
        setMeta('meta[property="og:description"]', 'content', meta.description);
        setMeta('meta[property="og:locale"]', 'content', lang === 'en' ? 'en_GB' : 'ru_RU');
        setMeta('meta[property="og:locale:alternate"]', 'content', lang === 'en' ? 'ru_RU' : 'en_GB');
        setMeta('meta[name="twitter:title"]', 'content', meta.title);
        setMeta('meta[name="twitter:description"]', 'content', meta.description);
      }
    }

    if (typeof window.onLangChange === 'function') window.onLangChange(lang);

    localStorage.setItem(STORAGE_KEY, lang);
    window.currentLang = lang;
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  window.setLang = applyLang;
  window.toggleLang = function () {
    applyLang(window.currentLang === 'en' ? 'ru' : 'en');
  };

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(getInitialLang());
  });
})();
