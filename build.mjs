import {build} from 'esbuild';
await build({entryPoints:['src/music.js'],outfile:'public/music-bundle.js',bundle:true,minify:true,platform:'browser',format:'iife',target:['safari15','chrome100']});
console.log('Página y música listas para Vercel.');

