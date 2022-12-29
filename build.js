import mri from 'mri';
import { build } from 'esbuild';

const prog = mri(process.argv.slice(2), {
  boolean: ['watch', 'minify'],
});

build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  platform: 'browser',
  outfile: 'public/main.js',
  minify: prog.minify,
  jsxFactory: 'React',
  jsxFragment: 'Fragment',
  watch: prog.watch,
});
