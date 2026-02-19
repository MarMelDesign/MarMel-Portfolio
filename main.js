const year = new Date().getFullYear();
const headerYear = document.getElementById('current-year');
const footerYear = document.getElementById('footer-year');
const toTopButton = document.getElementById('to-top');
const themeToggle = document.getElementById('theme-toggle');
const scrollHeader = document.getElementById('scroll-header');
const heroSection = document.querySelector('.hero');
const resumeLink = document.getElementById('resume-link');

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const useDarkMode = storedTheme ? storedTheme === 'dark' : prefersDark;

function animateYearCounter(element, startYear, endYear, durationMs) {
  if (!element) return;
  if (endYear <= startYear) {
    element.textContent = String(endYear);
    return;
  }

  const years = [];
  for (let y = startYear; y <= endYear + 2; y += 1) years.push(y);
  element.innerHTML = `<span class="year-track">${years
    .map((y) => `<span class="year-item">${y}</span>`)
    .join('')}</span>`;

  const track = element.querySelector('.year-track');
  const sampleItem = element.querySelector('.year-item');
  if (!track || !sampleItem) return;

  const step = sampleItem.getBoundingClientRect().height || 20;
  const maxIndex = endYear - startYear;
  const startTime = performance.now();
  const scale = durationMs > 0 ? durationMs / 2460 : 1;
  const fastTargetIndex = Math.max(0, maxIndex - 2);
  const holdStartMs = 320 * scale;
  const fastRunMs = 1200 * scale;
  const stepToNextMs = 420 * scale;
  const stepToFinalMs = 520 * scale;
  const totalMs = holdStartMs + fastRunMs + stepToNextMs + stepToFinalMs;

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function lerp(from, to, t) {
    return from + (to - from) * t;
  }

  function tick(now) {
    const elapsed = Math.min(totalMs, now - startTime);
    let currentIndex = 0;

    if (elapsed <= holdStartMs) {
      currentIndex = 0;
    } else if (elapsed <= holdStartMs + fastRunMs) {
      const t = (elapsed - holdStartMs) / fastRunMs;
      currentIndex = lerp(0, fastTargetIndex, easeInOutCubic(t));
    } else if (elapsed <= holdStartMs + fastRunMs + stepToNextMs) {
      const t = (elapsed - holdStartMs - fastRunMs) / stepToNextMs;
      currentIndex = lerp(fastTargetIndex, Math.min(fastTargetIndex + 1, maxIndex), t);
    } else {
      const t = (elapsed - holdStartMs - fastRunMs - stepToNextMs) / stepToFinalMs;
      currentIndex = lerp(Math.min(fastTargetIndex + 1, maxIndex), maxIndex, t);
    }

    track.style.transform = `translate3d(0, ${-currentIndex * step}px, 0)`;

    if (elapsed < totalMs) {
      window.requestAnimationFrame(tick);
    } else {
      track.style.transform = `translate3d(0, ${-maxIndex * step}px, 0)`;
    }
  }

  window.requestAnimationFrame(tick);
}

function setTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  if (themeToggle) {
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }
  if (resumeLink) {
    resumeLink.setAttribute('href', isDark ? 'ResumeDark.pdf' : 'Resume.pdf');
  }
}

if (headerYear) {
  animateYearCounter(headerYear, 2018, year, 2460);
}
if (footerYear) footerYear.textContent = year;
setTheme(useDarkMode);
if (toTopButton) {
  toTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    setTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

const parallaxItems = Array.from(document.querySelectorAll('.project .image'));
let ticking = false;

function updateParallax() {
  ticking = false;
  const viewportHeight = window.innerHeight || 0;

  parallaxItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distanceFromCenter = (center - viewportHeight / 2) / viewportHeight;
    const depth = (index % 2 === 0 ? 1 : -1) * 50;
    const offset = Math.max(-1, Math.min(1, distanceFromCenter)) * depth;
    item.style.transform = `translate3d(0, ${offset}px, 0)`;
    item.classList.add('project-parallax');
  });
}

function onScroll() {
  if (scrollHeader && heroSection) {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    scrollHeader.classList.toggle('visible', heroBottom <= 80);
  }
  if (toTopButton) {
    toTopButton.classList.toggle('visible', window.scrollY > 320);
  }
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
updateParallax();
onScroll();
