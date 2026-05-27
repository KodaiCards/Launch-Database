#!/usr/bin/env node
/**
 * PSC Client Onboarding Script
 *
 * Automates initial client org setup: creates client_organizations,
 * client_users, generates magic-link tokens, and optionally links
 * engineering contracts to the new org.
 *
 * Usage:
 *   node scripts/onboard_client.js \
 *     --name "PSC" \
 *     --short-name "psc" \
 *     --theme-color "#1B5FA0" \
 *     --user "carter@psc.com:Carter Smith:primary" \
 *     --user "ops@psc.com:Ops Team" \
 *     --link-ec-program "rus" \
 *     --link-ec-client-id "<client-id>" \
 *     --dry-run
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Load dotenv if .env exists
if (fs.existsSync(path.join(__dirname, '..', '.env'))) {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
}

const { Pool } = require('pg');

const CLIENT_TOKEN_BYTES = 32;

// ─────────────────────────────────────────────────────────────────
// Token generation (matches _client_auth.js)
// ─────────────────────────────────────────────────────────────────

function generateRawToken() {
  return crypto.randomBytes(CLIENT_TOKEN_BYTES).toString('base64url');
}

function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

// ─────────────────────────────────────────────────────────────────
// CLI parsing
// ─────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    name: null,
    shortName: null,
    themeColor: '#1B5FA0',
    logoUrl: null,
    users: [],  // { email, name, isPrimary }
    linkEcProgram: null,
    linkEcClientId: null,
    linkEcIds: [],
    dryRun: false,
    tokenExpiresDays: 365,
    outputFormat: 'markdown',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--name') {
      opts.name = args[++i];
    } else if (arg === '--short-name') {
      opts.shortName = args[++i];
    } else if (arg === '--theme-color') {
      opts.themeColor = args[++i];
    } else if (arg === '--logo-url') {
      opts.logoUrl = args[++i];
    } else if (arg === '--user') {
      const userSpec = args[++i];
      const parts = userSpec.split(':');
      if (parts.length < 2) {
        throw new Error(`Invalid user spec: "${userSpec}". Expected "email:name[:primary]"`);
      }
      opts.users.push({
        email: parts[0],
        name: parts[1],
        isPrimary: parts[2] === 'primary',
      });
    } else if (arg === '--link-ec-program') {
      opts.linkEcProgram = args[++i];
    } else if (arg === '--link-ec-client-id') {
      opts.linkEcClientId = args[++i];
    } else if (arg === '--link-ec-id') {
      opts.linkEcIds.push(args[++i]);
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--token-expires-days') {
      opts.tokenExpiresDays = parseInt(args[++i], 10);
    } else if (arg === '--output-format') {
      opts.outputFormat = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  // Validate required args
  if (!opts.name) {
    throw new Error('--name is required');
  }
  if (opts.users.length === 0) {
    throw new Error('At least one --user is required');
  }

  // Ensure exactly one user is primary (default first if none marked)
  const primaryCount = opts.users.filter(u => u.isPrimary).length;
  if (primaryCount === 0) {
    opts.users[0].isPrimary = true;
  } else if (primaryCount > 1) {
    throw new Error('Only one user can be marked as primary');
  }

  return opts;
}

function printHelp() {
  console.log(`
PSC Client Onboarding Script

Usage:
  node scripts/onboard_client.js [OPTIONS]

Required:
  --name <string>                    Organization display name
  --user <email:name[:primary]>      Client user (repeatable, ≥1 required)

Optional:
  --short-name <string>              Short slug for URLs
  --theme-color <hex>                Portal theme color (default: #1B5FA0)
  --logo-url <url|path>              Logo URL or local file path
  --link-ec-program <program>        Link ECs by program (rus|bau|gfr|other)
  --link-ec-client-id <uuid>         Further filter EC linking by Launch DB client_id
  --link-ec-id <uuid>                Link specific EC by id (repeatable)
  --token-expires-days <n>           Token validity window (default: 365)
  --output-format <format>           json | markdown (default: markdown)
  --dry-run                          Show plan, no DB writes
  --help                             Show this help message

Examples:
  node scripts/onboard_client.js \\
    --name "PSC" \\
    --short-name "psc" \\
    --theme-color "#1B5FA0" \\
    --user "carter@psc.com:Carter Smith:primary" \\
    --user "ops@psc.com:Ops Team" \\
    --link-ec-program "rus"
  `);
}

// ─────────────────────────────────────────────────────────────────
// Output formatting
// ─────────────────────────────────────────────────────────────────

function formatMarkdownOutput(org, users, tokens, ecsLinked) {
  const expiresDate = tokens[0] && tokens[0].expiresAt
    ? new Date(tokens[0].expiresAt).toISOString().split('T')[0]
    : 'never';

  let output = `## Client Onboarding Complete: ${org.name}\n\n`;
  output += `**Org ID:** ${org.id}\n`;
  output += `**Status:** ${org.status}\n`;
  if (org.theme_color) output += `**Theme:** ${org.theme_color}\n`;
  if (ecsLinked > 0) output += `**ECs Linked:** ${ecsLinked}\n`;
  output += `\n### Magic Links (share securely — these expire ${expiresDate}):\n\n`;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const token = tokens[i];
    const role = user.is_primary ? '(primary)' : '';
    output += `- ${user.name} <${user.email}> ${role}: [Magic Link](${token.loginUrl})\n`;
  }

  output += `\n**WARNING:** Tokens shown above are unrecoverable. `;
  output += `If lost, revoke + regenerate via the admin UI at /admin.\n`;

  return output;
}

function formatJsonOutput(org, users, tokens, ecsLinked) {
  return JSON.stringify({
    org: {
      id: org.id,
      name: org.name,
      short_name: org.short_name,
      status: org.status,
      theme_color: org.theme_color,
      ecs_linked: ecsLinked,
    },
    users: users.map((user, i) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      is_primary: user.is_primary,
      created_at: user.created_at,
      token: {
        raw: tokens[i].rawToken,
        login_url: tokens[i].loginUrl,
        expires_at: tokens[i].expiresAt,
      },
    })),
  }, null, 2);
}

// ─────────────────────────────────────────────────────────────────
// Main onboarding logic
// ─────────────────────────────────────────────────────────────────

async function onboard(opts) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://localhost/launch_db',
  });

  try {
    if (opts.dryRun) {
      console.log('\n=== DRY RUN ===\n');
      console.log(`Will create organization: ${opts.name}`);
      console.log(`Users to create: ${opts.users.length}`);
      opts.users.forEach(u => {
        console.log(`  - ${u.email} (${u.name})${u.isPrimary ? ' [PRIMARY]' : ''}`);
      });
      if (opts.linkEcProgram) {
        console.log(`\nWill link engineering_contracts with program="${opts.linkEcProgram}"`);
        if (opts.linkEcClientId) console.log(`  Filter: client_id="${opts.linkEcClientId}"`);
      }
      if (opts.linkEcIds.length > 0) {
        console.log(`\nWill link ${opts.linkEcIds.length} specific engineering contracts by ID`);
      }
      console.log('\n(No database writes in dry-run mode)\n');
      return;
    }

    console.log(`\nOnboarding client: ${opts.name}...`);

    // Begin transaction
    await pool.query('BEGIN');

    // 1. Create org
    const orgResult = await pool.query(`
      INSERT INTO client_organizations (name, short_name, logo_url, theme_color)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [opts.name, opts.shortName || null, opts.logoUrl || null, opts.themeColor || null]);

    const org = orgResult.rows[0];
    console.log(`✓ Created org: ${org.id}`);

    // 2. Create users + tokens
    const users = [];
    const tokens = [];

    for (const userSpec of opts.users) {
      // Create user
      const userResult = await pool.query(`
        INSERT INTO client_users (org_id, email, name, is_primary)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [org.id, userSpec.email, userSpec.name, userSpec.isPrimary]);

      const user = userResult.rows[0];
      users.push(user);

      // Generate token
      const rawToken = generateRawToken();
      const tokenHash = hashToken(rawToken);
      const expiresAt = opts.tokenExpiresDays
        ? new Date(Date.now() + opts.tokenExpiresDays * 86400 * 1000)
        : null;

      const tokenResult = await pool.query(`
        INSERT INTO client_tokens (client_user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, created_at, expires_at
      `, [user.id, tokenHash, expiresAt]);

      const baseUrl = process.env.CLIENT_PORTAL_BASE_URL || 'http://localhost:8787';
      const loginUrl = `${baseUrl}/client/login/${rawToken}`;

      tokens.push({
        rawToken,
        loginUrl,
        tokenId: tokenResult.rows[0].id,
        createdAt: tokenResult.rows[0].created_at,
        expiresAt: tokenResult.rows[0].expires_at,
      });

      console.log(`✓ Created user: ${user.email}`);
    }

    // 3. Link ECs if requested
    let ecsLinked = 0;
    if (opts.linkEcProgram || opts.linkEcIds.length > 0) {
      let whereClause = 'WHERE client_org_id IS NULL';  // Only unlinked ECs
      const params = [];

      if (opts.linkEcProgram) {
        whereClause += ` AND program = $${params.length + 1}`;
        params.push(opts.linkEcProgram);
      }

      if (opts.linkEcClientId) {
        whereClause += ` AND client_id = $${params.length + 1}`;
        params.push(opts.linkEcClientId);
      }

      if (opts.linkEcIds.length > 0) {
        const idList = opts.linkEcIds.join(',');
        whereClause = `WHERE id = ANY($1::uuid[])`;
        params.unshift(opts.linkEcIds);
      }

      // Count before update
      const countResult = await pool.query(
        `SELECT COUNT(*) FROM engineering_contracts ${whereClause}`,
        params
      );
      ecsLinked = parseInt(countResult.rows[0].count, 10);

      if (ecsLinked > 0) {
        // Prompt for confirmation
        console.log(`\nFound ${ecsLinked} engineering contracts to link.`);
        console.log('Linking them now...');

        // Update
        await pool.query(
          `UPDATE engineering_contracts SET client_org_id = $1 ${whereClause}`,
          [org.id, ...params]
        );
        console.log(`✓ Linked ${ecsLinked} engineering contracts`);
      }
    }

    // Commit
    await pool.query('COMMIT');

    // Output results
    console.log('\n');
    if (opts.outputFormat === 'json') {
      console.log(formatJsonOutput(org, users, tokens, ecsLinked));
    } else {
      console.log(formatMarkdownOutput(org, users, tokens, ecsLinked));
    }

  } catch (error) {
    // Rollback on any error
    try {
      await pool.query('ROLLBACK');
    } catch (rbErr) {
      // Ignore rollback errors
    }

    if (error.code === '23505') {
      // Unique constraint violation
      console.error(`\n✗ Error: Duplicate entry. Check that user emails don't already exist in this org.`);
      console.error(`  (${error.message})\n`);
      process.exit(3);
    } else if (error.code === '23503') {
      // Foreign key violation
      console.error(`\n✗ Error: Foreign key constraint violated (org not found?).`);
      console.error(`  (${error.message})\n`);
      process.exit(3);
    } else {
      console.error(`\n✗ Error: ${error.message}\n`);
      process.exit(2);
    }
  } finally {
    await pool.end();
  }
}

// ─────────────────────────────────────────────────────────────────
// CLI entry point
// ─────────────────────────────────────────────────────────────────

async function main() {
  try {
    const opts = parseArgs();
    await onboard(opts);
  } catch (error) {
    console.error(`\n✗ Error: ${error.message}\n`);
    process.exit(1);
  }
}

main();
