// Lightweight first-run / change-server config screen.
// Loaded into the small config BrowserWindow only — the main cloud-wrapping
// BrowserWindow loads launchfiberadminportal.xyz directly.

const DEFAULT_URL = 'https://launchfiberadminportal.xyz';

document.addEventListener('DOMContentLoaded', async () => {
  const input = document.getElementById('serverUrl');
  const saveBtn = document.getElementById('saveBtn');
  const defaultBtn = document.getElementById('defaultBtn');
  const errorMsg = document.getElementById('errorMsg');

  try {
    const current = await window.api.configGetServerUrl();
    if (current) input.value = current;
    else input.value = DEFAULT_URL;
  } catch (_) {
    input.value = DEFAULT_URL;
  }

  saveBtn.addEventListener('click', async () => {
    errorMsg.textContent = '';
    const url = input.value.trim();
    if (!url) {
      errorMsg.textContent = 'Enter a server URL.';
      return;
    }
    try {
      const result = await window.api.configSetServerUrl(url);
      if (!result || !result.success) {
        errorMsg.textContent = (result && result.error) || 'Failed to save server URL.';
        return;
      }
      // Main process restarts the main window on its own after this returns.
      window.close();
    } catch (err) {
      errorMsg.textContent = err.message || 'Unexpected error.';
    }
  });

  defaultBtn.addEventListener('click', async () => {
    input.value = DEFAULT_URL;
    saveBtn.click();
  });
});
