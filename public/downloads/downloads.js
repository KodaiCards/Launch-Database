async function loadInstallers() {
  const placeholderId = 'installer-placeholder';
  const contentId = 'installer-content';
  const platformNameId = 'platform-name';
  const sizeId = 'installer-size';
  const dateId = 'installer-date';
  const buttonId = 'download-button';

  try {
    const response = await fetch('/api/downloads/manifest');
    if (!response.ok) {
      showError('Failed to fetch installers.');
      return;
    }

    const data = await response.json();
    const installers = data.installers || [];

    if (installers.length === 0) {
      showComingSoon();
      return;
    }

    // Use the first available installer (or filter by user platform if needed)
    const installer = installers[0];

    // Map platform to display name
    const platformNames = {
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
    };
    const displayName = platformNames[installer.platform] || installer.platform;

    // Format size (bytes to MB)
    const sizeMB = (installer.size_bytes / (1024 * 1024)).toFixed(2);

    // Format date
    const releaseDate = new Date(installer.released_at);
    const formattedDate = releaseDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Update DOM
    document.getElementById(placeholderId).style.display = 'none';
    document.getElementById(contentId).style.display = 'block';
    document.getElementById(platformNameId).textContent = `${displayName} Installer`;
    document.getElementById(sizeId).textContent = `${sizeMB} MB`;
    document.getElementById(dateId).textContent = formattedDate;

    const button = document.getElementById(buttonId);
    button.href = installer.download_url;
    button.download = installer.filename;
  } catch (err) {
    console.error('Error loading installers:', err);
    showError('An error occurred. Please try again later.');
  }
}

function showComingSoon() {
  const placeholderId = 'installer-placeholder';
  const placeholder = document.getElementById(placeholderId);
  placeholder.innerHTML = '<p class="coming-soon">Coming soon — desktop installer build pending</p>';
  placeholder.style.display = 'block';
}

function showError(message) {
  const placeholderId = 'installer-placeholder';
  const placeholder = document.getElementById(placeholderId);
  placeholder.innerHTML = `<p class="error-message">${message}</p>`;
  placeholder.style.display = 'block';
}

// Load installers when page loads
document.addEventListener('DOMContentLoaded', loadInstallers);
