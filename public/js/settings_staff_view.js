// public/js/settings_staff_view.js — "View as Staff / Customer" (Wave 13C)
//
// Wires the "View as" button in the Users & Roles table.
// On click: confirm → POST /api/admin/impersonate/:userId → open new tab.
//
// Depends on: api(), esc() from admin.html inline scope.

async function viewAsUser(userId, fullName, role) {
  const isCustomer = role === 'customer';
  const label = isCustomer ? 'customer portal' : 'staff launcher';
  const confirmed = confirm(
    `View as ${fullName || userId}?\n\n` +
    `You'll be using their session — the ${label} will open in a new tab.\n` +
    `Close that tab or click EXIT to end the session.`
  );
  if (!confirmed) return;

  try {
    await api(`/api/admin/impersonate/${userId}`, 'POST');
    // The impersonation cookie is now set for this browser. Open the
    // appropriate portal in a new tab so the admin's own session is
    // not disturbed.
    const url = isCustomer ? '/customer.html' : '/launcher.html';
    window.open(url, '_blank');
  } catch (e) {
    alert('Could not start impersonation: ' + e.message);
  }
}
