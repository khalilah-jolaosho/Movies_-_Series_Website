document.getElementById('go-to-series').addEventListener('click', () => {
    
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('go-to-series').classList.add('active');

  document.getElementById('series-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('go-to-movies').addEventListener('click', () => {
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('go-to-movies').classList.add('active');

  document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' });
});

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

  hamburger.addEventListener('click', () => {
    navBar.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    navBar.classList.remove('active');
  });

  document.querySelectorAll('.nav-bar a').forEach(link => {
    link.addEventListener('click', () => {
      navBar.classList.remove('active');
    });
  });