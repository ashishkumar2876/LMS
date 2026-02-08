// Cleanup script to remove server/node_modules if it exists
import { rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverNodeModules = join(__dirname, 'server', 'node_modules');

try {
  rmSync(serverNodeModules, { recursive: true, force: true });
  console.log('Cleaned up server/node_modules');
} catch (error) {
  // Ignore if it doesn't exist
}
