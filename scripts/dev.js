import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting Bizpark Studio Full-Stack Development Environment...');

// Start Express Backend
const serverProcess = spawn('node', ['server/index.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

// Start Vite Frontend
const viteProcess = spawn('npx', ['vite'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\n🛑 Shutting down Bizpark Studio processes...');
  try {
    serverProcess.kill();
  } catch {}
  try {
    viteProcess.kill();
  } catch {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
