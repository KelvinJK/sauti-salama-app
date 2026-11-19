import { defineConfig } from '@lovable.dev/vite-tanstack-config';
import { mcpPlugin } from '@lovable.dev/mcp-js/stacks/tanstack/vite';

// Outside Lovable, preserve the existing Vercel and Node deployment targets.
// The wrapper pins Lovable builds to its Worker target and dist/ output layout.
const nitroPreset = process.env['VERCEL'] ? 'vercel' : (process.env['SERVER_PRESET'] || 'node');
const nitroOptions = {
  preset: nitroPreset,
  vercel: { functions: { regions: ['dub1'] } },
};

export default defineConfig({
  tanstackStart: {
    server: { entry: 'server' },
  },
  nitro: nitroOptions,
  vite: {
    server: { port: 3000, host: true },
    plugins: [mcpPlugin({ trustForwardedHost: false })],
  },
});
