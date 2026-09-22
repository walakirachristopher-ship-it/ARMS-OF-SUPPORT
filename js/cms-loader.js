// cms-loader.js — Loads content from CMS content files
async function loadJSON(path) {
    try {
        const res = await fetch(path + '?v=' + Date.now());
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.warn('Could not load', path, e);
        return null;
    }
}

async function applySiteSettings() {
    const site = await loadJSON('/content/site.json');
    if (!site) return;
    document.querySelectorAll('[data-site="org_name"]').forEach(el => el.textContent = site.org_name);
    document.querySelectorAll('[data-site="tagline"]').forEach(el => el.textContent = site.tagline);
    document.querySelectorAll('[data-site="email"]').forEach(el => el.textContent = site.email);
    document.querySelectorAll('[data-site="phone"]').forEach(el => el.textContent = site.phone);
    document.querySelectorAll('[data-site="address"]').forEach(el => el.textContent = site.address);
}

document.addEventListener('DOMContentLoaded', applySiteSettings);
