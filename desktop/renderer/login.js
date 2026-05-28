document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
});

async function handleLogin(event) {
  event.preventDefault();

  const serverInput = document.getElementById('server');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMessageEl = document.getElementById('errorMessage');

  const server = serverInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!server || !username || !password) {
    showError('Please fill in all fields.');
    return;
  }

  try {
    // Disable form during submission
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    const result = await window.api.login({ server, username, password });

    if (result.success) {
      // Login successful, redirect to main app
      window.location.href = 'index.html';
    } else {
      showError(result.error || 'Login failed. Please check your credentials.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
      passwordInput.value = '';
    }
  } catch (err) {
    showError(`An error occurred: ${err.message}`);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign In';
    passwordInput.value = '';
  }
}

function showError(message) {
  const errorEl = document.getElementById('errorMessage');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}
