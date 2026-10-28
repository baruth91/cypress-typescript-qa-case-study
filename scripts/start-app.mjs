import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from 'node:net';

const root = resolve(import.meta.dirname, '..');
const upstream = JSON.parse(readFileSync(resolve(root, 'upstream.json'), 'utf8'));
for (const port of [3000, 3001]) {
  await new Promise((resolvePort, reject) => {
    const probe = createServer();
    probe.once('error', () => reject(new Error(`Port ${port} is occupied; stop the existing service first.`)));
    probe.listen(port, () => probe.close(resolvePort));
  });
}
const child = spawn(process.execPath, [resolve(root, 'node_modules/yarn/bin/yarn.js'), 'start'], {
  cwd: resolve(root, upstream.directory), stdio: 'inherit', windowsHide: true,
  env: { ...process.env, HUSKY: '0' },
});
child.on('error', (error) => { console.error(error); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}
