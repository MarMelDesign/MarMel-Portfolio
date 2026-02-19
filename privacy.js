const themeToggle = document.getElementById('theme-toggle');
const footerYear = document.getElementById('footer-year');
const updatedDate = document.getElementById('privacy-last-updated');

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const useDarkMode = storedTheme ? storedTheme === 'dark' : prefersDark;

function setTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  if (themeToggle) {
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }
}

setTheme(useDarkMode);

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

if (updatedDate) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  updatedDate.textContent = formattedDate;
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    setTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}
