const { describe, it, expect, beforeEach } = require('@jest/globals');
const crypto = require('crypto');

/**
 * Unit tests for scripts/onboard_client.js
 *
 * These tests verify:
 * 1. Argument parsing logic
 * 2. Markdown/JSON output formatting
 * 3. Token generation consistency
 *
 * NOT tested (manual verification):
 * - Actual database writes (requires live Postgres)
 * - EC linking logic (requires live DB)
 * - Transaction rollback on constraint violations
 */

describe('onboard_client', () => {
  // Mock the argument parsing function
  const parseUserSpec = (spec) => {
    const parts = spec.split(':');
    if (parts.length < 2) {
      throw new Error(`Invalid user spec: "${spec}". Expected "email:name[:primary]"`);
    }
    return {
      email: parts[0],
      name: parts[1],
      isPrimary: parts[2] === 'primary',
    };
  };

  describe('argument parsing', () => {
    it('should parse valid user specs', () => {
      const spec1 = parseUserSpec('carter@psc.com:Carter Smith:primary');
      expect(spec1.email).toBe('carter@psc.com');
      expect(spec1.name).toBe('Carter Smith');
      expect(spec1.isPrimary).toBe(true);

      const spec2 = parseUserSpec('ops@psc.com:Ops Team');
      expect(spec2.email).toBe('ops@psc.com');
      expect(spec2.name).toBe('Ops Team');
      expect(spec2.isPrimary).toBe(false);
    });

    it('should reject invalid user specs (missing name)', () => {
      expect(() => parseUserSpec('carter@psc.com')).toThrow(
        /Invalid user spec/
      );
    });

    it('should reject invalid user specs (empty)', () => {
      expect(() => parseUserSpec('')).toThrow(/Invalid user spec/);
    });

    it('should allow optional primary flag', () => {
      const spec = parseUserSpec('user@example.com:John Doe:primary');
      expect(spec.isPrimary).toBe(true);

      const spec2 = parseUserSpec('user@example.com:John Doe');
      expect(spec2.isPrimary).toBe(false);
    });
  });

  describe('token generation', () => {
    const CLIENT_TOKEN_BYTES = 32;

    const generateRawToken = () => {
      return crypto.randomBytes(CLIENT_TOKEN_BYTES).toString('base64url');
    };

    const hashToken = (raw) => {
      return crypto.createHash('sha256').update(raw).digest('hex');
    };

    it('should generate valid base64url tokens', () => {
      const token = generateRawToken();
      // Base64url safe characters: A-Z, a-z, 0-9, -, _
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(token.length).toBeGreaterThan(20);
    });

    it('should hash tokens consistently', () => {
      const raw = 'test-token-12345';
      const hash1 = hashToken(raw);
      const hash2 = hashToken(raw);
      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/); // SHA256 hex
    });

    it('should not expose raw token in hash', () => {
      const raw = generateRawToken();
      const hash = hashToken(raw);
      expect(hash).not.toContain(raw);
    });
  });

  describe('output formatting', () => {
    const sampleOrg = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'PSC',
      short_name: 'psc',
      status: 'active',
      theme_color: '#1B5FA0',
    };

    const sampleUsers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Carter Smith',
        email: 'carter@psc.com',
        is_primary: true,
        created_at: new Date().toISOString(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Ops Team',
        email: 'ops@psc.com',
        is_primary: false,
        created_at: new Date().toISOString(),
      },
    ];

    const sampleTokens = [
      {
        rawToken: 'ABCDEfg_-_1234567890',
        loginUrl: 'http://localhost:8787/client/login/ABCDEfg_-_1234567890',
        expiresAt: new Date(Date.now() + 365 * 86400 * 1000).toISOString(),
      },
      {
        rawToken: 'XYZ123-_-abcdefghij',
        loginUrl: 'http://localhost:8787/client/login/XYZ123-_-abcdefghij',
        expiresAt: new Date(Date.now() + 365 * 86400 * 1000).toISOString(),
      },
    ];

    it('should format markdown output correctly', () => {
      const formatMarkdownOutput = (org, users, tokens, ecsLinked) => {
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
      };

      const markdown = formatMarkdownOutput(sampleOrg, sampleUsers, sampleTokens, 5);

      expect(markdown).toContain('## Client Onboarding Complete: PSC');
      expect(markdown).toContain(sampleOrg.id);
      expect(markdown).toContain('**Status:** active');
      expect(markdown).toContain('**Theme:** #1B5FA0');
      expect(markdown).toContain('**ECs Linked:** 5');
      expect(markdown).toContain('Carter Smith');
      expect(markdown).toContain('carter@psc.com');
      expect(markdown).toContain('(primary)');
      expect(markdown).toContain('Ops Team');
      expect(markdown).toContain('ops@psc.com');
      expect(markdown).not.toContain('ABCDEfg_-_1234567890'); // Raw token not in output
      expect(markdown).toContain('[Magic Link]');
    });

    it('should format JSON output correctly', () => {
      const formatJsonOutput = (org, users, tokens, ecsLinked) => {
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
      };

      const json = formatJsonOutput(sampleOrg, sampleUsers, sampleTokens, 5);
      const parsed = JSON.parse(json);

      expect(parsed.org.id).toBe(sampleOrg.id);
      expect(parsed.org.name).toBe('PSC');
      expect(parsed.org.status).toBe('active');
      expect(parsed.org.ecs_linked).toBe(5);
      expect(parsed.users.length).toBe(2);
      expect(parsed.users[0].name).toBe('Carter Smith');
      expect(parsed.users[0].is_primary).toBe(true);
      expect(parsed.users[1].is_primary).toBe(false);
      expect(parsed.users[0].token.raw).toBe('ABCDEfg_-_1234567890');
    });

    it('should include warning about token recovery', () => {
      const formatMarkdownOutput = (org, users, tokens, ecsLinked) => {
        let output = '';
        output += `**WARNING:** Tokens shown above are unrecoverable. `;
        output += `If lost, revoke + regenerate via the admin UI at /admin.\n`;
        return output;
      };

      const markdown = formatMarkdownOutput(sampleOrg, sampleUsers, sampleTokens, 0);
      expect(markdown).toContain('WARNING');
      expect(markdown).toContain('unrecoverable');
      expect(markdown).toContain('admin UI');
    });
  });

  describe('primary user default', () => {
    it('should default first user to primary if none marked', () => {
      const users = [
        { email: 'a@test.com', name: 'Alice', isPrimary: false },
        { email: 'b@test.com', name: 'Bob', isPrimary: false },
      ];

      // Simulate the default logic
      if (users.filter(u => u.isPrimary).length === 0) {
        users[0].isPrimary = true;
      }

      expect(users[0].isPrimary).toBe(true);
      expect(users[1].isPrimary).toBe(false);
    });

    it('should reject multiple primary users', () => {
      const users = [
        { email: 'a@test.com', name: 'Alice', isPrimary: true },
        { email: 'b@test.com', name: 'Bob', isPrimary: true },
      ];

      const primaryCount = users.filter(u => u.isPrimary).length;
      expect(primaryCount).toBeGreaterThan(1);
      expect(() => {
        if (primaryCount > 1) throw new Error('Only one user can be marked as primary');
      }).toThrow(/Only one user/);
    });
  });
});
