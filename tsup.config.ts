import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli/index.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  target: 'node16',
  banner: {
    js: '#!/usr/bin/env node'
  },
  onSuccess: 'chmod +x dist/cli.js'
});