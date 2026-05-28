const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Workspace Manager', () => {
  test('Static assets should exist', async () => {
    const indexHtml = path.join(__dirname, '../../public/workspace/index.html');
    const workspaceJs = path.join(__dirname, '../../public/workspace/workspace.js');
    const workspaceCss = path.join(__dirname, '../../public/workspace/workspace.css');
    expect(fs.existsSync(indexHtml)).toBeTruthy();
    expect(fs.existsSync(workspaceJs)).toBeTruthy();
    expect(fs.existsSync(workspaceCss)).toBeTruthy();
  });

  test('Workspace HTML should have required DOM elements', async () => {
    const indexPath = path.join(__dirname, '../../public/workspace/index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    expect(html).toContain('workspace-container');
    expect(html).toContain('tree-panel');
    expect(html).toContain('center-panel');
    expect(html).toContain('details-panel');
    expect(html).toContain('users-tree');
    expect(html).toContain('shared-tree');
    expect(html).toContain('file-table');
  });

  test('CSS should define dark mode support', async () => {
    const cssPath = path.join(__dirname, '../../public/workspace/workspace.css');
    const css = fs.readFileSync(cssPath, 'utf-8');
    expect(css).toContain('--primary');
    expect(css).toContain('--text');
    expect(css).toContain('prefers-color-scheme');
  });

  test('JavaScript should include required functions', async () => {
    const jsPath = path.join(__dirname, '../../public/workspace/workspace.js');
    const js = fs.readFileSync(jsPath, 'utf-8');
    expect(js).toContain('loadTree');
    expect(js).toContain('loadFolderContents');
    expect(js).toContain('renderFileTable');
    expect(js).toContain('showToast');
    expect(js).toContain('/api/workspace');
  });

  test('Server should include workspace tile in PORTAL_DEFS', async () => {
    const serverPath = path.join(__dirname, '../../server.js');
    const server = fs.readFileSync(serverPath, 'utf-8');
    expect(server).toContain("id: 'workspace'");
    expect(server).toContain("'Workspace'");
    expect(server).toContain('folder-tree');
  });

  test('Server should mount /workspace/ with static serve', async () => {
    const serverPath = path.join(__dirname, '../../server.js');
    const server = fs.readFileSync(serverPath, 'utf-8');
    expect(server).toContain("app.use('/workspace'");
    expect(server).toContain('public/workspace');
    expect(server).toContain('requireAuth()');
  });
});
