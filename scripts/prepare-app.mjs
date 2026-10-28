import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const upstream = JSON.parse(readFileSync(resolve(root, 'upstream.json'), 'utf8'));
const app = resolve(root, upstream.directory);

function run(command, args, cwd = root, extraEnv = {}) {
  const result = spawnSync(command, args, {
    cwd, stdio: 'inherit', windowsHide: true,
    env: { ...process.env, ...extraEnv },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!existsSync(resolve(app, '.git'))) {
  run('git', ['clone', '--no-checkout', upstream.repository, app]);
  run('git', ['checkout', '--detach', upstream.revision], app);
}
const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: app, encoding: 'utf8' });
if (head.status !== 0 || head.stdout.trim() !== upstream.revision) {
  throw new Error('Application revision differs from upstream.json. Preserve your changes and inspect it.');
}
run(process.execPath, [resolve(root, 'node_modules/yarn/bin/yarn.js'), 'install',
  '--frozen-lockfile', '--non-interactive'], app, {
  CYPRESS_INSTALL_BINARY: '0', HUSKY: '0',
});
