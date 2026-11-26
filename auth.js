// auth.js - FOR signup.html ONLY
// login is handled separately in login.js

let selectedAvatar = "assets/profile-1.svg";

// --- SHOW / HIDE PASSWORD ---
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

// --- HELPERS ---
function showError(msg) {
  const el = document.getElementById('errorMsg');
  if (el) el.textContent = msg;
}

function showStep(stepNumber) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  ['step1', 'step2', 'step3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById('step' + stepNumber);
  if (target) target.classList.add('active');
}

// --- SIGNUP - STEP 1 -> STEP 2 ---
function goToProfile() {
  const fullname = document.getElementById('fullname')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value.trim();
  const confirm = document.getElementById('confirmPassword')?.value.trim();
  const username = document.getElementById('username')?.value.trim();

  if (!fullname || !email || !password || !confirm || !username) {
    showError("Please fill all fields");
    return;
  }
  if (password !== confirm) {
    showError("Passwords do not match");
    return;
  }
  if (password.length < 6) {
    showError("Password must be at least 6 characters");
    return;
  }

  // Check if account already exists
  const existing = JSON.parse(localStorage.getItem('movieUser') || 'null');
  if (existing && existing.email === email) {
    showError("This email already has an account. Please login instead.");
    return;
  }

  // Save user - login.js will read this same data
  localStorage.setItem('movieUser', JSON.stringify({ fullname, email, username, password }));
  localStorage.setItem('isLoggedIn', 'true');

  const greeting = document.getElementById('greeting');
  if (greeting) greeting.textContent = "Hi " + username;
  const finalUsername = document.getElementById('finalUsername');
  if (finalUsername) finalUsername.textContent = username;

  showError("");
  showStep(2);
  document.querySelector('.auth-container')?.classList.add('profile-mode');
}

// --- SELECT AVATAR ---
function selectProfile(img) {
  document.querySelectorAll('.profile-grid-figma img').forEach(i => i.classList.remove('selected'));
  img.classList.add('selected');
  selectedAvatar = img.src;

  const topPreview = document.getElementById('topPreview');
  if (topPreview) topPreview.innerHTML = '<img src="' + selectedAvatar + '" alt="profile">';
  const finalAvatar = document.getElementById('finalAvatar');
  if (finalAvatar) finalAvatar.src = selectedAvatar;
}

// --- UPLOAD AVATAR ---
function uploadAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    selectedAvatar = e.target.result;
    const topPreview = document.getElementById('topPreview');
    if (topPreview) topPreview.innerHTML = '<img src="' + selectedAvatar + '" alt="profile">';
    const finalAvatar = document.getElementById('finalAvatar');
    if (finalAvatar) finalAvatar.src = selectedAvatar;
  };
  reader.readAsDataURL(file);
}

// --- SIGNUP - STEP 2 -> STEP 3 ---
function finishSignup() {
  let user = JSON.parse(localStorage.getItem('movieUser') || '{}');
  user.avatar = selectedAvatar;
  localStorage.setItem('movieUser', JSON.stringify(user));
  localStorage.setItem('isLoggedIn', 'true');

  showStep(3);
}

// --- COMMON ---
function goToHome() {
  window.location.href = "index.html";
}

function logoutUser() {
  localStorage.setItem('isLoggedIn', 'false');
  window.location.href = "login.html";
}

window.addEventListener('DOMContentLoaded', function() {
  const savedUser = JSON.parse(localStorage.getItem('movieUser') || 'null');
  if (savedUser && document.getElementById('finalAvatar')) {
    document.getElementById('finalAvatar').src = savedUser.avatar || selectedAvatar;
  }
});