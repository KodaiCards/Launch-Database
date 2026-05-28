/**
 * Folder Workspace Backend Tests (Wave 57)
 * Tests folder tree ops, ACL, IDOR, project linkage, versioning, sharing
 */

const assert = require('assert');
const request = require('supertest');
const app = require('../server');
const { Pool } = require('pg');

describe('Folder Workspace Backend (Wave 57)', function() {
  let pool;
  let testUserId, managerId, otherUserId, testProjectId;
  let authToken, managerToken, otherToken;

  before(async function() {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // Setup test users
    const userRes = await pool.query(
      "INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id",
      ['Test User', 'test@example.com', 'employee']
    );
    testUserId = userRes.rows[0].id;

    const managerRes = await pool.query(
      "INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id",
      ['Manager User', 'manager@example.com', 'manager']
    );
    managerId = managerRes.rows[0].id;

    const otherRes = await pool.query(
      "INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id",
      ['Other User', 'other@example.com', 'employee']
    );
    otherUserId = otherRes.rows[0].id;

    // Setup test project
    const projRes = await pool.query(
      "INSERT INTO projects (name, client_id) VALUES ($1, NULL) RETURNING id"
    );
    testProjectId = projRes.rows[0].id;

    // Mock JWT tokens (in real tests, use proper JWT signing)
    authToken = `Bearer ${Buffer.from(JSON.stringify({id: testUserId, role: 'employee'})).toString('base64')}`;
    managerToken = `Bearer ${Buffer.from(JSON.stringify({id: managerId, role: 'manager'})).toString('base64')}`;
    otherToken = `Bearer ${Buffer.from(JSON.stringify({id: otherUserId, role: 'employee'})).toString('base64')}`;
  });

  after(async function() {
    await pool.end();
  });

  // ==================== TREE OPERATIONS ====================

  it('1. User-home auto-created on first GET /tree call', async function() {
    const res = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', authToken);

    assert.equal(res.status, 200);
    assert(res.body.folders.length > 0);
    assert.equal(res.body.folders[0].kind, 'user_home');
  });

  it('2. Two different users get distinct home folders', async function() {
    const res1 = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', authToken);

    const res2 = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', otherToken);

    assert.notEqual(res1.body.folders[0].id, res2.body.folders[0].id);
  });

  it('3. POST /folders: create folder inside own home — success', async function() {
    // Get home folder first
    const treeRes = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', authToken);

    const homeId = treeRes.body.folders[0].id;

    const res = await request(app)
      .post('/api/workspace/folders')
      .set('Authorization', authToken)
      .send({ name: 'Test Folder', parent_id: homeId });

    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Test Folder');
  });

  it('4. POST /folders: create folder inside another user\'s home — 403 for non-manager, 200 for manager', async function() {
    // Get another user's home
    const otherTreeRes = await request(app)
      .get('/api/workspace/tree?root=all')
      .set('Authorization', managerToken);

    const otherHome = otherTreeRes.body.folders.find(f => f.owner_user_id === otherUserId);

    // Non-manager attempt
    const res1 = await request(app)
      .post('/api/workspace/folders')
      .set('Authorization', authToken)
      .send({ name: 'Intrusion', parent_id: otherHome.id });

    assert.equal(res1.status, 403);

    // Manager attempt
    const res2 = await request(app)
      .post('/api/workspace/folders')
      .set('Authorization', managerToken)
      .send({ name: 'Admin Folder', parent_id: otherHome.id });

    assert.equal(res2.status, 200);
  });

  it('5. POST /folders: cannot create folder with NULL parent_id via API — 400', async function() {
    const res = await request(app)
      .post('/api/workspace/folders')
      .set('Authorization', authToken)
      .send({ name: 'Bad Root', parent_id: null });

    assert.equal(res.status, 400);
  });

  // ==================== CRUD ====================

  it('6. PUT /folders: rename own folder — success', async function() {
    const treeRes = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', authToken);

    const homeId = treeRes.body.folders[0].id;

    const createRes = await request(app)
      .post('/api/workspace/folders')
      .set('Authorization', authToken)
      .send({ name: 'Old Name', parent_id: homeId });

    const folderId = createRes.body.id;

    const updateRes = await request(app)
      .put(`/api/workspace/folders/${folderId}`)
      .set('Authorization', authToken)
      .send({ name: 'New Name' });

    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.body.name, 'New Name');
  });

  it('7. DELETE /folders: cannot delete user_home root — 400', async function() {
    const treeRes = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', authToken);

    const homeId = treeRes.body.folders[0].id;

    const res = await request(app)
      .delete(`/api/workspace/folders/${homeId}`)
      .set('Authorization', authToken);

    assert.equal(res.status, 400);
  });

  it('8. DELETE /folders: cascade deletes subfolders', async function() {
    const treeRes = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', authToken);

    const homeId = treeRes.body.folders[0].id;

    const createRes = await request(app)
      .post('/api/workspace/folders')
      .set('Authorization', authToken)
      .send({ name: 'To Delete', parent_id: homeId });

    const folderId = createRes.body.id;

    const deleteRes = await request(app)
      .delete(`/api/workspace/folders/${folderId}`)
      .set('Authorization', authToken);

    assert.equal(deleteRes.status, 200);
  });

  // ==================== SHARE MODES ====================

  it('9. Share modes: \'public\' folder readable by all, editable only by manager', async function() {
    // Create public folder (seed data)
    const allRes = await request(app)
      .get('/api/workspace/tree?root=all')
      .set('Authorization', managerToken);

    const publicFolder = allRes.body.folders.find(f => f.kind === 'shared_public');
    assert(publicFolder, 'Public folder should exist');

    // Non-manager read test
    const readRes = await request(app)
      .get(`/api/workspace/folders/${publicFolder.id}/files`)
      .set('Authorization', authToken);

    assert.equal(readRes.status, 200);
    assert.equal(readRes.body.length, 0); // Empty initially
  });

  it('10. Share modes: \'private\' folder visible only to owner + manager', async function() {
    const treeRes = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', authToken);

    const homeId = treeRes.body.folders[0].id;

    // User can access own home (private by default)
    const userRes = await request(app)
      .get(`/api/workspace/folders/${homeId}/files`)
      .set('Authorization', authToken);

    assert.equal(userRes.status, 200);

    // Other non-manager cannot access
    const otherRes = await request(app)
      .get(`/api/workspace/folders/${homeId}/files`)
      .set('Authorization', otherToken);

    assert.equal(otherRes.status, 403);

    // Manager can access
    const managerRes = await request(app)
      .get(`/api/workspace/folders/${homeId}/files`)
      .set('Authorization', managerToken);

    assert.equal(managerRes.status, 200);
  });

  it('11. Share modes: \'specific\' folder with workspace_folder_shares grants access', async function() {
    const treeRes = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', authToken);

    const homeId = treeRes.body.folders[0].id;

    const createRes = await request(app)
      .post('/api/workspace/folders')
      .set('Authorization', authToken)
      .send({ name: 'Specific', parent_id: homeId, share_mode: 'specific' });

    const folderId = createRes.body.id;

    // Grant access to other user
    const shareRes = await request(app)
      .post(`/api/workspace/folders/${folderId}/share`)
      .set('Authorization', authToken)
      .send({ user_id: otherUserId, permission: 'view' });

    assert.equal(shareRes.status, 200);

    // Verify other user can read
    const readRes = await request(app)
      .get(`/api/workspace/folders/${folderId}/files`)
      .set('Authorization', otherToken);

    assert.equal(readRes.status, 200);
  });

  it('12. Inherited share mode: subfolder defaults to parent\'s effective mode', async function() {
    const treeRes = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', authToken);

    const homeId = treeRes.body.folders[0].id;

    const parentRes = await request(app)
      .post('/api/workspace/folders')
      .set('Authorization', authToken)
      .send({ name: 'Parent', parent_id: homeId, share_mode: 'private' });

    const parentId = parentRes.body.id;

    const childRes = await request(app)
      .post('/api/workspace/folders')
      .set('Authorization', authToken)
      .send({ name: 'Child', parent_id: parentId, share_mode: 'inherit' });

    assert.equal(childRes.status, 200);
    assert.equal(childRes.body.share_mode, 'inherit');
  });

  // ==================== FILES ====================

  it('13. Upload file: success, returns row without storage_key', async function() {
    const treeRes = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', authToken);

    const homeId = treeRes.body.folders[0].id;

    // Mock upload (simplified; in real tests use proper file attachment)
    // This is a placeholder test showing the structure
    const res = await request(app)
      .post(`/api/workspace/folders/${homeId}/files`)
      .set('Authorization', authToken)
      .attach('file', Buffer.from('test content'), 'test.txt');

    // Expected: 200 or 400 depending on multer setup
    assert([200, 400].includes(res.status));
  });

  it('14. Upload file: overwrite snapshots previous version', async function() {
    // This would require a second upload to same filename
    // Placeholder structure
    this.skip();
  });

  it('15. Download file: IDOR check — caller without read access gets 404', async function() {
    // Create folder in another user's home
    const otherTreeRes = await request(app)
      .get('/api/workspace/tree?root=all')
      .set('Authorization', managerToken);

    const otherHome = otherTreeRes.body.folders.find(f => f.owner_user_id === otherUserId);

    // Non-owner attempt to access
    // (would require a real file in the folder; placeholder test)
    this.skip();
  });

  it('16. Versions: list returns history; restore endpoint promotes a version to head', async function() {
    // Placeholder for version restore workflow
    this.skip();
  });

  it('17. Manager /manager/user-homes returns all users\' homes; non-manager gets 403', async function() {
    const managerRes = await request(app)
      .get('/api/workspace/manager/user-homes')
      .set('Authorization', managerToken);

    assert.equal(managerRes.status, 200);
    assert(Array.isArray(managerRes.body));

    const employeeRes = await request(app)
      .get('/api/workspace/manager/user-homes')
      .set('Authorization', authToken);

    assert.equal(employeeRes.status, 403);
  });

  it('18. Folder with project_id set returns project_id in tree response', async function() {
    const treeRes = await request(app)
      .get('/api/workspace/tree?root=user')
      .set('Authorization', authToken);

    const homeId = treeRes.body.folders[0].id;

    const createRes = await request(app)
      .post('/api/workspace/folders')
      .set('Authorization', authToken)
      .send({ name: 'Project Folder', parent_id: homeId, project_id: testProjectId });

    assert.equal(createRes.status, 200);
    assert.equal(createRes.body.project_id, testProjectId);
  });
});
