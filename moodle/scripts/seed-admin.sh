#!/usr/bin/env bash
# seed-admin.sh
#
# Run-once script to create a non-default Moodle admin account.
# The bitnami/moodle default credentials (user: user / password: bitnami)
# are well-known — this script replaces them with a secure admin account.
#
# Run after first successful boot:
#   MOODLE_BASE_URL=https://training.launchfiber.com \
#   MOODLE_SERVICE_TOKEN=<webservice token> \
#   NEW_ADMIN_USERNAME=moodleadmin \
#   NEW_ADMIN_PASSWORD=<strong password> \
#   NEW_ADMIN_EMAIL=admin@launchfiber.com \
#   bash moodle/scripts/seed-admin.sh
#
# OR run directly inside the Moodle container via Railway shell:
#   bash /tmp/seed-admin.sh
#   (copy this file into the container first via railway exec)
#
# REQUIREMENTS:
#   - Moodle's Web Services must be enabled:
#       Site administration → Advanced features → Enable web services → On
#   - REST protocol must be enabled:
#       Site administration → Plugins → Web services → Manage protocols → REST → On
#   - A service token with 'core_user_create_users' capability must exist
#       (or use the default admin token from first login).
#
# ALTERNATIVE (simpler, no token needed):
#   Run php admin/cli/reset_password.php inside the container to change
#   the bitnami default password directly. See note at bottom of script.
# ---------------------------------------------------------------------------

set -euo pipefail

MOODLE_BASE_URL="${MOODLE_BASE_URL:?Set MOODLE_BASE_URL, e.g. https://training.launchfiber.com}"
TOKEN="${MOODLE_SERVICE_TOKEN:?Set MOODLE_SERVICE_TOKEN (Moodle web service token)}"
NEW_USERNAME="${NEW_ADMIN_USERNAME:-moodleadmin}"
NEW_PASSWORD="${NEW_ADMIN_PASSWORD:?Set NEW_ADMIN_PASSWORD}"
NEW_EMAIL="${NEW_ADMIN_EMAIL:?Set NEW_ADMIN_EMAIL}"
NEW_FIRSTNAME="${NEW_ADMIN_FIRSTNAME:-Launch}"
NEW_LASTNAME="${NEW_ADMIN_LASTNAME:-Admin}"

REST_ENDPOINT="${MOODLE_BASE_URL}/webservice/rest/server.php"

echo "Creating new admin user: ${NEW_USERNAME} <${NEW_EMAIL}>"

RESPONSE=$(curl -sf \
  -X POST "${REST_ENDPOINT}" \
  --data-urlencode "wstoken=${TOKEN}" \
  --data-urlencode "wsfunction=core_user_create_users" \
  --data-urlencode "moodlewsrestformat=json" \
  --data-urlencode "users[0][username]=${NEW_USERNAME}" \
  --data-urlencode "users[0][password]=${NEW_PASSWORD}" \
  --data-urlencode "users[0][firstname]=${NEW_FIRSTNAME}" \
  --data-urlencode "users[0][lastname]=${NEW_LASTNAME}" \
  --data-urlencode "users[0][email]=${NEW_EMAIL}" \
  --data-urlencode "users[0][auth]=manual" \
  --data-urlencode "users[0][idnumber]=" \
  --data-urlencode "users[0][lang]=en" \
  --data-urlencode "users[0][timezone]=America/Chicago" \
  --data-urlencode "users[0][mailformat]=1" \
)

echo "API response: ${RESPONSE}"

# Check for Moodle REST error envelope.
if echo "${RESPONSE}" | grep -q '"exception"'; then
  echo "ERROR: Moodle returned an exception. Check the token has core_user_create_users capability."
  exit 1
fi

# Extract new user id from response.
NEW_USER_ID=$(echo "${RESPONSE}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0]['id'])" 2>/dev/null || true)

if [ -n "${NEW_USER_ID}" ]; then
  echo "User created with id=${NEW_USER_ID}."
else
  echo "Could not parse user id from response — check output above."
fi

echo ""
echo "NEXT STEP: Assign site-administrator role to user '${NEW_USERNAME}'."
echo "  Site administration → Users → Site administrators → Add ${NEW_USERNAME}"
echo ""
echo "SECURITY: Once the new admin account is confirmed, disable or change"
echo "the bitnami default 'user' account:"
echo "  Site administration → Users → Accounts → Browse list of users → user → Suspend"

# ---------------------------------------------------------------------------
# ALTERNATIVE if web services are not yet enabled (run inside the container):
#
#   /opt/bitnami/php/bin/php /opt/bitnami/moodle/admin/cli/reset_password.php
#
# Follow the interactive prompts to reset the 'user' (bitnami default) password.
# ---------------------------------------------------------------------------
