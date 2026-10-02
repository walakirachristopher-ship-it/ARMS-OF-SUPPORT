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

// ---------- SITE SETTINGS (every page) ----------
async function applySiteSettings() {
  const site = await loadJSON('/content/site.json');
  if (!site) return;
  document.querySelectorAll('[data-site="org_name"]').forEach(el => el.textContent = site.org_name);
  document.querySelectorAll('[data-site="tagline"]').forEach(el => el.textContent = site.tagline);
  document.querySelectorAll('[data-site="email"]').forEach(el => el.textContent = site.email);
  document.querySelectorAll('[data-site="phone"]').forEach(el => el.textContent = site.phone);
  document.querySelectorAll('[data-site="address"]').forEach(el => el.textContent = site.address);
  if (site.facebook) document.querySelectorAll('[data-site="facebook"]').forEach(el => el.href = site.facebook);
  if (site.instagram) document.querySelectorAll('[data-site="instagram"]').forEach(el => el.href = site.instagram);
  if (site.twitter) document.querySelectorAll('[data-site="twitter"]').forEach(el => el.href = site.twitter);
  if (site.youtube) document.querySelectorAll('[data-site="youtube"]').forEach(el => el.href = site.youtube);
}

// ---------- HOMEPAGE ----------
async function applyHome() {
  const home = await loadJSON('/content/home.json');
  if (!home) return;
  document.querySelectorAll('[data-home="hero_title"]').forEach(el => el.textContent = home.hero_title);
  document.querySelectorAll('[data-home="hero_subtitle"]').forEach(el => el.textContent = home.hero_subtitle);
  document.querySelectorAll('[data-home="hero_button"]').forEach(el => el.textContent = home.hero_button);
  if (home.stats) {
    const statsContainer = document.querySelector('[data-home="stats"]');
    if (statsContainer) {
      statsContainer.innerHTML = home.stats.map(s =>
        `<div class="stat"><div class="stat-number">${s.number}</div><div class="stat-label">${s.label}</div></div>`
      ).join('');
    }
  }
}

// ---------- ABOUT PAGE ---------
async function applyAbout() {
  const about = await loadJSON('/content/about.json');
  if (!about) return;
  document.querySelectorAll('[data-about="intro"]').forEach(el => el.textContent = about.intro);
  document.querySelectorAll('[data-about="vision"]').forEach(el => el.textContent = about.vision);
  document.querySelectorAll('[data-about="mission"]').forEach(el => el.textContent = about.mission);
  document.querySelectorAll('[data-about="partnership"]').forEach(el => el.textContent = about.partnership);
  if (about.values) {
    const valuesBox = document.querySelector('[data-about="values"]');
    if (valuesBox) {
      valuesBox.innerHTML = about.values.map(v => `<li>${v}</li>`).join('');
    }
  }
}

// ---------- RUN ----------
document.addEventListener('DOMContentLoaded', () => {
  applySiteSettings();
  applyHome();
  applyAbout();
});
