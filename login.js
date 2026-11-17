function togglePassword(inputId, eyeIcon) {
  const input = document.getElementById(inputId);
  const icon = eyeIcon.querySelector('i');
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

  // Get the user saved during signup
  const savedUser = JSON.parse(localStorage.getItem('movieUser'));

  if (!savedUser) {
    errorEl.textContent = "No account found. Please sign up first.";
    return;
  }

  if (username !== savedUser.username || password !== savedUser.password) {
    errorEl.textContent = "Wrong username or password";
    return;
  }

  // SUCCESS - show step 2 like signup last page
  document.getElementById('loginUsernameShow').textContent = username;
  document.getElementById('loginAvatar').src = savedUser.avatar || "images/moana.png";

  document.getElementById('loginStep1').classList.remove('active');
  document.getElementById('loginStep2').classList.add('active');

  // Hide right image, like signup profile page
  document.querySelector('.auth-container').classList.add('profile-mode');
}

function goToHome() {
  window.location.href = "index.html";
}