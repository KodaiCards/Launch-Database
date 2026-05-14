########################################################################
# Moodle 4.5 — Railway service
#
# Based on bitnami/moodle:4 (bundles Apache + PHP + Moodle, non-root,
# binds to port 8080 by default).
#
# Railway injects $PORT at runtime; we honour it via
# APACHE_HTTP_PORT_NUMBER so Apache listens on the right port.
#
# Persistent volume must be mounted at /bitnami/moodledata — without
# it, all user uploads and H5P content are lost on redeploy.
########################################################################

FROM bitnami/moodle:4.5

# ---------------------------------------------------------------------------
# Railway port forwarding
# bitnami/moodle reads APACHE_HTTP_PORT_NUMBER to set Listen in httpd.conf.
# Railway sets $PORT dynamically; we default to 8080 here so a local
# docker run works without any extra flags.
# ---------------------------------------------------------------------------
ENV APACHE_HTTP_PORT_NUMBER=${PORT:-8080}

# ---------------------------------------------------------------------------
# OAuth2 first-boot injection
#
# startup-hook.sh is copied in and will be run by the bitnami entrypoint
# extension mechanism (/docker-entrypoint-initdb.d/ style).
# It waits for Moodle's installer to complete, then writes the OAuth2
# issuer configuration via Moodle's CLI admin tool (moosh or php admin/cli).
# ---------------------------------------------------------------------------
COPY scripts/startup-hook.sh /docker-entrypoint-initdb.d/startup-hook.sh
RUN chmod +x /docker-entrypoint-initdb.d/startup-hook.sh

# ---------------------------------------------------------------------------
# Data directory — Railway persistent volume should be mounted here.
# Setting MOODLE_DATA_PATH is handled via env var at runtime (see railway.json
# and README), but we EXPOSE the default so it's clear what to mount.
# ---------------------------------------------------------------------------
# VOLUME ["/bitnami/moodledata"]   # informational — Railway mounts externally

EXPOSE 8080
