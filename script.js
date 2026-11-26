// ===== COLLECTION TOGGLE =====
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

// ===== FAQ =====
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

// ===== HAMBURGER / MOBILE NAV =====
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

// ===== WATCH BUTTON =====
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

// ===== MOVIES FILTER =====
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

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(mode) {
  if (mode === 'light') {
    document.body.classList.add('light-mode');
    if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light-mode');
    if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
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

// ===== PROFILE DROPDOWN =====
const profileWrapper = document.querySelector('.profile-wrapper');
const navAvatar = document.getElementById('navAvatar');
const profileDropdown = document.getElementById('profileDropdown');
const dropdownAvatar = document.getElementById('dropdownAvatar');
const dropdownName = document.getElementById('dropdownName');
const changePicBtn = document.getElementById('changePicBtn');
const profilePicInput = document.getElementById('profilePicInput');
const myProfileBtn = document.getElementById('myProfileBtn');
const settingsBtn = document.getElementById('settingsBtn');
const logoutBtn = document.getElementById('logoutBtn');


function syncProfileUI() {
  const saved = JSON.parse(localStorage.getItem('movieUser') || 'null');
  const savedPic = localStorage.getItem('userProfilePic');
  const pic = savedPic || (saved && saved.avatar);

  if (pic) {
    if (navAvatar) navAvatar.src = pic;
    if (dropdownAvatar) dropdownAvatar.src = pic;
  }
  if (saved && dropdownName) {
    dropdownName.textContent = saved.name || saved.username || saved.email || 'My Profile';
  }
}
syncProfileUI();

if (profileWrapper) {
  profileWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('hidden');
    profileWrapper.classList.toggle('open');
  });
}

if (profileDropdown) {
  profileDropdown.addEventListener('click', (e) => e.stopPropagation());
}

document.addEventListener('click', () => {
  if (profileDropdown) profileDropdown.classList.add('hidden');
  if (profileWrapper) profileWrapper.classList.remove('open');
});


document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (profileDropdown) profileDropdown.classList.add('hidden');
    if (profileWrapper) profileWrapper.classList.remove('open');
  }
});

if (changePicBtn && profilePicInput) {
  changePicBtn.addEventListener('click', () => profilePicInput.click());

  profilePicInput.addEventListener('change', () => {
    const file = profilePicInput.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please pick an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;

      if (navAvatar) navAvatar.src = dataUrl;
      if (dropdownAvatar) dropdownAvatar.src = dataUrl;

      localStorage.setItem('userProfilePic', dataUrl);

      const saved = JSON.parse(localStorage.getItem('movieUser') || 'null');
      if (saved) {
        saved.avatar = dataUrl;
        localStorage.setItem('movieUser', JSON.stringify(saved));
      }

      // Close dropdown
      profileDropdown.classList.add('hidden');
      profileWrapper.classList.remove('open');
    };
    reader.readAsDataURL(file);
  });
}

if (myProfileBtn) {
  myProfileBtn.addEventListener('click', () => {
    profileDropdown.classList.add('hidden');
    profileWrapper.classList.remove('open');
   
    const saved = JSON.parse(localStorage.getItem('movieUser') || 'null');
    if (saved) {
      alert(`Name: ${saved.name || saved.username || 'User'}\nEmail: ${saved.email || 'Not set'}`);
    } else {
      alert('My Profile - coming soon!');
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
  
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('movieUser');
    window.location.href = 'login.html';
  });
}