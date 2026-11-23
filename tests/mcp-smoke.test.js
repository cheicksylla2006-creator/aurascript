'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const readline = require('node:readline');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');

test('MCP server initializes and exposes safe offline tools without the app', async (t) => {
  const isolatedHome = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-mcp-test-'));
  const child = spawn(process.execPath, [path.join(__dirname, '..', 'server', 'aura-mcp.js')], {
    env: { ...process.env, HOME: isolatedHome, USERPROFILE: isolatedHome, AURA_CONNEXION: '' },
    stdio: ['pipe', 'pipe', 'pipe']
  });
  t.after(async () => {
    if (child.exitCode === null && !child.killed) child.kill();
    fs.rmSync(isolatedHome, { recursive: true, force: true });
  });

  const rl = readline.createInterface({ input: child.stdout });
  const pending = new Map();
  rl.on('line', line => {
    let message;
    try { message = JSON.parse(line); }
    catch { return; }
    const waiter = pending.get(message.id);
    if (waiter) {
      pending.delete(message.id);
      waiter.resolve(message);
    }
  });

  function request(id, method, params = {}) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error('Timed out waiting for MCP response: ' + method));
      }, 5000);
      pending.set(id, {
        resolve: value => { clearTimeout(timer); resolve(value); }
      });
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  }

  const initialized = await request(1, 'initialize', {
    protocolVersion: '2025-06-18',
    clientInfo: { name: 'aura-mcp-smoke-test', version: '1.0.0' }
  });
  assert.equal(initialized.error, undefined);
  assert.equal(initialized.result.serverInfo.name, 'aura-script');
  assert.equal(initialized.result.serverInfo.version, '2.8.0');

  const listed = await request(2, 'tools/list');
  assert.equal(listed.error, undefined);
  const names = listed.result.tools.map(tool => tool.name);
  assert.ok(names.includes('list_documents'));
  assert.ok(names.includes('read_document'));
  assert.ok(names.includes('search_documents'));
  assert.ok(names.includes('create_document'));
});
