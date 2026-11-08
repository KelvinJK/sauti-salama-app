import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';

// Use Vercel preset on Vercel, otherwise Node for local / VPS
const nitroPreset = process.env.VERCEL ? 'vercel' : (process.env.SERVER_PRESET || 'node');

export default defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: 'server' },
    }),
    nitro({ preset: nitroPreset }),
    viteReact(),
  ],
});
