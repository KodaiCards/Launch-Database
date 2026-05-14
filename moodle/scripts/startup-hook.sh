#!/usr/bin/env bash
# startup-hook.sh
#
# Injected via /docker-entrypoint-initdb.d/ — bitnami/moodle runs scripts
# in that directory on first boot, AFTER the Moodle installer completes.
#
# PURPOSE:
#   Configure the auth_oauth2 plugin with the Launch Fiber identity
#   provider endpoints so the Moodle SSO roundtrip is ready without
#   manual admin-UI clicks.
#
# REQUIRED ENV VARS (set in Railway Variables tab):
#   MOODLE_SITE_URL       — e.g. https://training.launchfiber.com
#   LAUNCH_DB_BASE_URL    — e.g. https://launch.launchfiber.com
#                           (base URL of the launch-database Railway service)
#   OAUTH2_CLIENT_ID      — must match OAUTH2_CLIENT_ID on launch-database
#   OAUTH2_CLIENT_SECRET  — must match OAUTH2_CLIENT_SECRET on launch-database
#
# If any of the above are missing this script exits silently — Moodle
# will still start; you will configure OAuth2 manually via Site Admin UI.
#
# Run-once guard: the script checks for a sentinel file so it doesn't
# re-apply configuration on container restart after the first boot.
# ---------------------------------------------------------------------------

set -euo pipefail

SENTINEL="/bitnami/moodledata/.oauth2_configured"

# Skip if already configured.
if [ -f "$SENTINEL" ]; then
  echo "[startup-hook] OAuth2 already configured — skipping."
  exit 0
fi

# Skip if required vars are absent.
if [ -z "${LAUNCH_DB_BASE_URL:-}" ] || [ -z "${OAUTH2_CLIENT_ID:-}" ] || [ -z "${OAUTH2_CLIENT_SECRET:-}" ]; then
  echo "[startup-hook] LAUNCH_DB_BASE_URL / OAUTH2_CLIENT_ID / OAUTH2_CLIENT_SECRET not set — skipping OAuth2 auto-config."
  echo "[startup-hook] Configure auth_oauth2 manually via: Site administration → Plugins → Authentication → OAuth 2"
  exit 0
fi

MOODLE_ROOT="/opt/bitnami/moodle"
PHP_BIN="/opt/bitnami/php/bin/php"

echo "[startup-hook] Waiting for Moodle installer to complete..."
# Moodle installer writes config.php when done; poll up to 10 minutes.
WAIT=0
until [ -f "$MOODLE_ROOT/config.php" ] || [ $WAIT -ge 600 ]; do
  sleep 5
  WAIT=$((WAIT + 5))
done

if [ ! -f "$MOODLE_ROOT/config.php" ]; then
  echo "[startup-hook] Timed out waiting for config.php — Moodle installer may have failed."
  exit 1
fi

echo "[startup-hook] Moodle config.php found. Configuring auth_oauth2 issuer..."

# Use Moodle's PHP CLI to create the OAuth2 issuer.
# Moodle's \core\oauth2\api::create_issuer() expects an array of fields.
# We drive it via a small inline PHP script run as the web user.
$PHP_BIN -r "
define('CLI_SCRIPT', true);
require('$MOODLE_ROOT/config.php');

\$issuerid = null;

// Check if an issuer named 'Launch Fiber' already exists.
\$issuers = \core\oauth2\api::get_all_issuers();
foreach (\$issuers as \$issuer) {
    if (\$issuer->get('name') === 'Launch Fiber') {
        \$issuerid = \$issuer->get('id');
        break;
    }
}

if !\$issuerid) {
    // Create a custom OAuth2 issuer.
    \$record = new stdClass();
    \$record->name               = 'Launch Fiber';
    \$record->clientid           = getenv('OAUTH2_CLIENT_ID');
    \$record->clientsecret       = getenv('OAUTH2_CLIENT_SECRET');
    \$record->loginparamsoffline = '';
    \$record->showonloginpage    = \core\oauth2\issuer::SHOWONLOGINPAGE_LINKED;
    \$record->image              = '';
    \$record->requireconfirmation = 0;

    // Endpoint base (strip trailing slash).
    \$base = rtrim(getenv('LAUNCH_DB_BASE_URL'), '/');

    \$record->authorizationendpoint = \$base . '/oauth2/authorize';
    \$record->tokenendpoint          = \$base . '/oauth2/token';
    \$record->userinfourlendpoint    = \$base . '/oauth2/userinfo';
    \$record->logouturl              = '';
    \$record->scopessupported        = 'openid email profile';

    \$issuer = \core\oauth2\api::create_issuer((object) \$record);
    \$issuerid = \$issuer->get('id');

    // Map OpenID Connect fields to Moodle user fields.
    \$mappings = [
        ['externalfield' => 'sub',                'internalfield' => 'idnumber'],
        ['externalfield' => 'email',              'internalfield' => 'email'],
        ['externalfield' => 'name',               'internalfield' => 'fullname'],
        ['externalfield' => 'preferred_username', 'internalfield' => 'username'],
    ];
    foreach (\$mappings as \$m) {
        \$mapping = new \core\oauth2\user_field_mapping(0, (object)[
            'issuerid'      => \$issuerid,
            'externalfield' => \$m['externalfield'],
            'internalfield' => \$m['internalfield'],
        ]);
        \$mapping->save();
    }

    echo '[startup-hook] OAuth2 issuer created with id=' . \$issuerid . PHP_EOL;
} else {
    echo '[startup-hook] OAuth2 issuer already exists (id=' . \$issuerid . ') — skipping create.' . PHP_EOL;
}

// Enable the oauth2 authentication plugin if not already enabled.
\$plugin = \core_plugin_manager::instance()->get_plugin_info('auth_oauth2');
if (\$plugin && !\$plugin->is_enabled()) {
    set_config('auth', implode(',', array_merge(explode(',', get_config('', 'auth')), ['oauth2'])));
    echo '[startup-hook] auth_oauth2 plugin enabled.' . PHP_EOL;
} else {
    echo '[startup-hook] auth_oauth2 already enabled.' . PHP_EOL;
}
"

touch "$SENTINEL"
echo "[startup-hook] Done. OAuth2 issuer configured for Launch Fiber."
