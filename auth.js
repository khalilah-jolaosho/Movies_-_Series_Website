let selectedAvatar = "images/moana.png";

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

function goToProfile() {
  const fullname = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirm = document.getElementById('confirmPassword').value.trim();
  const username = document.getElementById('username').value.trim();

  if (!fullname || !email || !password || !confirm || !username) {
    document.getElementById('errorMsg').textContent = "Please fill all fields";
    return;
  }
  if (password !== confirm) {
    document.getElementById('errorMsg').textContent = "Passwords do not match";
    return;
  }

  localStorage.setItem('movieUser', JSON.stringify({ fullname, email, username, password }));
  document.getElementById('greeting').textContent = "Hi " + username;
  document.getElementById('finalUsername').textContent = username;

  document.getElementById('step1').classList.remove('active');
  document.getElementById('step2').classList.add('active');

  document.querySelector('.auth-container').classList.add('profile-mode');
}

function selectProfile(img) {
  document.querySelectorAll('.profile-grid-figma img').forEach(i => i.classList.remove('selected'));
  img.classList.add('selected');
  selectedAvatar = img.src;

  document.getElementById('topPreview').innerHTML = '<img src="' + selectedAvatar + '" alt="profile">';
  document.getElementById('finalAvatar').src = selectedAvatar;
}

function uploadAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  selectedAvatar = url;
  document.getElementById('topPreview').innerHTML = '<img src="' + url + '" alt="profile">';
  document.getElementById('finalAvatar').src = url;
}

function finishSignup() {
  let user = JSON.parse(localStorage.getItem('movieUser'));
  user.avatar = selectedAvatar;
  localStorage.setItem('movieUser', JSON.stringify(user));
  document.getElementById('step2').classList.remove('active');
  document.getElementById('step3').classList.add('active');
}

function goToHome() {
  window.location.href = "index.html";
}