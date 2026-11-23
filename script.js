
const goToSeries = document.getElementById('go-to-series');
if (goToSeries) {
  goToSeries.addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    goToSeries.classList.add('active');

    const section = document.getElementById('series-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  });
}

const goToMovies = document.getElementById('go-to-movies');
if (goToMovies) {
  goToMovies.addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    goToMovies.classList.add('active');

    const section = document.getElementById('movies-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  });
}

document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

    if (!isOpen) {
      item.classList.add('active');
    }
  });
});

const hamburger = document.getElementById('hamburger');
const navBar = document.getElementById('navBar');
const closeBtn = document.getElementById('closeBtn');

if (hamburger && navBar) {
  hamburger.addEventListener('click', () => {
    navBar.classList.add('active');
  });
}

if (closeBtn && navBar) {
  closeBtn.addEventListener('click', () => {
    navBar.classList.remove('active');
  });
}

if (navBar) {
  document.querySelectorAll('.nav-bar a').forEach(link => {
    link.addEventListener('click', () => {
      navBar.classList.remove('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const watchBtn = document.querySelector('.btn-watch');
  
  if (watchBtn) {
    watchBtn.addEventListener('click', () => {
      setTimeout(() => {
        if (typeof movies !== 'undefined' && movies && movies.length > 0 && movies[0].url) {
          window.open(movies[0].url, '_blank');
        } else {
          alert('Movies are still loading, please try again in 2 seconds');
        }
      }, 500);
    });
  }
});

document.querySelectorAll('.movies-filters .genre').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.movies-filters .genre').forEach(b => b.classList.remove('active'));
    button.classList.add('active');

    let genre = button.textContent.trim();
    if (genre === 'Sci-Fi') genre = 'SciFi';

    document.querySelectorAll('.movies-grid .movie-card').forEach(card => {
      if (card.dataset.category === genre) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});


const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(mode) {
  if (mode === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light-mode');
    themeIcon.className = 'fa-solid fa-sun';
    localStorage.setItem('theme', 'dark');
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    setTheme(isLight ? 'dark' : 'light');
  });
  if (localStorage.getItem('theme') === 'light') setTheme('light');
}