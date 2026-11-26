// login.js

function togglePassword(inputId, eyeIcon) {
  const input = document.getElementById(inputId);
  const icon = eyeIcon.querySelector('i');
  if (!input || !icon) return;
  if (input.type === "password") {
    input.type = "text";
    icon.className = "fa-solid fa-eye-slash";
  } else {
    input.type = "password";
    icon.className = "fa-solid fa-eye";
  }
}

function doLogin() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorEl = document.getElementById('loginError');

  if (!username || !password) {
    errorEl.textContent = "Please fill all fields";
    return;
  }

  const savedUser = JSON.parse(localStorage.getItem('movieUser') || 'null');

  if (!savedUser) {
    errorEl.textContent = "No account found. Please sign up first.";
    return;
  }

  if (username !== savedUser.username || password !== savedUser.password) {
    errorEl.textContent = "Wrong username or password";
    return;
  }

  // Save login state
  localStorage.setItem('isLoggedIn', 'true');
  errorEl.textContent = "";

  document.getElementById('loginUsernameShow').textContent = "Welcome back, " + username;
  document.getElementById('loginAvatar').src = savedUser.avatar || "assets/profile-1.svg";

  document.getElementById('loginStep1').classList.remove('active');
  document.getElementById('loginStep2').classList.add('active');

  document.querySelector('.auth-container').classList.add('profile-mode');
}

function goToHome() {
  window.location.href = "index.html";
}