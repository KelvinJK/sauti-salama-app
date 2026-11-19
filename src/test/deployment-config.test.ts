import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const config = readFileSync(resolve(process.cwd(), 'vite.config.ts'), 'utf8');
const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));

describe('Lovable deployment configuration', () => {
  it('uses the installed Lovable wrapper that pins the deployment output to dist', () => {
    expect(config).toContain("import { defineConfig } from '@lovable.dev/vite-tanstack-config'");
    expect(pkg.devDependencies['@lovable.dev/vite-tanstack-config']).toBeTruthy();
    expect(config).not.toContain("from 'nitro/vite'");
  });

  it('keeps the publishing command, custom server entry and MCP plugin', () => {
    expect(pkg.scripts['build:dev']).toBe('vite build --mode development');
    expect(config).toContain("server: { entry: 'server' }");
    expect(config).toContain('plugins: [mcpPlugin({ trustForwardedHost: false })]');
  });
});